import React, { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const DEFAULT_BOUNDS = [
  [37.7749, -122.4194], // SW corner (e.g. San Francisco area)
  [37.8049, -122.3894], // NE corner
];

// Helper component to select rectangle bounds on the map
const SelectRectangle = ({ bounds, setBounds }) => {
  const map = useMapEvents({
    click(e) {
      // On click, set bounds to a 0.1 by 0.1 box around clicked point (example)
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setBounds([
        [lat - 0.05, lng - 0.05],
        [lat + 0.05, lng + 0.05],
      ]);
    },
  });

  return bounds ? <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} /> : null;
};

const TrendAnalyzer = () => {
  const [bounds, setBounds] = useState(DEFAULT_BOUNDS);
  const [startYear, setStartYear] = useState(1990);
  const [endYear, setEndYear] = useState(2020);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert bounds to lat/lon for API
  const getLatLonCenter = () => {
    if (!bounds) return null;
    const [[swLat, swLng], [neLat, neLng]] = bounds;
    return {
      lat: (swLat + neLat) / 2,
      lon: (swLng + neLng) / 2,
    };
  };

  const fetchTrend = async () => {
    const center = getLatLonCenter();
    if (!center) return alert('Select a region on the map first!');

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/trends', {
        params: {
          lat: center.lat,
          lon: center.lon,
          start_year: startYear,
          end_year: endYear,
        },
      });
      setTrendData(res.data);
    } catch (err) {
      console.error('Error fetching trend data:', err);
      alert('Failed to fetch trend data.');
    } finally {
      setLoading(false);
    }
  };

  // Chart.js data setup
  const chartData = trendData
    ? {
        labels: trendData.years,
        datasets: [
          {
            label: 'Heatwaves per Year',
            data: trendData.counts,
            borderColor: 'rgba(37, 99, 235, 1)', // blue
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Trend Line',
            data: trendData.years.map((year) => trendData.slope * year + trendData.intercept),
            borderColor: 'rgba(220, 38, 38, 1)', // red
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Heatwave Trend Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Year' } },
      y: { title: { display: true, text: 'Number of Heatwaves' }, beginAtZero: true },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🌡️ Climate Hazard Trend Analyzer</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="mb-2 font-semibold text-gray-700">Select Region (click on map):</p>
          <MapContainer
            center={[37.79, -122.40]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SelectRectangle bounds={bounds} setBounds={setBounds} />
          </MapContainer>
          <p className="mt-2 text-sm text-gray-600">Current bounds: {bounds ? JSON.stringify(bounds) : 'None'}</p>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700" htmlFor="startYear">
            Start Year
          </label>
          <input
            id="startYear"
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(+e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          />

          <label className="block mt-4 mb-2 font-semibold text-gray-700" htmlFor="endYear">
            End Year
          </label>
          <input
            id="endYear"
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(+e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={fetchTrend}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Trends'}
          </button>
        </div>
      </div>

      {trendData && (
        <div className="mt-8">
          <div className="mb-4 text-gray-700 text-lg space-y-1">
            <p>
              <strong>📈 Trend:</strong> {trendData.mk_trend}
            </p>
            <p>
              <strong>↗️ Slope:</strong> {trendData.slope.toFixed(2)}
            </p>
            <p>
              <strong>🔺 % Increase:</strong> {trendData.percent_increase?.toFixed(1)}%
            </p>
          </div>

          <Line data={chartData} options={chartOptions} />

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => window.open(`http://localhost:8000/export/csv?lat=${getLatLonCenter().lat}&lon=${getLatLonCenter().lon}`, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Export CSV
            </button>
            <button
              onClick={() => window.open(`http://localhost:8000/export/pdf?lat=${getLatLonCenter().lat}&lon=${getLatLonCenter().lon}`, '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;
