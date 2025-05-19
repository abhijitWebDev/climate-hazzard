import React from "react";

export default function DateRangePicker({ dateRange, setDateRange }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      <label style={{ flex: 1, fontWeight: 600 }}>
        Start Year:
        <input
          type="number"
          value={dateRange.start}
          min={1900}
          max={dateRange.end}
          onChange={e => setDateRange({ ...dateRange, start: parseInt(e.target.value) })}
          style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", marginTop: 2 }}
        />
      </label>
      <label style={{ flex: 1, fontWeight: 600 }}>
        End Year:
        <input
          type="number"
          value={dateRange.end}
          min={dateRange.start}
          max={new Date().getFullYear()}
          onChange={e => setDateRange({ ...dateRange, end: parseInt(e.target.value) })}
          style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", marginTop: 2 }}
        />
      </label>
    </div>
  );
}
