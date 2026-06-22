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

export function Skills() {
  const [activeGroup, setActiveGroup] = useState<SkillGroup>('Languages');

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
          <h2 className="section-title">Skills</h2>
        </motion.div>

        <motion.div
          className="skills-layout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
