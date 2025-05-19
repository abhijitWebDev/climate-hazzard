import React, { useEffect, useState } from "react";
import { fetchHazards } from "../api";

export default function HazardsList({ region }) {
  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    fetchHazards(region.lat, region.lon).then(data => setHazards(data.hazards || []));
  }, [region]);

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: "0 2px 8px #0001" }}>
      <h3 style={{ marginTop: 0, fontWeight: 600 }}>Detected Hazards</h3>
      {hazards.length === 0 ? (
        <div style={{ color: '#888' }}>No hazards detected for this region.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Start</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>End</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Duration (days)</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Avg Temp (°C)</th>
            </tr>
          </thead>
          <tbody>
            {hazards.map((hazard, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f1f1' }}>
                <td style={{ padding: 8 }}>{hazard.start}</td>
                <td style={{ padding: 8 }}>{hazard.end}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{hazard.duration}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{hazard.avg_temp ? hazard.avg_temp.toFixed(1) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
