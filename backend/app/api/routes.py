import io
from fastapi import APIRouter, Query
from app.ingestion.open_meteo import fetch_weather_data
from app.processing.heatwave_detector import detect_heatwaves
from app.models.mongo_client import weather_collection, heatwave_collection
from app.processing.trend_analysis import analyze_heatwave_trend
from datetime import datetime
from fastapi.responses import StreamingResponse, Response
import csv
from fpdf import FPDF
from bson import ObjectId
import base64

router = APIRouter()
def fix_objectid(doc):
    if isinstance(doc, dict):
        return {k: fix_objectid(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [fix_objectid(i) for i in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc


@router.post("/ingest")
async def ingest_data(lat: float, lon: float, start: str, end: str):
    weather_df = fetch_weather_data(lat, lon, start, end)
    heatwaves = detect_heatwaves(weather_df)

    # Store raw weather data
    if not weather_df.empty:
        weather_records = weather_df.to_dict(orient="records")
        for record in weather_records:
            record.update({"lat": lat, "lon": lon})
        weather_collection.insert_many(weather_records)
        print(f"Inserted {len(weather_records)} weather records")
    else:
        weather_records = []
        print("No weather records to insert")

    # Store heatwave events
    if heatwaves:
        for event in heatwaves:
            event.update({
                "lat": lat,
                "lon": lon,
                "type": "heatwave"
            })
        heatwave_collection.insert_many(heatwaves)
        print(f"Inserted {len(heatwaves)} heatwave events")
    else:
        print("No heatwave events to insert")

    return {
        "message": f"{len(weather_records)} weather records and {len(heatwaves)} heatwaves stored.",
        "heatwaves": fix_objectid(heatwaves)
    }

@router.get("/trends")
async def get_trend(
    lat: float,
    lon: float,
    start_year: int = 1990,
    end_year: int = 2020,
    hazard_type: str = "heatwave"
):
    events = list(heatwave_collection.find({
        "lat": lat,
        "lon": lon,
        "type": hazard_type,
        "start": {
            "$gte": datetime(start_year, 1, 1),
            "$lte": datetime(end_year, 12, 31)
        }
    }))
    for e in events:
        e["start"] = e["start"].isoformat()
    trend = analyze_heatwave_trend(events)
    return trend


@router.get("/trend-plot")
async def trend_plot(lat: float, lon: float, start_year: int = 1990, end_year: int = 2020, hazard_type: str = "heatwave"):
    events = list(heatwave_collection.find({
        "lat": lat,
        "lon": lon,
        "type": hazard_type,
        "start": {
            "$gte": datetime(start_year, 1, 1),
            "$lte": datetime(end_year, 12, 31)
        }
    }))
    for e in events:
        e["start"] = e["start"].isoformat()
    trend = analyze_heatwave_trend(events)
    if not trend or "trend_chart_base64" not in trend:
        return Response(status_code=404)
    img_bytes = base64.b64decode(trend["trend_chart_base64"])
    return Response(content=img_bytes, media_type="image/png")


@router.get("/export/csv")
async def export_csv(lat: float, lon: float):
    events = list(heatwave_collection.find({"lat": lat, "lon": lon}))
    def generate():
        header = ["start", "end", "duration", "avg_temp"]
        yield ",".join(header) + "\n"
        for e in events:
            row = [str(e["start"]), str(e["end"]), str(e["duration"]), str(e["avg_temp"])]
            yield ",".join(row) + "\n"
    return StreamingResponse(generate(), media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=heatwaves.csv"
    })

@router.get("/export/pdf")
async def export_pdf(lat: float, lon: float):
    events = list(heatwave_collection.find({"lat": lat, "lon": lon}))
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Heatwave Events Report", ln=True, align="C")
    for e in events:
        line = f"{e['start']} to {e['end']} - {e['duration']} days @ {e['avg_temp']}°C"
        pdf.cell(200, 10, txt=line, ln=True)
    buffer = io.BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=heatwaves.pdf"
    })

@router.get("/hazards")
async def get_hazards(lat: float, lon: float):
    """
    Return all detected heatwave hazards for a location.
    """
    events = list(heatwave_collection.find({"lat": lat, "lon": lon}))
    for e in events:
        e["start"] = str(e["start"])
        e["end"] = str(e["end"])
        if "_id" in e:
            e["_id"] = str(e["_id"])
    return {"hazards": events}