import pandas as pd
import requests
from datetime import datetime

def fetch_weather_data(lat, lon, start_date, end_date):
    # Ensure dates are in 'YYYY-MM-DD' format
    try:
        start_date = datetime.strptime(str(start_date), "%Y-%m-%d").strftime("%Y-%m-%d")
        end_date = datetime.strptime(str(end_date), "%Y-%m-%d").strftime("%Y-%m-%d")
    except ValueError:
        raise ValueError("start_date and end_date must be in 'YYYY-MM-DD' format")

    url = (
        f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}"
        f"&start_date={start_date}&end_date={end_date}&daily=temperature_2m_max"
        f"&timezone=auto"
    )
    response = requests.get(url)
    data = response.json()
    # Error handling for missing or malformed data
    if "daily" not in data or "time" not in data["daily"] or "temperature_2m_max" not in data["daily"]:
        raise ValueError(f"Open-Meteo API error or no data: {data}")
    df = pd.DataFrame({
        "date": data["daily"]["time"],
        "max_temp": data["daily"]["temperature_2m_max"]
    })
    df["date"] = pd.to_datetime(df["date"])
    return df
