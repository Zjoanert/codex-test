import React, { useEffect, useState } from 'react';
import TrainDelayChart from './TrainDelayChart';
import TrainMap from './TrainMap';

interface Stats {
  timestamp: number;
  value: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ timestamp: Date.now(), value: 0 });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStats(data);
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Dashboard</h1>
      <p>Timestamp: {new Date(stats.timestamp).toLocaleTimeString()}</p>
      <p>Value: {stats.value.toFixed(2)}</p>
      <TrainDelayChart />
      <TrainMap />
    </div>
  );
}
