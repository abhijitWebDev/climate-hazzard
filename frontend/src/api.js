import axios from "axios";


const API_BASE = import.meta.env.VITE_API_URL || '';
export async function ingestWeather(lat, lon, start, end) {
  const res = await axios.post(`${API_BASE}/ingest`, null, { params: { lat, lon, start, end } });
  return res.data;
}

export async function detectHeatwave(lat, lon, start, end) {
  const res = await axios.post(`${API_BASE}/detect/heatwave/`, null, { params: { lat, lon, start, end } });
  return res.data;
}

export async function fetchHazards(lat, lon) {
  const res = await axios.get(`${API_BASE}/hazards/`, { params: { lat, lon } });
  return res.data;
}

export async function fetchTrendData(lat, lon) {
  const res = await axios.get(`${API_BASE}/trends/`, { params: { lat, lon } });
  return res.data;
}

export function getTrendPlotUrl(lat, lon) {
  return `${API_BASE}/trend-plot?lat=${lat}&lon=${lon}`;
}
