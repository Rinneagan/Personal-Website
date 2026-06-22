'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DiagnosticConsoleProps {
  repoName: string;
  fileName: string;
}

export function DiagnosticConsole({ repoName, fileName }: DiagnosticConsoleProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [graphPoints, setGraphPoints] = useState<number[]>(Array(20).fill(15)); // baseline latency = 15ms
  const logEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setGraphPoints(Array(20).fill(15));

    const simulatedLogs = [
      `[info] $ execute ${fileName} --diagnostic`,
      `[info] Resolving environment parameters...`,
      `[info] Build dependencies staged: 12 references [OK]`,
      `[info] Allocating client thread pool (4 workers)`,
      `[status] Running performance diagnostics...`,
      `[telemetry] Connection latency benchmark initialized.`,
    ];

    // Stage log printings
    let time = 100;
    simulatedLogs.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, msg]);
      }, time);
      time += 350;
    });

    // Start live performance graph fluctuations
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setGraphPoints((prev) => {
          const next = [...prev.slice(1)];
          // Generate realistic fluctuation spike between 20ms and 95ms
          const spike = Math.random() * 65 + 20;
          next.push(spike);
          
          // Log active data points to console logs
          setLogs((p) => {
            if (p.length < 25) {
              return [...p, `[ping] latency: ${spike.toFixed(1)}ms | cpu: ${(Math.random() * 25 + 15).toFixed(1)}%`];
            }
            return p;
          });

          return next;
        });
      }, 200);
    }, time);

    // Stop after 5 seconds
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setLogs((prev) => [
        ...prev,
        `[status] Diagnostic run complete.`,
        `[report] Average Latency: ${(Math.random() * 15 + 40).toFixed(1)}ms | Error Rate: 0.00%`,
        `[info] Telemetry report buffered.`,
      ]);
    }, time + 5000);
  };

  // Convert points to SVG path coordinates
  // Viewbox: 0 0 200 60
  const getSvgPath = (points: number[]) => {
    const width = 200;
    const height = 60;
    const step = width / (points.length - 1);
    
    // Map values (0-100) to height coordinates (60 to 5)
    const coordinates = points.map((p, idx) => {
      const x = idx * step;
      const y = height - (p / 100) * (height - 10) - 5;
      return { x, y };
    });

    const linePath = coordinates.reduce((acc, curr, idx) => {
      return acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`);
    }, '');

    // Area path closes the shape to the bottom of the graph
    const areaPath = linePath + ` L 200 60 L 0 60 Z`;

    return { linePath, areaPath };
  };

  const { linePath, areaPath } = getSvgPath(graphPoints);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: '#1c1c1a',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.85rem',
        fontFamily: 'var(--font-mono)',
        color: '#f8f8f2',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-1)' }}>
            ⚡ Runtime Telemetry
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-3)' }}>
            Active file: {fileName}
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          style={{
            fontSize: '0.68rem',
            padding: '0.35rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--blue)',
            background: isRunning ? 'transparent' : 'var(--blue-bg)',
            color: isRunning ? 'var(--text-3)' : 'var(--blue)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          {isRunning ? (
            <>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  border: '1.5px solid var(--text-3)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span>▶ Run Diagnostics</span>
            </>
          )}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.75rem', height: '90px' }}>
        {/* Terminal Logs Box */}
        <div
          style={{
            background: '#141412',
            border: '1px solid #2d2d2a',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.6rem',
            fontSize: '0.65rem',
            lineHeight: '1.4',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            color: '#a8a29e',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>
              System idle. Click "Run Diagnostics" to stream dynamic compiler profiling logs.
            </div>
          ) : (
            logs.map((log, index) => {
              let color = '#a8a29e';
              if (log.includes('error') || log.includes('EXCEPTION')) color = '#ff5555';
              else if (log.includes('$')) color = '#f1fa8c';
              else if (log.includes('status')) color = '#50fa7b';
              else if (log.includes('ping')) color = '#8be9fd';
              
              return (
                <div key={index} style={{ color, whiteSpace: 'nowrap' }}>
                  {log}
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>

        {/* Oscilloscope Performance Chart */}
        <div
          style={{
            background: '#141412',
            border: '1px solid #2d2d2a',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-3)', zIndex: 2 }}>
            LATENCY (ms)
          </div>
          
          <svg viewBox="0 0 200 60" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '44px', width: '100%' }}>
            {/* Grid lines */}
            <line x1="0" y1="15" x2="200" y2="15" stroke="#222" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="200" y2="30" stroke="#222" strokeWidth="0.5" />
            <line x1="0" y1="45" x2="200" y2="45" stroke="#222" strokeWidth="0.5" />
            
            {/* Filled Area */}
            <path d={areaPath} fill="rgba(37, 99, 235, 0.08)" />
            
            {/* Graph Line */}
            <path
              d={linePath}
              fill="none"
              stroke={isRunning ? 'var(--blue)' : '#555'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.3s' }}
            />
          </svg>

          {/* Current value badge */}
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isRunning ? 'var(--blue)' : '#a8a29e', textAlign: 'right', zIndex: 2 }}>
            {graphPoints[graphPoints.length - 1].toFixed(0)} ms
          </div>
        </div>
      </div>
    </div>
  );
}
