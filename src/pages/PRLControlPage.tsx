import React, { useState } from 'react';
import './PRLControlPage.css';

interface Segment {
  id: string;
  path: string;
  state: 'default' | 'occupied' | 'route' | 'released' | 'fault';
}

interface Signal {
  id: string;
  x: number;
  y: number;
}

const initialSegments: Segment[] = [
  { id: 's1', path: 'M10 50 L90 50', state: 'default' },
  { id: 's2', path: 'M90 50 L170 50', state: 'default' },
  { id: 's3', path: 'M90 50 L90 90', state: 'default' },
];

const signals: Signal[] = [
  { id: 'A', x: 10, y: 50 },
  { id: 'B', x: 170, y: 50 },
  { id: 'C', x: 90, y: 90 },
];

export default function PRLControlPage() {
  const [segments, setSegments] = useState(initialSegments);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const setRoute = (start: string, end: string) => {
    let routeSegs: string[] = [];
    if (start === 'A' && end === 'B') routeSegs = ['s1', 's2'];
    else if (start === 'A' && end === 'C') routeSegs = ['s1', 's3'];
    else {
      setMessages(m => [`Ongeldige rijweg ${start}→${end}`, ...m]);
      return;
    }

    const blocked = routeSegs.some(id => segments.find(s => s.id === id)?.state !== 'default');
    if (blocked) {
      setMessages(m => [`Rijweg geblokkeerd ${start}→${end}`, ...m]);
      return;
    }

    setSegments(segs => segs.map(s => routeSegs.includes(s.id) ? { ...s, state: 'route' } : s));
    setMessages(m => [`Rijweg ingesteld ${start}→${end}`, ...m]);
  };

  const handleSignalClick = (id: string) => {
    if (!selected) {
      setSelected(id);
    } else {
      setRoute(selected, id);
      setSelected(null);
    }
  };

  return (
    <div className="prl-grid">
      <div className="baanplan" id="bp1">
        <svg viewBox="0 0 180 100">
          {segments.map(s => (
            <path key={s.id} d={s.path} className={s.state} />
          ))}
          {signals.map(sig => (
            <rect
              key={sig.id}
              x={sig.x - 3}
              y={sig.y - 3}
              width={6}
              height={6}
              className="signal"
              onClick={() => handleSignalClick(sig.id)}
            />
          ))}
        </svg>
      </div>
      <div className="baanplan" id="bp2">
        <svg viewBox="0 0 180 100">
          <text x="10" y="20" fill="white">Bedienscherm 2</text>
        </svg>
      </div>
      <div className="procesplan">
        <table>
          <thead>
            <tr>
              <th>Trein</th>
              <th>Vertrekspoor</th>
              <th>Aankomst</th>
              <th>Vertrektijd</th>
              <th>Rijweg?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="actief">
              <td>4532</td>
              <td>14a</td>
              <td>15b</td>
              <td>12:47</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>6621</td>
              <td>5</td>
              <td>7</td>
              <td>13:05</td>
              <td>❌</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="storingen">
        <ul>
          {messages.map((m,i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
      <div className="sidebar">
        <button>📞 Bel trein 4532</button>
        <button>📻 Omroep</button>
        <button>📁 Logboek</button>
      </div>
    </div>
  );
}
