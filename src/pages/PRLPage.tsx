import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './PRLPage.css';

interface Train {
  id: number;
  lat: number;
  lon: number;
  dx: number;
  dy: number;
}

export default function PRLPage() {
  const [trains, setTrains] = useState<Train[]>([]);

  useEffect(() => {
    const initTrains: Train[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      lat: 52 + Math.random(),
      lon: 4 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 0.02,
      dy: (Math.random() - 0.5) * 0.02,
    }));
    setTrains(initTrains);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTrains((prev) =>
        prev.map((t) => {
          let lat = t.lat + t.dy;
          let lon = t.lon + t.dx;
          if (lat > 53) lat = 51;
          if (lat < 51) lat = 53;
          if (lon > 7.2) lon = 3.2;
          if (lon < 3.2) lon = 7.2;
          return { ...t, lat, lon };
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="prl-page">
      <h1>ProRail Procesleiding (PRL)</h1>
      <MapContainer center={[52.2, 5.2]} zoom={7} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {trains.map((t) => (
          <Marker key={t.id} position={[t.lat, t.lon]} />
        ))}
      </MapContainer>
    </div>
  );
}
