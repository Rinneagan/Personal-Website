'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubRepo } from '@/types';
import { formatDate } from '@/lib/utils';
import { LanguageIcon } from './LanguageIcon';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d',
  HTML: '#e34c26', CSS: '#563d7c', Vue: '#42b883', Ruby: '#701516',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
};

interface ExperienceProps {
  repos: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
}

export function Experience({ repos, onSelectRepo }: ExperienceProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter out forks, sort by creation date descending, and show the top 7 projects as timeline items
  const milestones = [...(repos || [])]
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 7);

  const total = milestones.length;
  const itemHeight = 210; // Unified item height for card vertical spacing

  const getNodeCoords = (idx: number) => {
    const y = idx * itemHeight + 105; // Center vertically inside item space
    let x = 40; // main trunk
    if (idx % 2 === 1) {
      x = idx % 4 === 1 ? 65 : 15;
    }
    return { x, y };
  };

  return (
    <section id="experience" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Milestones</div>
          <h2 className="section-title">Project History</h2>
        </motion.div>

        {milestones.length === 0 ? (
          <div className="empty-state">No repository milestones found.</div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', position: 'relative', width: '100%' }}>
            
            {/* SVG Visual Git Graph Column */}
            <div style={{ width: '80px', flexShrink: 0, position: 'relative', userSelect: 'none' }}>
              <svg 
                width="80" 
                height={total * itemHeight} 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                {/* Main Trunk Straight Line */}
                {total > 1 && (
                  <line
                    x1={40}
                    y1={90}
                    x2={40}
                    y2={(total - 1) * itemHeight + 110}
                    stroke="var(--border)"
                    strokeWidth="3.5"
                  />
                )}

                {/* Curves representing feature/dev branches */}
                {milestones.map((_, i) => {
                  if (i % 2 === 0) return null; // Branches curve out only for odd indices

                  const pStart = getNodeCoords(i - 1);
                  const pNode = getNodeCoords(i);
                  const pEnd = getNodeCoords(Math.min(i + 1, total - 1));

                  // Branch is illuminated if the current node, or adjacent connector nodes, are hovered
                  const isHovered = hoveredIndex === i || hoveredIndex === i - 1 || hoveredIndex === Math.min(i + 1, total - 1);
                  const langColor = milestones[i].language ? (LANG_COLORS[milestones[i].language] ?? '#2563eb') : '#2563eb';

                  // Dynamic cubic Bezier curve coordinates
                  const pathD = `M 40 ${pStart.y} C 40 ${(pStart.y + pNode.y) / 2}, ${pNode.x} ${(pStart.y + pNode.y) / 2}, ${pNode.x} ${pNode.y} C ${pNode.x} ${(pNode.y + pEnd.y) / 2}, 40 ${(pNode.y + pEnd.y) / 2}, 40 ${pEnd.y}`;

                  return (
                    <path
                      key={`branch-${i}`}
                      d={pathD}
                      fill="none"
                      stroke={isHovered ? langColor : 'var(--border)'}
                      strokeWidth={isHovered ? '4' : '2.5'}
                      style={{
                        transition: 'stroke 0.25s, stroke-width 0.25s',
                        filter: isHovered ? `drop-shadow(0 0 4px ${langColor}cc)` : 'none',
                      }}
                    />
                  );
                })}

                {/* Node Circles */}
                {milestones.map((repo, i) => {
                  const { x, y } = getNodeCoords(i);
                  const isHovered = hoveredIndex === i;
                  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#2563eb') : '#2563eb';

                  return (
                    <g key={`node-${repo.id}`}>
                      {/* Active Pulse Glow */}
                      {isHovered && (
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          fill={langColor}
                          style={{ opacity: 0.16 }}
                        />
                      )}
                      {/* Interactive Solid Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4.5}
                        fill={isHovered ? langColor : 'var(--surface)'}
                        stroke={isHovered ? 'var(--surface)' : 'var(--border)'}
                        strokeWidth={isHovered ? 2 : 2.5}
                        style={{
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Release Commit Cards Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {milestones.map((repo, idx) => {
                const createdDate = formatDate(repo.created_at);
                const sizeMB = Math.round((repo.size / 1024) * 10) / 10;
                
                // Dynamic mock calculations to populate Git terminal logs
                const shortSha = repo.id.toString(16).substring(0, 7).padEnd(7, 'f');
                const tagVersion = `v1.${total - idx}.0`;
                const filesChanged = (repo.size % 14) + 4;
                const insertions = (repo.size % 380) + 120;
                const deletions = (repo.stargazers_count % 40) + 12;

                const isHovered = hoveredIndex === idx;
                const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#2563eb') : '#2563eb';

                return (
                  <div
                    key={repo.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      height: `${itemHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderColor: isHovered ? langColor : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '1.15rem 1.35rem',
                        boxShadow: isHovered ? `0 10px 30px -10px ${langColor}14, var(--shadow-sm)` : 'var(--shadow-sm)',
                        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: `${itemHeight - 30}px`, // Leave vertical padding gap between cards
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'left',
                      }}
                    >
                      {/* Code Comments Info and Header bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span 
                              style={{ 
                                fontFamily: 'var(--font-mono)', 
                                fontSize: '0.72rem', 
                                color: isHovered ? langColor : 'var(--text-3)',
                                background: 'var(--bg-subtle)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 600,
                              }}
                            >
                              commit {shortSha}
                            </span>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                              tag: {tagVersion}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                            // {createdDate}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>
                            <button
                              onClick={() => onSelectRepo(repo)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                margin: 0,
                                font: 'inherit',
                                color: 'inherit',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textDecorationColor: 'transparent',
                                transition: 'text-decoration-color 0.2s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = langColor}
                              onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
                            >
                              {repo.name}
                            </button>
                          </h3>

                          {repo.language && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 550, color: 'var(--text-2)' }}>
                              <LanguageIcon language={repo.language} size={15} />
                              <span>{repo.language}</span>
                            </div>
                          )}
                        </div>

                        <p 
                          style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-2)', 
                            lineHeight: 1.5, 
                            marginTop: '0.45rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            lineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                          title={repo.description ?? undefined}
                        >
                          {repo.description || 'Open-source software project engineered and published to GitHub.'}
                        </p>
                      </div>

                      {/* Code Change stats block */}
                      <div 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          borderTop: '1px dashed var(--border)', 
                          paddingTop: '0.55rem',
                          marginTop: 'auto'
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)' }}>
                          {filesChanged} files changed, <span style={{ color: 'var(--green)' }}>{insertions} insertions(+)</span>, <span style={{ color: 'var(--red)' }}>{deletions} deletions(-)</span>
                        </span>
                        
                        <button
                          onClick={() => onSelectRepo(repo)}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: isHovered ? langColor : 'var(--text-2)',
                            background: 'transparent',
                            border: '1px solid',
                            borderColor: isHovered ? langColor : 'var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          Details &rarr;
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
