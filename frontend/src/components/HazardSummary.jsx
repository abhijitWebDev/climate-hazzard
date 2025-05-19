import React, { useEffect, useState } from "react";
import { fetchTrendData } from "../api";

export default function HazardSummary({ region }) {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchTrendData(region.lat, region.lon).then(data => {
      if (data.trend && data.trend.frequencies && data.trend.frequencies.length > 1) {
        const first = data.trend.frequencies[0];
        const last = data.trend.frequencies[data.trend.frequencies.length - 1];
        const percent = first ? Math.round(((last - first) / first) * 100) : 0;
        setSummary(`Heatwaves have ${percent >= 0 ? "increased" : "decreased"} by ${Math.abs(percent)}% in this region since ${data.trend.years[0]}.`);
      } else {
        setSummary("Not enough data for summary.");
      }
    });
  }, [region]);

  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: "0 2px 8px #0001" }}>
      <strong style={{ fontSize: 18 }}>Summary:</strong> <span style={{ fontSize: 16 }}>{summary}</span>
    </div>
  );
}
