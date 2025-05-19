import axios from "axios";

export async function ingestWeather(lat, lon, start, end) {
  const res = await axios.post(`/ingest`, null, { params: { lat, lon, start, end } });
  return res.data;
}

export async function detectHeatwave(lat, lon, start, end) {
  const res = await axios.post(`/detect/heatwave/`, null, { params: { lat, lon, start, end } });
  return res.data;
}

export async function fetchHazards(lat, lon) {
  const res = await axios.get(`/hazards/`, { params: { lat, lon } });
  return res.data;
}

export async function fetchTrendData(lat, lon) {
  const res = await axios.get(`/trends/`, { params: { lat, lon } });
  return res.data;
}

export function getTrendPlotUrl(lat, lon) {
  return `/trend-plot?lat=${lat}&lon=${lon}`;
}
