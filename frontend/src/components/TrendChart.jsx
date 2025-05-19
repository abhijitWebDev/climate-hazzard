import React, { useEffect, useState } from "react";
import { fetchTrendData } from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

export default function TrendChart({ region }) {
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchTrendData(region.lat, region.lon).then(data => {
      console.log("Trend data:", data);
      setTrend(data.trend);
    });
  }, [region]);

  // Support both 'counts' and 'frequencies' as y-axis data
  const yData = trend?.counts || trend?.frequencies || [];

  if (!trend || !trend.years || !Array.isArray(trend.years) || trend.years.length === 0 || yData.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: "0 2px 8px #0001" }}>
        <h3 style={{ marginTop: 0, fontWeight: 600 }}>Heatwave Frequency Trend</h3>
        <div style={{ color: "#888" }}>No trend data available for this region.</div>
      </div>
    );
  }

  const data = {
    labels: trend.years,
    datasets: [
      {
        label: "Frequency",
        data: yData,
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Heatwave Frequency Trend" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { title: { display: true, text: "Number of Heatwaves" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: "0 2px 8px #0001" }}>
      <h3 style={{ marginTop: 0, fontWeight: 600 }}>Heatwave Frequency Trend</h3>
      <Bar data={data} options={options} />
    </div>
  );
}