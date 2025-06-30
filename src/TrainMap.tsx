import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as gtfs from 'gtfs-realtime-bindings';

interface TrainPosition {
  id: string;
  lat: number;
  lon: number;
  routeId?: string;
}

export default function TrainMap() {
  const [positions, setPositions] = useState<TrainPosition[]>([]);

  const fetchPositions = async () => {
    try {
      const res = await fetch('https://gtfs.ovapi.nl/nl/vehiclePositions.pb');
      if (!res.ok) return;
      const buffer = new Uint8Array(await res.arrayBuffer());
      const feed = gtfs.transit_realtime.FeedMessage.decode(buffer);
      const data = feed.entity
        .filter((e) => e.vehicle && e.vehicle.position)
        .map((e) => ({
          id: e.id || '',
          lat: e.vehicle!.position!.latitude!,
          lon: e.vehicle!.position!.longitude!,
          routeId: e.vehicle!.trip?.routeId,
        }));
      setPositions(data);
    } catch (err) {
      console.error('Failed to fetch train positions', err);
    }
  };

  useEffect(() => {
    fetchPositions();
    const id = setInterval(fetchPositions, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <MapContainer center={[52.1, 5.1]} zoom={7} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {positions.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lon]}>
          <Popup>{p.routeId ? `Route ${p.routeId}` : 'Unknown train'}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
