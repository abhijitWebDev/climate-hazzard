import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ region, setRegion }) {
  const [position, setPosition] = React.useState([region.lat, region.lon]);

  React.useEffect(() => {
    setPosition([region.lat, region.lon]);
  }, [region]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setRegion({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
          setRegion({ lat, lon: lng });
        },
      }}
    />
  );
}

export default function RegionSelector({ region, setRegion }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Select Region (click or drag marker):
      </label>
      <div style={{ height: 300, width: "100%", marginBottom: 12, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px #0001" }}>
        <MapContainer
          center={[region.lat, region.lon]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationMarker region={region} setRegion={setRegion} />
        </MapContainer>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <label style={{ flex: 1 }}>
          Latitude:
          <input
            type="number"
            value={region.lat}
            step="0.0001"
            onChange={e => setRegion({ ...region, lat: parseFloat(e.target.value) })}
            style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", marginTop: 2 }}
          />
        </label>
        <label style={{ flex: 1 }}>
          Longitude:
          <input
            type="number"
            value={region.lon}
            step="0.0001"
            onChange={e => setRegion({ ...region, lon: parseFloat(e.target.value) })}
            style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", marginTop: 2 }}
          />
        </label>
      </div>
    </div>
  );
}
