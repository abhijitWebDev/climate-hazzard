# Climate Hazard Trend Analyzer

## Frontend (React + Vite)

This is the frontend for the Climate Hazard Trend Analyzer, built with React, Vite, and Tailwind CSS.

### Features
- Select a region and date range to analyze climate hazards (heatwaves)
- Visualize heatwave frequency trends with interactive charts
- View detected hazards in a table
- Export hazard data as CSV or PDF

### Getting Started

#### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

#### Installation
```sh
cd frontend
npm install
```

#### Environment Variables
Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=https://your-backend-url.com
```
- For local development, use `VITE_API_URL=http://localhost:8000`
- For production, use your deployed backend URL (e.g., Railway)

#### Running Locally
```sh
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

#### Building for Production
```sh
npm run build
```

#### Deploying
- Deploy to [Vercel](https://vercel.com/) for best results.
- Set the `VITE_API_URL` environment variable in the Vercel dashboard to your backend's public URL.

### Project Structure
- `src/` - React components and main app logic
- `src/api.js` - All API calls to the backend
- `src/components/` - UI components (charts, tables, selectors)

### Operations
- **Ingest Weather Data:** Select a region and date range, then click "Ingest Weather Data" to fetch and store weather and hazard data.
- **Analyze Trends:** View heatwave frequency trends in the chart.
- **View Hazards:** See a table of detected heatwave events.
- **Export:** Download hazard data as CSV or PDF.

---

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
