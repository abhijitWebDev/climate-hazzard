// App.js
import React, { useState } from "react";
import RegionSelector from "./components/RegionSelector";
import DateRangePicker from "./components/DateRangePicker";
import HazardSummary from "./components/HazardSummary";
import TrendChart from "./components/TrendChart";
import HazardsList from "./components/HazardsList";
import { ingestWeather } from "./api";

function App() {
  const [region, setRegion] = useState({ lat: 40, lon: -100 });
  const [dateRange, setDateRange] = useState({ start: 1990, end: 2020 });
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    setLoading(true);
    try {
      await ingestWeather(
        region.lat,
        region.lon,
        `${dateRange.start}-01-01`,
        `${dateRange.end}-12-31`
      );
      alert("Ingestion complete!");
    } catch (e) {
      alert("Ingestion failed.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h1>Climate Hazard Analyzer</h1>
      <RegionSelector region={region} setRegion={setRegion} />
      <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      <button
        onClick={handleIngest}
        disabled={loading}
        style={{marginBottom: 24, padding: 10, borderRadius: 6, background: "#2563eb", color: "#fff", fontWeight: 600}}
      >
        {loading ? "Ingesting..." : "Ingest Weather Data"}
      </button>
      <HazardSummary region={region} dateRange={dateRange} />
      <TrendChart region={region} />
      <HazardsList region={region} />
    </div>
  );
}

export default App;
