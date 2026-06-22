'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'SQL'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
  Backend: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'WebSockets'],
  Databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'SQLite'],
  Tools: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'Linux', 'Figma'],
};

type SkillGroup = keyof typeof SKILLS;

const RADAR_CATEGORIES = [
  { key: 'Languages', value: 90 },
  { key: 'Frontend', value: 85 },
  { key: 'Backend', value: 80 },
  { key: 'Databases', value: 75 },
  { key: 'Tools', value: 85 },
];

const cx = 160;
const cy = 160;
const r = 95;
const getCoords = (index: number, val: number) => {
  const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
  const x = cx + r * (val / 100) * Math.cos(angle);
  const y = cy + r * (val / 100) * Math.sin(angle);
  return { x, y };
};

const referenceLevels = [25, 50, 75, 100];

export function Skills() {
  const [activeGroup, setActiveGroup] = useState<SkillGroup>('Languages');

  // Compute points for the active chart
  const dataPoints = RADAR_CATEGORIES.map((cat, i) => {
    const { x, y } = getCoords(i, cat.value);
    return `${x},${y}`;
  }).join(' ');

  return (
    <section id="skills" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Expertise</div>
          <h2 className="section-title">Skills & Radar</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '3.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* List panel layout */}
          <div className="skills-layout" style={{ flex: '1 1 450px', margin: 0 }}>
            {/* Sidebar */}
            <div className="skills-nav">
              {(Object.keys(SKILLS) as SkillGroup[]).map((group) => {
                const isActive = activeGroup === group;
                return (
                  <button
                    key={group}
                    className={`skills-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveGroup(group)}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-skill-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          zIndex: -1,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {group}
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div className="skills-panel">
              <AnimatePresence mode="popLayout">
                {SKILLS[activeGroup].map((tag) => (
                  <motion.span
                    key={tag}
                    className="skill-chip"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    layout
                  >
                    {tag}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive SVG Radar Chart Panel */}
          <div
            style={{
              flex: '1 1 320px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <svg
              viewBox="0 0 320 320"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                overflow: 'visible',
              }}
            >
              {/* Reference Grid Pentagons */}
              {referenceLevels.map((level) => {
                const points = RADAR_CATEGORIES.map((_, i) => {
                  const { x, y } = getCoords(i, level);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <g key={level}>
                    <polygon
                      points={points}
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray={level === 100 ? 'none' : '3 3'}
                      style={{ opacity: 0.8 }}
                    />
                    {/* Level percentage indicators */}
                    <text
                      x={cx + 4}
                      y={cy - (r * level) / 100 + 3}
                      fill="var(--text-3)"
                      fontSize="7.5px"
                      fontFamily="var(--font-mono)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* Axis Spokes & Interactive Labels */}
              {RADAR_CATEGORIES.map((cat, i) => {
                const outer = getCoords(i, 100);
                const labelPos = getCoords(i, 116);
                const isActive = activeGroup === cat.key;
                return (
                  <g
                    key={cat.key}
                    onClick={() => setActiveGroup(cat.key as SkillGroup)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Axis lines */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={outer.x}
                      y2={outer.y}
                      stroke={isActive ? 'var(--blue)' : 'var(--border)'}
                      strokeWidth={isActive ? '1.5' : '1'}
                      style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                    />
                    {/* Axis dots */}
                    <circle
                      cx={outer.x}
                      cy={outer.y}
                      r="2.5"
                      fill={isActive ? 'var(--blue)' : 'var(--border)'}
                      style={{ transition: 'fill 0.25s' }}
                    />
                    {/* Category Label */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 3}
                      textAnchor="middle"
                      fill={isActive ? 'var(--blue)' : 'var(--text-2)'}
                      fontSize="10.5px"
                      fontWeight={isActive ? '700' : '500'}
                      style={{
                        transition: 'fill 0.25s, font-weight 0.25s',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {cat.key}
                    </text>
                  </g>
                );
              })}

              {/* Data Area Polygon */}
              <polygon
                points={dataPoints}
                fill="rgba(37, 99, 235, 0.08)"
                stroke="var(--blue)"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.2))',
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Dynamic Glow Node Marker */}
              {(() => {
                const activeIndex = RADAR_CATEGORIES.findIndex((c) => c.key === activeGroup);
                if (activeIndex === -1) return null;
                const activeCat = RADAR_CATEGORIES[activeIndex];
                const { x, y } = getCoords(activeIndex, activeCat.value);
                return (
                  <g key={`marker-${activeGroup}`}>
                    {/* Glowing pulse */}
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="var(--blue)"
                      style={{ opacity: 0.16 }}
                      animate={{ scale: [1, 1.7, 1] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                    />
                    {/* Solid node cap */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="var(--blue)"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
                    />
                  </g>
                );
              })()}
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
