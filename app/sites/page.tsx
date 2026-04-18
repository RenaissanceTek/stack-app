'use client';

import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { getLogs, INJECTION_SITES, type LogEntry } from '../../lib/storage';

type Zone = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

// Front-view body. Coordinates are in a 200x400 viewBox.
const ZONES: Zone[] = [
  { id: 'Delt L', cx: 60, cy: 110, rx: 15, ry: 12 },
  { id: 'Delt R', cx: 140, cy: 110, rx: 15, ry: 12 },
  { id: 'Abdomen L', cx: 88, cy: 175, rx: 14, ry: 18 },
  { id: 'Abdomen R', cx: 112, cy: 175, rx: 14, ry: 18 },
  { id: 'Glute L', cx: 86, cy: 240, rx: 16, ry: 14 },
  { id: 'Glute R', cx: 114, cy: 240, rx: 16, ry: 14 },
  { id: 'Thigh L', cx: 84, cy: 300, rx: 14, ry: 28 },
  { id: 'Thigh R', cx: 116, cy: 300, rx: 14, ry: 28 },
];

export default function SitesPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const recent = logs.slice(0, 10);
  const countByZone: Record<string, number> = {};
  for (const s of INJECTION_SITES) countByZone[s] = 0;
  for (const l of recent) {
    if (l.site in countByZone) countByZone[l.site] += 1;
  }

  return (
    <div>
      <PageHeader title="Injection sites" subtitle="Rotate — last 10 doses shown" />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg-card p-3">
        <svg viewBox="0 0 200 400" className="mx-auto block h-[520px] w-full max-w-[260px]">
          {/* Body outline (front view, stylized) */}
          <g stroke="#262626" strokeWidth="2" fill="#141414">
            {/* Head */}
            <circle cx="100" cy="40" r="22" />
            {/* Neck */}
            <rect x="92" y="60" width="16" height="14" />
            {/* Torso */}
            <path d="M60,78 L140,78 L148,180 L130,240 L70,240 L52,180 Z" />
            {/* Arms */}
            <path d="M60,80 L38,150 L50,200 L62,180 L68,110 Z" />
            <path d="M140,80 L162,150 L150,200 L138,180 L132,110 Z" />
            {/* Legs */}
            <path d="M72,240 L78,370 L96,370 L100,240 Z" />
            <path d="M100,240 L104,370 L122,370 L128,240 Z" />
          </g>

          {/* Zones */}
          {ZONES.map((z) => {
            const count = countByZone[z.id] || 0;
            const fill = count > 0 ? '#22c55e' : '#1f1f1f';
            const stroke = count > 0 ? '#4ade80' : '#333';
            return (
              <g key={z.id}>
                <ellipse
                  cx={z.cx}
                  cy={z.cy}
                  rx={z.rx}
                  ry={z.ry}
                  fill={fill}
                  fillOpacity={count > 0 ? 0.25 : 0.4}
                  stroke={stroke}
                  strokeWidth="1.5"
                />
                <text
                  x={z.cx}
                  y={z.cy + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#a1a1a1"
                >
                  {z.id}
                </text>
              </g>
            );
          })}

          {/* Dots for recent logs */}
          {recent.map((l, i) => {
            const zone = ZONES.find((z) => z.id === l.site);
            if (!zone) return null;
            // jitter inside ellipse deterministically by index
            const angle = (i * 137.5) * (Math.PI / 180);
            const r = 0.6;
            const dx = Math.cos(angle) * zone.rx * r;
            const dy = Math.sin(angle) * zone.ry * r;
            return (
              <circle
                key={l.id}
                cx={zone.cx + dx}
                cy={zone.cy + dy}
                r="2.5"
                fill="#4ade80"
              />
            );
          })}
        </svg>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {INJECTION_SITES.map((s) => (
          <li
            key={s}
            className="flex items-center justify-between rounded-xl border border-line bg-bg-card px-3 py-2"
          >
            <span>{s}</span>
            <span className="text-ink-muted">{countByZone[s] || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
