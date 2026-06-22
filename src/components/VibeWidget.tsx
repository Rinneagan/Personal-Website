'use client';

import { useState, useEffect } from 'react';

const VIBES = [
  'Coding aether-engine',
  'Listening to Lofi Beats',
  'Analyzing compile threads',
  'Sipping hot espresso',
  'Reviewing web layout metrics',
];

export function VibeWidget() {
  const [time, setTime] = useState<string>('');
  const [vibeIndex, setVibeIndex] = useState(0);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Vibe cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setVibeIndex((prev) => (prev + 1) % VIBES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '1.25rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        minWidth: '270px',
        flex: '1',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)' }}>
          Local Time
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
          {time || '12:00:00 AM'}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-dim)' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)' }}>
            Current Status
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-2)' }}>
            {VIBES[vibeIndex]}
          </div>
        </div>

        {/* Bouncing Audio Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '16px', gap: '2.5px', paddingBottom: '2px', flexShrink: 0 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="visualizer-bar"
              style={{
                animationDelay: `${i * 0.18}s`,
                animationDuration: `${0.7 + i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
