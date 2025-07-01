import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './NewPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NewPage() {
  const dailyData = {
    labels: ['08-18', '08-19', '08-20', '08-21', '08-22', '08-23', '08-24'],
    datasets: [
      {
        label: 'Users',
        data: [1, 2, 3, 2, 4, 1, 3],
        borderColor: '#1db954',
        backgroundColor: 'transparent',
      },
    ],
  };

  const monthlyData = {
    labels: ['05', '06', '07', '08', '09'],
    datasets: [
      {
        label: 'Users',
        data: [1, 3, 5, 7, 11],
        borderColor: '#e91429',
        backgroundColor: 'transparent',
      },
    ],
  };

  const requestData = {
    labels: ['08-05', '08-10', '08-15', '08-20', '08-25', '09-01', '09-03'],
    datasets: [
      {
        label: '/v1/search',
        data: [20, 30, 15, 90, 70, 60, 100],
        borderColor: '#e91429',
        backgroundColor: 'transparent',
      },
      {
        label: '/v1/me/playlists',
        data: [5, 10, 5, 30, 40, 20, 50],
        borderColor: '#1db954',
        backgroundColor: 'transparent',
      },
    ],
  };

  const mapPositions: [number, number][] = [
    [52, 5],
    [48, 15],
    [40, -3],
  ];

  return (
    <div className="spotify-dashboard">
      <nav className="main-nav">
        <span className="logo">Spotify for Developers</span>
        <ul>
          <li>DISCOVER</li>
          <li>DOCS</li>
          <li>CONSOLE</li>
          <li>COMMUNITY</li>
          <li className="active">DASHBOARD</li>
          <li>USE CASES</li>
        </ul>
      </nav>
      <header className="app-header">
        <div className="app-info">
          <h1>spotify_themes</h1>
          <p>A web service playing songs based on themes submitted to the Spotify API.</p>
          <p>Client ID: abc123••••</p>
          <a className="show-secret" href="#">Show client secret</a>
        </div>
        <div className="actions">
          <button className="btn-primary">EDIT SETTINGS</button>
          <button className="btn-outline">LOGOUT</button>
        </div>
      </header>
      <section className="grid">
        <div className="panel">
          <Line
            options={{
              responsive: true,
              plugins: { title: { display: true, text: 'Daily Active Users' }, legend: { display: false } },
            }}
            data={dailyData}
          />
        </div>
        <div className="panel">
          <Line
            options={{
              responsive: true,
              plugins: { title: { display: true, text: 'Monthly Active Users' }, legend: { display: false } },
            }}
            data={monthlyData}
          />
        </div>
        <div className="panel users-box">
          <div className="count">11</div>
          <div className="caption">11 users</div>
        </div>
        <div className="panel requests">
          <Line
            options={{
              responsive: true,
              plugins: { title: { display: true, text: 'Number of Requests/Endpoint' } },
            }}
            data={requestData}
          />
        </div>
        <div className="panel map">
          <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            {mapPositions.map((p, i) => (
              <CircleMarker key={i} center={p} radius={5} pathOptions={{ color: '#1db954' }} />
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
