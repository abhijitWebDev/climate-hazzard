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
        barThickness: 60, // Make bars thicker
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
      x: { title: { display: true, text: "Year" }, type: "category" }, // Ensure bars are centered
      y: { title: { display: true, text: "Number of Heatwaves" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: "0 2px 8px #0001", maxWidth: 400, minWidth: 300 }}>
      <h3 style={{ marginTop: 0, fontWeight: 600 }}>Heatwave Frequency Trend</h3>
      <Bar data={data} options={options} />
      {/* Debug table to show the data being plotted */}
      <div style={{ marginTop: 24 }}>
        <strong>Debug Data Table:</strong>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Year</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {trend.years.map((year, idx) => (
              <tr key={year} style={{ borderBottom: '1px solid #f1f1f1' }}>
                <td style={{ padding: 8 }}>{year}</td>
                <td style={{ padding: 8 }}>{yData[idx]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}