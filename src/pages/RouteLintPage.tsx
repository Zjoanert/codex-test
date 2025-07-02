import React, { useState } from 'react';
import './RouteLintPage.css';

interface Segment {
  id: string;
  path: string;
}

interface Train {
  number: string;
  route: string[];
  start: [number, number];
  delay?: boolean;
}

const segments: Segment[] = [
  { id: 's1', path: 'M10 50 L70 50' },
  { id: 's2', path: 'M70 50 L150 50' },
  { id: 's3', path: 'M70 50 L70 20' },
  { id: 's4', path: 'M100 50 L100 80' },
  { id: 's5', path: 'M90 30 L120 70' },
];

const trains: Train[] = [
  { number: '1001', route: ['s1', 's2'], start: [10, 50] }, // hoofdroute
  { number: '2002', route: ['s3', 's2'], start: [70, 20] }, // invoegen
  { number: '3003', route: ['s2', 's4'], start: [70, 50] }, // uittak
  { number: '4004', route: ['s5'], start: [90, 30], delay: true }, // kruisend
];

export default function RouteLintPage() {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Train | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = trains.find((tr) => tr.number === input.trim());
    setSelected(t || null);
  };

  const colorForSegment = (id: string) => {
    if (selected && selected.route.includes(id)) return '#007bff';
    const delayed = trains.find(
      (t) => t.number !== selected?.number && t.route.includes(id) && t.delay
    );
    if (delayed) return '#ff0000';
    const occupied = trains.find(
      (t) => t.number !== selected?.number && t.route.includes(id)
    );
    if (occupied) return '#ffa500';
    return '#888';
  };

  const colorForTrain = (t: Train) => {
    if (selected?.number === t.number) return '#007bff';
    return t.delay ? '#ff0000' : '#ffa500';
  };

  return (
    <div className="route-lint-page">
      <h1>RouteLint</h1>
      <form onSubmit={handleSubmit} className="route-form">
        <label>
          Treinnummer:
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bijv. 1001"
          />
        </label>
        <button type="submit">Toon rijweg</button>
      </form>
      <svg viewBox="0 0 160 100" className="diagram">
        {segments.map((s) => (
          <path key={s.id} d={s.path} stroke={colorForSegment(s.id)} />
        ))}
        {trains.map((t) => (
          <circle
            key={t.number}
            cx={t.start[0]}
            cy={t.start[1]}
            r={3}
            fill={colorForTrain(t)}
          />
        ))}
      </svg>
      <p className="legend">
        <span className="legend-item selected" /> Gekozen trein&nbsp;&nbsp;
        <span className="legend-item occupied" /> Bezet spoor&nbsp;&nbsp;
        <span className="legend-item delay" /> Vertraging
      </p>
    </div>
  );
}

