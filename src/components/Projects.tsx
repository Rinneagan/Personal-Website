'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubRepo } from '@/types';
import { LanguageIcon } from './LanguageIcon';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d',
  HTML: '#e34c26', CSS: '#563d7c', Vue: '#42b883', Ruby: '#701516',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
};

interface ProjectsProps {
  repos: GitHubRepo[];
  selectedRepo: GitHubRepo | null;
  onSelectRepo: (repo: GitHubRepo | null) => void;
}

export function Projects({ repos, selectedRepo, onSelectRepo }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group all languages from repositories for filtering
  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean) as string[]);
    return Array.from(langs).sort();
  }, [repos]);

  // Apply search filtering
  const filtered = useMemo(() =>
    activeFilter ? repos.filter((r) => r.language === activeFilter) : repos,
    [repos, activeFilter]
  );

  // Reset indices whenever filter changes to avoid out-of-bounds index references
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // Infinite looping handlers
  const handlePrev = () => {
    if (filtered.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  const handleNext = () => {
    if (filtered.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filtered.length);
  };

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.92,0 1,0.08 1,0.5 C 1,0.92 0.92,1 0.5,1 C 0.08,1 0,0.92 0,0.5 C 0,0.08 0.08,0 0.5,0 Z" />
          </clipPath>
        </defs>
      </svg>
      <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Work</div>
          <h2 className="section-title">Projects</h2>
        </motion.div>

        {/* Filter Pills */}
        {languages.length > 0 && (
          <motion.div
            className="filter-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <button
              className={`filter-pill ${activeFilter === null ? 'active' : ''}`}
              onClick={() => setActiveFilter(null)}
            >
              All
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                className={`filter-pill ${activeFilter === lang ? 'active' : ''}`}
                onClick={() => setActiveFilter(lang)}
              >
                {lang}
              </button>
            ))}
            <span className="projects-count">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </span>
          </motion.div>
        )}

        {/* Dynamic Carousel Wheel Track */}
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ paddingBlock: '3rem' }}>
            No repositories found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative', width: '100%' }}>
            
            {/* Carousel Interactive Viewport */}
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '340px',
                perspective: '1200px',
                overflow: 'hidden',
                paddingBlock: '10px',
              }}
            >
              
              {/* Floating controls - Prev Trigger */}
              {filtered.length > 1 && (
                <motion.button
                  onClick={handlePrev}
                  whileHover={{ scale: 1.15, borderColor: 'var(--text-1)' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    position: 'absolute',
                    left: '5%',
                    zIndex: 25,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-1)',
                    outline: 'none',
                  }}
                  aria-label="Previous Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </motion.button>
              )}

              {/* Central project card items list */}
              {filtered.map((repo, idx) => {
                // Calculate infinite circular distance offsets
                let offset = idx - activeIndex;
                if (offset < -Math.floor(filtered.length / 2)) {
                  offset += filtered.length;
                } else if (offset > Math.floor(filtered.length / 2)) {
                  offset -= filtered.length;
                }

                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isVisible = isCenter || isLeft || isRight;
                const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#2563eb') : '#2563eb';

                return (
                  <motion.div
                    key={repo.id}
                    style={{
                      position: 'absolute',
                      width: '85%',
                      maxWidth: '380px',
                      height: '300px',
                      cursor: 'pointer',
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                    animate={{
                      x: isCenter ? '0%' : isLeft ? '-48%' : isRight ? '48%' : offset < 0 ? '-120%' : '120%',
                      y: 0,
                      scale: isCenter ? 1.0 : 0.82,
                      rotateY: isCenter ? 0 : isLeft ? 24 : -24,
                      opacity: isVisible ? (isCenter ? 1.0 : 0.4) : 0,
                      zIndex: isCenter ? 10 : 5,
                    }}
                    whileHover={isCenter ? { scale: 1.03, y: -5 } : isVisible ? { scale: 0.86 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 150,
                      damping: 15,
                      mass: 0.8
                    }}
                    onClick={() => {
                      if (isCenter) {
                        onSelectRepo(repo);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        position: 'relative',
                        padding: '1.85rem 1.75rem',
                        textAlign: 'left',
                        background: 'transparent',
                      }}
                    >
                      {/* Squircle SVG Background Frame */}
                      <svg
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          zIndex: 0,
                          overflow: 'visible',
                          filter: isCenter
                            ? `drop-shadow(0 12px 28px ${langColor}26) drop-shadow(0 4px 10px ${langColor}14)`
                            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.03))',
                          transition: 'filter 0.3s ease',
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 50,0 C 92,0 100,8 100,50 C 100,92 92,100 50,100 C 8,100 0,92 0,50 C 0,8 8,0 50,0 Z"
                          fill="var(--surface)"
                          stroke={isCenter ? langColor : 'var(--border)'}
                          strokeWidth={isCenter ? '2.5' : '1.5'}
                          vectorEffect="non-scaling-stroke"
                          style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                        />
                      </svg>

                      {/* Glass Reflection Sweep */}
                      {isCenter && (
                        <motion.div
                          key={`shine-${repo.id}`}
                          initial={{ x: '-100%' }}
                          animate={{ x: '180%' }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.04) 70%, transparent)',
                            zIndex: 2,
                            transform: 'skewX(-25deg)',
                            pointerEvents: 'none',
                            clipPath: 'url(#squircle-clip)',
                          }}
                        />
                      )}

                      {/* Card Content Wrapper */}
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <motion.div
                          animate={{
                            y: isCenter ? 0 : 6,
                            opacity: isCenter ? 1 : 0.6,
                          }}
                          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                        >
                          {/* Card Title */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-1)' }}>
                              {repo.name}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5">
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </div>
                          
                          {/* Card Description */}
                          <div
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--text-2)',
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              lineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {repo.description || 'No description provided.'}
                          </div>
                        </motion.div>

                        {/* Card Footer */}
                        <motion.div
                          animate={{
                            y: isCenter ? 0 : -4,
                            opacity: isCenter ? 1 : 0.6,
                          }}
                          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--border-dim)',
                            marginTop: 'auto',
                          }}
                        >
                          {repo.languages && repo.languages.length > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {repo.languages.slice(0, 4).map((lang) => (
                                <div key={lang} title={lang} style={{ display: 'flex', alignItems: 'center' }}>
                                  <LanguageIcon language={lang} size={18} />
                                </div>
                              ))}
                            </div>
                          ) : repo.language ? (
                            <div title={repo.language} style={{ display: 'flex', alignItems: 'center' }}>
                              <LanguageIcon language={repo.language} size={18} />
                            </div>
                          ) : <span />}
                          
                          <div className="star-count" style={{ fontSize: '0.78rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {repo.stargazers_count}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Floating controls - Next Trigger */}
              {filtered.length > 1 && (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.15, borderColor: 'var(--text-1)' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    position: 'absolute',
                    right: '5%',
                    zIndex: 25,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-1)',
                    outline: 'none',
                  }}
                  aria-label="Next Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Navigation Dot Indicators */}
            {filtered.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBlock: '0.5rem 1rem' }}>
                {filtered.map((_, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      style={{
                        width: isActive ? '20px' : '7px',
                        height: '7px',
                        borderRadius: '99px',
                        background: isActive ? 'var(--blue)' : 'var(--border)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      title={`Go to project ${idx + 1}`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
    </>
  );
}
