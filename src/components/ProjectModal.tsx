'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubRepo } from '@/types';
import { formatDate } from '@/lib/utils';
import { LanguageIcon } from './LanguageIcon';
import { getProjectDNA } from '@/lib/dna-data';

interface ProjectModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d',
  HTML: '#e34c26', CSS: '#563d7c', Vue: '#42b883', Ruby: '#701516',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
};

export function ProjectModal({ repo, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dna'>('overview');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Reset modal tab state when a different repository is loaded
  useEffect(() => {
    if (repo) {
      setActiveTab('overview');
      setHoveredNodeId(null);
    }
  }, [repo]);

  if (!repo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="modal"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '580px', width: '100%' }}
        >
          {/* Modal Header */}
          <div className="modal-head">
            <div>
              <h3 className="modal-title">{repo.name}</h3>
              {repo.languages && repo.languages.length > 0 ? (
                <div className="modal-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {repo.languages.map((lang) => (
                    <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <LanguageIcon language={lang} size={15} />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              ) : repo.language ? (
                <div className="modal-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LanguageIcon language={repo.language} size={15} />
                  <span>{repo.language}</span>
                </div>
              ) : null}
            </div>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            {/* Navigation Tabs */}
            <div className="modal-tabs">
              <button
                className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`modal-tab-btn ${activeTab === 'dna' ? 'active' : ''}`}
                onClick={() => setActiveTab('dna')}
              >
                Project DNA
              </button>
            </div>

            {activeTab === 'overview' ? (
              /* ================= OVERVIEW TAB CONTROLS ================= */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {repo.description && (
                  <p className="modal-desc" style={{ margin: 0 }}>{repo.description}</p>
                )}

                {/* Language Composition Bar */}
                {(() => {
                  const totalBytes = repo.language_stats
                    ? Object.values(repo.language_stats).reduce((a, b) => a + b, 0)
                    : 0;

                  const languagesBreakdown = repo.language_stats && totalBytes > 0
                    ? Object.entries(repo.language_stats)
                        .map(([name, bytes]) => ({
                          name,
                          bytes,
                          percentage: (bytes / totalBytes) * 100,
                          color: LANG_COLORS[name] ?? '#8a8078',
                        }))
                        .sort((a, b) => b.bytes - a.bytes)
                    : [];

                  if (languagesBreakdown.length === 0) return null;

                  return (
                    <div style={{ marginBlock: '0.2rem' }}>
                      <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>
                        Language Distribution
                      </div>
                      {/* Segmented bar */}
                      <div style={{
                        display: 'flex',
                        height: '8px',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        background: 'var(--bg-subtle)',
                        marginBottom: '0.65rem'
                      }}>
                        {languagesBreakdown.map((lang) => (
                          <div
                            key={lang.name}
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color,
                              height: '100%'
                            }}
                            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                          />
                        ))}
                      </div>
                      {/* Percentage list */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem 1rem',
                        fontSize: '0.72rem'
                      }}>
                        {languagesBreakdown.map((lang) => (
                          <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: lang.color,
                              display: 'inline-block'
                            }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{lang.name}</span>
                            <span style={{ color: 'var(--text-3)' }}>{lang.percentage.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="stat-grid" style={{ margin: 0 }}>
                  <div className="stat-cell">
                    <div className="stat-cell-value">⭐ {repo.stargazers_count}</div>
                    <div className="stat-cell-label">Stars</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-cell-value">🍴 {repo.forks_count}</div>
                    <div className="stat-cell-label">Forks</div>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-cell-value" style={{ fontSize: '0.88rem' }}>{formatDate(repo.updated_at)}</div>
                    <div className="stat-cell-label">Updated</div>
                  </div>
                </div>

                {repo.topics.length > 0 && (
                  <div>
                    <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>
                      Topics
                    </div>
                    <div className="chips">
                      {repo.topics.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {repo.license && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                    License: {repo.license.name}
                  </div>
                )}

                <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    View on GitHub
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                      Live Site
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* ================= PROJECT DNA TAB CONTROLS ================= */
              (() => {
                const dna = getProjectDNA(repo.name, repo.language);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: '1.5', margin: 0 }}>
                      {dna.summary}
                    </p>

                    {/* Interactive Canvas */}
                    <div style={{
                      position: 'relative',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      padding: '0.5rem 0.25rem'
                    }}>
                      <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        {/* Directed connection wires */}
                        {dna.connections.map((conn, idx) => {
                          const fromNode = dna.nodes.find((n) => n.id === conn.from);
                          const toNode = dna.nodes.find((n) => n.id === conn.to);
                          if (!fromNode || !toNode) return null;

                          const midX = (fromNode.x + toNode.x) / 2;
                          const midY = (fromNode.y + toNode.y) / 2;

                          return (
                            <g key={`${conn.from}-${conn.to}-${idx}`}>
                              {/* Background link track */}
                              <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="var(--border)"
                                strokeWidth="2"
                              />
                              {/* Marching dashed color pipe */}
                              <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="var(--blue)"
                                strokeWidth="2"
                                className="dna-wire"
                                style={{ opacity: 0.8 }}
                              />
                              {/* Text label */}
                              <text
                                x={midX}
                                y={midY - 8}
                                textAnchor="middle"
                                fill="var(--text-3)"
                                fontSize="7.5"
                                fontFamily="var(--font-mono)"
                                fontWeight="600"
                                style={{ pointerEvents: 'none', textShadow: '1px 1px 0 var(--surface)' }}
                              >
                                {conn.label}
                              </text>
                            </g>
                          );
                        })}

                        {/* Interactive capsules */}
                        {dna.nodes.map((node) => {
                          const isHovered = hoveredNodeId === node.id;
                          return (
                            <g
                              key={node.id}
                              onMouseEnter={() => setHoveredNodeId(node.id)}
                              onMouseLeave={() => setHoveredNodeId(null)}
                              onClick={() => setHoveredNodeId(node.id === hoveredNodeId ? null : node.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <rect
                                x={node.x - 55}
                                y={node.y - 18}
                                width="110"
                                height="36"
                                rx="10"
                                fill={isHovered ? 'var(--blue-bg)' : 'var(--surface)'}
                                stroke={isHovered ? 'var(--blue)' : 'var(--border)'}
                                strokeWidth={isHovered ? '2' : '1.5'}
                                style={{ transition: 'all 0.15s' }}
                              />
                              <text
                                x={node.x}
                                y={node.y - 2}
                                textAnchor="middle"
                                fill="var(--text-1)"
                                fontSize="9"
                                fontWeight="700"
                                style={{ pointerEvents: 'none' }}
                              >
                                {node.label}
                              </text>
                              <text
                                x={node.x}
                                y={node.y + 10}
                                textAnchor="middle"
                                fill="var(--text-3)"
                                fontSize="7"
                                fontWeight="500"
                                style={{ pointerEvents: 'none' }}
                              >
                                {node.role}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Node Details Inspector */}
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '0.85rem 1rem',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {(() => {
                        const activeNode = dna.nodes.find((n) => n.id === hoveredNodeId);
                        if (activeNode) {
                          return (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  color: 'var(--blue)',
                                  background: 'var(--blue-bg)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid var(--blue-border)'
                                }}>
                                  {activeNode.role}
                                </span>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--text-1)' }}>
                                  {activeNode.label}
                                </strong>
                              </div>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.45 }}>
                                {activeNode.description}
                              </p>
                            </>
                          );
                        }
                        return (
                          <div style={{
                            color: 'var(--text-3)',
                            fontSize: '0.78rem',
                            textAlign: 'center',
                            lineHeight: 1.4,
                            padding: '0.5rem'
                          }}>
                            Hover or tap on any architectural capsule component above to inspect its DNA function and data flow responsibilities.
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
