# Climate Hazard Backend

This is the backend for the Climate Hazard Trend Analyzer, built with FastAPI and MongoDB.

## Features
- Ingest weather data from Open-Meteo API
- Detect heatwave events and store them in MongoDB
- Provide trend analysis and hazard data via REST API
- Export hazard data as CSV or PDF

## Getting Started

### Prerequisites
- Python 3.10+
- MongoDB Atlas or local MongoDB instance

### Installation
```sh
cd backend
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the `backend/` directory:
```
MONGO_URI=your-mongodb-connection-string
MONGO_DB=climate_test
```

### Running Locally
```sh
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at [http://localhost:8000](http://localhost:8000).

### Deploying
- Deploy to [Railway](https://railway.app/), [Render](https://render.com/), or similar Python-friendly PaaS.
- Set `MONGO_URI` and `MONGO_DB` as environment variables in your deployment platform.
- Make sure to allow CORS for your frontend domain in `app/main.py`.

## API Endpoints
- `POST /ingest` - Ingest weather and detect hazards for a region/date range
- `GET /trends` - Get heatwave frequency trend data
- `GET /hazards` - Get all detected hazards for a region
- `GET /export/csv` - Export hazards as CSV
- `GET /export/pdf` - Export hazards as PDF

## Operations
- **Ingest Data:** Fetches weather data, detects heatwaves, and stores results in MongoDB.
- **Trend Analysis:** Aggregates and analyzes heatwave frequency over time.
- **Hazard Listing:** Returns all detected heatwave events for a given region.
- **Export:** Provides CSV and PDF exports of hazard data.

---

## License
MIT
