import React, { useState, useEffect } from 'react';
import './VPTPage.css';

interface Segment {
  id: string;
  from: string;
  to: string;
  path: string;
  length: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  state: 'free' | 'route' | 'occupied';
}

interface Signal {
  id: string;
  x: number;
  y: number;
}

const initialSegments: Segment[] = [
  {
    id: 'ab',
    from: 'A',
    to: 'B',
    path: 'M10 40 L90 40',
    length: 80,
    x1: 10,
    y1: 40,
    x2: 90,
    y2: 40,
    state: 'free',
  },
  {
    id: 'bc',
    from: 'B',
    to: 'C',
    path: 'M90 40 L170 40',
    length: 80,
    x1: 90,
    y1: 40,
    x2: 170,
    y2: 40,
    state: 'free',
  },
  {
    id: 'bd',
    from: 'B',
    to: 'D',
    path: 'M90 40 L90 80',
    length: 40,
    x1: 90,
    y1: 40,
    x2: 90,
    y2: 80,
    state: 'free',
  },
  {
    id: 'ce',
    from: 'C',
    to: 'E',
    path: 'M170 40 L170 80',
    length: 40,
    x1: 170,
    y1: 40,
    x2: 170,
    y2: 80,
    state: 'free',
  },
  {
    id: 'de',
    from: 'D',
    to: 'E',
    path: 'M90 80 L170 80',
    length: 80,
    x1: 90,
    y1: 80,
    x2: 170,
    y2: 80,
    state: 'free',
  },
];

const signals: Signal[] = [
  { id: 'A', x: 10, y: 40 },
  { id: 'B', x: 90, y: 40 },
  { id: 'C', x: 170, y: 40 },
  { id: 'D', x: 90, y: 80 },
  { id: 'E', x: 170, y: 80 },
];

export default function VPTPage() {
  const [segments, setSegments] = useState(initialSegments);
  const [selected, setSelected] = useState<string | null>(null);
  const [route, setRouteState] = useState<string[]>([]);
  const [train, setTrain] = useState<{ index: number; progress: number } | null>(null);

  const findRoute = (start: string, end: string): string[] | null => {
    const queue: { node: string; path: string[] }[] = [{ node: start, path: [] }];
    const visited = new Set<string>();
    while (queue.length) {
      const { node, path } = queue.shift()!;
      if (node === end) return path;
      if (visited.has(node)) continue;
      visited.add(node);
      segments.forEach(seg => {
        if (seg.state !== 'free') return;
        if (seg.from === node) {
          queue.push({ node: seg.to, path: [...path, seg.id] });
        }
        if (seg.to === node) {
          queue.push({ node: seg.from, path: [...path, seg.id] });
        }
      });
    }
    return null;
  };

  const setRoute = (start: string, end: string) => {
    const ids = findRoute(start, end);
    if (!ids) return;
    setRouteState(ids);
    setSegments(segs => segs.map(s => (ids.includes(s.id) ? { ...s, state: 'route' } : s)));
  };

  const occupyRoute = () => {
    if (!route.length || train) return;
    const first = route[0];
    setSegments(segs =>
      segs.map(s =>
        s.id === first ? { ...s, state: 'occupied' } : s
      )
    );
    setTrain({ index: 0, progress: 0 });
  };

  const clearRoute = () => {
    setRouteState([]);
    setTrain(null);
    setSegments(segs => segs.map(s => (s.state !== 'free' ? { ...s, state: 'free' } : s)));
  };

  const handleSignal = (id: string) => {
    if (train) return;
    if (!selected) setSelected(id);
    else {
      setRoute(selected, id);
      setSelected(null);
    }
  };

  useEffect(() => {
    if (!train) return;
    const timer = setInterval(() => {
      setTrain(t => {
        if (!t) return null;
        const segId = route[t.index];
        const seg = segments.find(s => s.id === segId)!;
        const next = t.progress + 2;
        if (next >= seg.length) {
          // release old segment
          setSegments(segs =>
            segs.map(s =>
              s.id === segId ? { ...s, state: 'free' } : s
            )
          );
          const nextIndex = t.index + 1;
          if (nextIndex >= route.length) {
            setRouteState([]);
            return null;
          }
          const nextSeg = route[nextIndex];
          setSegments(segs =>
            segs.map(s =>
              s.id === nextSeg ? { ...s, state: 'occupied' } : s
            )
          );
          return { index: nextIndex, progress: 0 };
        }
        return { ...t, progress: next };
      });
    }, 100);
    return () => clearInterval(timer);
  }, [train, route, segments]);

  return (
    <div className="vpt-grid">
      <div className="panel">
        <svg viewBox="0 0 180 100">
          {segments.map(s => (
            <path key={s.id} d={s.path} className={s.state} />
          ))}
          {train && (() => {
            const seg = segments.find(se => se.id === route[train.index]);
            if (!seg) return null;
            const ratio = train.progress / seg.length;
            const x = seg.x1 + (seg.x2 - seg.x1) * ratio;
            const y = seg.y1 + (seg.y2 - seg.y1) * ratio;
            return <circle cx={x} cy={y} r={3} className="train" />;
          })()}
          {signals.map(sig => (
            <rect
              key={sig.id}
              x={sig.x - 3}
              y={sig.y - 3}
              width={6}
              height={6}
              className={`signal ${selected === sig.id ? 'selected' : ''}`}
              onClick={() => handleSignal(sig.id)}
            />
          ))}
        </svg>
        <div className="buttons">
          <button onClick={occupyRoute}>Laat trein rijden</button>
          <button onClick={clearRoute}>Wis route</button>
        </div>
      </div>
    </div>
  );
}

