'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubRepo } from '@/types';
import { formatDate } from '@/lib/utils';
import { LanguageIcon } from './LanguageIcon';
import { getProjectDNA } from '@/lib/dna-data';
import { unlockAchievement } from '@/lib/achievements';
import { getProjectCodeTree } from '@/lib/project-code-data';
import { CodeHighlighter } from './CodeHighlighter';
import { DiagnosticConsole } from './DiagnosticConsole';

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

// Helper to calculate exact boundary intersection coordinates for 110x36 rounded capsules
const getLineEndpoints = (fromNode: any, toNode: any) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  if (len === 0) return { x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y };

  const ux = dx / len;
  const uy = dy / len;

  // Actual semi-axes of the 110x36 capsule
  const rx = 55;
  const ry = 18;

  const rFrom = 1 / Math.sqrt(Math.pow(ux / rx, 2) + Math.pow(uy / ry, 2));
  const rTo = 1 / Math.sqrt(Math.pow(ux / rx, 2) + Math.pow(uy / ry, 2));

  // The arrow tip extends 0.6 units beyond the line end (viewBox width 10, refX 9, markerWidth 6)
  // To make the arrow tip touch the boundary exactly, the line ends at rTo + 0.6
  return {
    x1: fromNode.x + ux * rFrom,
    y1: fromNode.y + uy * rFrom,
    x2: toNode.x - ux * (rTo + 0.6),
    y2: toNode.y - uy * (rTo + 0.6)
  };
};

export function ProjectModal({ repo, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dna' | 'code'>('overview');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simConnIndex, setSimConnIndex] = useState<number>(-1);
  const [simNodeId, setSimNodeId] = useState<string | null>(null);

  // Reset modal tab state when a different repository is loaded
  useEffect(() => {
    if (repo) {
      setActiveTab('overview');
      setHoveredNodeId(null);
      setIsSimulating(false);
      setSimConnIndex(-1);
      setSimNodeId(null);
      setSelectedFilePath(null);
    }
  }, [repo]);

  // Dynamic files view states
  const [filesList, setFilesList] = useState<{ path: string; name: string; size: number }[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [activeBranch, setActiveBranch] = useState('main');
  const [useMockFiles, setUseMockFiles] = useState(false);

  const [activeFileContent, setActiveFileContent] = useState('');
  const [activeFileLanguage, setActiveFileLanguage] = useState<'go' | 'python' | 'typescript' | 'rust' | 'cpp' | 'bash' | 'markdown' | 'javascript'>('typescript');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (!repo || activeTab !== 'code') return;
    const repoName = repo.name;

    async function loadFiles() {
      setIsLoadingFiles(true);
      setUseMockFiles(false);
      try {
        const res = await fetch(`/api/github/files?repo=${repoName}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isFallback || !data.files || data.files.length === 0) {
            setUseMockFiles(true);
          } else {
            setFilesList(data.files);
            setActiveBranch(data.defaultBranch || 'main');
            if (data.files.length > 0) {
              setSelectedFilePath(data.files[0].path);
            }
          }
        } else {
          setUseMockFiles(true);
        }
      } catch (err) {
        console.error('Error fetching repo files:', err);
        setUseMockFiles(true);
      } finally {
        setIsLoadingFiles(false);
      }
    }

    loadFiles();
  }, [repo, activeTab]);

  useEffect(() => {
    if (!repo || activeTab !== 'code' || !selectedFilePath || useMockFiles) return;
    const repoName = repo.name;
    const repoLang = repo.language || 'TypeScript';
    const filePath = selectedFilePath;

    async function loadFileContent() {
      setIsLoadingContent(true);
      try {
        const res = await fetch(
          `/api/github/file-content?repo=${repoName}&path=${encodeURIComponent(filePath)}&branch=${activeBranch}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.isFallback) {
            const mockTree = getProjectCodeTree(repoName, repoLang);
            const mockFile = mockTree[filePath];
            if (mockFile) {
              setActiveFileContent(mockFile.content);
              setActiveFileLanguage(mockFile.language);
            } else {
              setActiveFileContent('// Content load error (mock path not found)');
              setActiveFileLanguage('typescript');
            }
          } else {
            setActiveFileContent(data.content);
            setActiveFileLanguage(data.language);
          }
        } else {
          const mockTree = getProjectCodeTree(repoName, repoLang);
          const mockFile = mockTree[filePath];
          if (mockFile) {
            setActiveFileContent(mockFile.content);
            setActiveFileLanguage(mockFile.language);
          }
        }
      } catch (err) {
        console.error('Error fetching file content:', err);
        const mockTree = getProjectCodeTree(repoName, repoLang);
        const mockFile = mockTree[filePath];
        if (mockFile) {
          setActiveFileContent(mockFile.content);
          setActiveFileLanguage(mockFile.language);
        }
      } finally {
        setIsLoadingContent(false);
      }
    }

    loadFileContent();
  }, [repo, activeTab, selectedFilePath, useMockFiles, activeBranch]);

  const runSimulation = async (dna: any) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimConnIndex(-1);
    setSimNodeId(null);
    unlockAchievement('dna-explorer');

    for (let i = 0; i < dna.connections.length; i++) {
      const conn = dna.connections[i];
      
      // Node source processing
      setSimNodeId(conn.from);
      setSimConnIndex(-1);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Wire transmitting
      setSimNodeId(null);
      setSimConnIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    
    // Land on target
    if (dna.connections.length > 0) {
      const lastConn = dna.connections[dna.connections.length - 1];
      setSimNodeId(lastConn.to);
      setSimConnIndex(-1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsSimulating(false);
    setSimConnIndex(-1);
    setSimNodeId(null);
  };

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
              <button
                className={`modal-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                Code View
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
            ) : activeTab === 'dna' ? (
              /* ================= PROJECT DNA TAB CONTROLS ================= */
              (() => {
                const dna = getProjectDNA(repo.name, repo.language);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: '1.5', margin: 0, flex: 1 }}>
                        {dna.summary}
                      </p>
                      <button
                        onClick={() => runSimulation(dna)}
                        disabled={isSimulating}
                        className={`btn ${isSimulating ? 'btn-ghost' : 'btn-primary'}`}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.4rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: isSimulating ? 'not-allowed' : 'pointer',
                          opacity: isSimulating ? 0.6 : 1,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={isSimulating ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="2">
                          {isSimulating ? (
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          ) : (
                            <polygon points="5 3 19 12 5 21 5 3" />
                          )}
                        </svg>
                        <span>{isSimulating ? 'Simulating...' : 'Simulate DNA Flow'}</span>
                      </button>
                    </div>

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
                        <defs>
                          <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--blue)" />
                          </marker>
                          <marker
                            id="arrow-dim"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--border)" />
                          </marker>
                        </defs>

                        {/* Directed connection wires */}
                        {dna.connections.map((conn, idx) => {
                          const fromNode = dna.nodes.find((n) => n.id === conn.from);
                          const toNode = dna.nodes.find((n) => n.id === conn.to);
                          if (!fromNode || !toNode) return null;

                          const isWireActive = simConnIndex === idx;
                          const showMarchingFlow = !isSimulating || isWireActive;

                          // Compute boundary endpoints
                          const { x1, y1, x2, y2 } = getLineEndpoints(fromNode, toNode);
                          const midX = (x1 + x2) / 2;
                          const midY = (y1 + y2) / 2;

                          return (
                             <g key={`${conn.from}-${conn.to}-${idx}`}>
                              {/* Background link track with a static direction arrow */}
                              <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="var(--border)"
                                strokeWidth="2"
                                markerEnd="url(#arrow-dim)"
                              />
                              {/* Marching dashed color pipe */}
                              <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="var(--blue)"
                                strokeWidth="2"
                                className={showMarchingFlow ? "dna-wire" : ""}
                                style={{ opacity: showMarchingFlow ? 0.8 : 0 }}
                                markerEnd="url(#arrow)"
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

                              {/* Glowing simulated particle traveling along the wire */}
                              {isWireActive && (
                                <motion.circle
                                  cx={x1}
                                  cy={y1}
                                  r="5"
                                  fill="var(--blue)"
                                  style={{ filter: 'drop-shadow(0 0 4px var(--blue))' }}
                                  animate={{ cx: x2, cy: y2 }}
                                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                                />
                              )}
                            </g>
                          );
                        })}

                        {/* Interactive capsules */}
                        {dna.nodes.map((node) => {
                          const isHovered = hoveredNodeId === node.id;
                          const isSimActive = simNodeId === node.id;
                          const isActive = isHovered || isSimActive;

                          return (
                            <g
                              key={node.id}
                              onMouseEnter={() => setHoveredNodeId(node.id)}
                              onMouseLeave={() => setHoveredNodeId(null)}
                              onClick={() => setHoveredNodeId(node.id === hoveredNodeId ? null : node.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <motion.rect
                                x={node.x - 55}
                                y={node.y - 18}
                                width="110"
                                height="36"
                                rx="10"
                                fill={isActive ? 'var(--blue-bg)' : 'var(--surface)'}
                                stroke={isActive ? 'var(--blue)' : 'var(--border)'}
                                strokeWidth={isActive ? '2' : '1.5'}
                                animate={isSimActive ? { scale: [1, 1.06, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 0.8 }}
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
                        if (isSimulating && simConnIndex !== -1) {
                          const conn = dna.connections[simConnIndex];
                          const fromNode = dna.nodes.find((n) => n.id === conn.from);
                          const toNode = dna.nodes.find((n) => n.id === conn.to);
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  color: 'var(--green)',
                                  background: 'rgba(22, 163, 74, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(22, 163, 74, 0.2)'
                                }}>
                                  DATA STREAMING
                                </span>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--text-1)' }}>
                                  Signal: {conn.label}
                                </strong>
                              </div>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
                                Routing package data flow from <span style={{fontWeight:600}}>{fromNode?.label}</span> to <span style={{fontWeight:600}}>{toNode?.label}</span>...
                              </p>
                            </div>
                          );
                        }

                        const activeNode = dna.nodes.find((n) => n.id === (hoveredNodeId || simNodeId));
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
                                  {isSimulating && simNodeId === activeNode.id ? 'PROCESSING' : activeNode.role}
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
            ) : (
              /* ================= PROJECT CODE VIEW TAB CONTROLS ================= */
              (() => {
                // If we are using mock files or the dynamic load returned empty, resolve mock tree
                const mockTree = getProjectCodeTree(repo.name, repo.language || 'TypeScript');
                
                const filePaths = useMockFiles ? Object.keys(mockTree) : filesList.map(f => f.path);
                const activePath = selectedFilePath || filePaths[0] || '';
                
                // Get active file metadata
                let fileName = 'main.ts';
                let fileLanguage: any = 'typescript';
                let fileContent = '';

                if (useMockFiles) {
                  const activeFile = mockTree[activePath];
                  if (activeFile) {
                    fileName = activeFile.name;
                    fileLanguage = activeFile.language;
                    fileContent = activeFile.content;
                  }
                } else {
                  const liveFile = filesList.find(f => f.path === activePath);
                  fileName = liveFile?.name || activePath.split('/').pop() || activePath;
                  fileLanguage = activeFileLanguage;
                  fileContent = activeFileContent;
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: '1.5', margin: 0 }}>
                      Inspect {useMockFiles ? 'staged' : 'live GitHub'} source code files, trace core algorithms, and execute performance diagnostics.
                    </p>

                    {isLoadingFiles ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '200px',
                        gap: '0.75rem',
                        color: 'var(--text-3)',
                        fontSize: '0.8rem'
                      }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          border: '2px solid var(--border)',
                          borderTopColor: 'var(--blue)',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        <span>Fetching repository file tree from GitHub...</span>
                      </div>
                    ) : filePaths.length === 0 ? (
                      <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-3)',
                        fontSize: '0.8rem',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius)'
                      }}>
                        No files found in this repository.
                      </div>
                    ) : (
                      /* Side-by-side Layout */
                      <div className="code-view-layout">
                        {/* Left: File Tree Selector */}
                        <div className="code-file-tree">
                          <div style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--text-3)',
                            marginBottom: '0.5rem',
                            paddingLeft: '0.25rem'
                          }}>
                            📂 Files
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {filePaths.map((path) => {
                              const isSelected = path === activePath;
                              const currentFileName = useMockFiles
                                ? mockTree[path]?.name
                                : path.split('/').pop() || path;
                              return (
                                <button
                                  key={path}
                                  onClick={() => setSelectedFilePath(path)}
                                  style={{
                                    textAlign: 'left',
                                    background: isSelected ? 'var(--blue-bg)' : 'transparent',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.45rem 0.5rem',
                                    fontSize: '0.74rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: isSelected ? 700 : 500,
                                    color: isSelected ? 'var(--blue)' : 'var(--text-2)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    transition: 'all 0.15s',
                                    borderLeft: isSelected ? '2px solid var(--blue)' : '2px solid transparent',
                                  }}
                                >
                                  <span>{path.endsWith('.md') ? '📝' : '📄'}</span>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {currentFileName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Code Viewer & Console */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                          {isLoadingContent ? (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '310px',
                              background: '#181816',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              gap: '0.75rem',
                              color: '#a8a29e',
                              fontSize: '0.75rem'
                            }}>
                              <div style={{
                                width: 20,
                                height: 20,
                                border: '2px solid #333',
                                borderTopColor: 'var(--blue)',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }} />
                              <span>Loading file contents...</span>
                            </div>
                          ) : (
                            <>
                              {/* Editor Container */}
                              <div style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                height: '210px',
                                background: '#181816',
                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)'
                              }}>
                                <CodeHighlighter code={fileContent} language={fileLanguage} />
                              </div>

                              {/* Telemetry Console */}
                              <DiagnosticConsole repoName={repo.name} fileName={fileName} />
                            </>
                          )}
                        </div>
                      </div>
                    )}
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
