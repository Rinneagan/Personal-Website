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
                <button
                  onClick={handlePrev}
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
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  aria-label="Previous Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
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

                return (
                  <motion.div
                    key={repo.id}
                    style={{
                      position: 'absolute',
                      width: '85%',
                      maxWidth: '380px',
                      height: '300px',
                      cursor: isCenter ? 'pointer' : 'pointer',
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                    animate={{
                      x: isCenter ? '0%' : isLeft ? '-48%' : isRight ? '48%' : offset < 0 ? '-120%' : '120%',
                      scale: isCenter ? 1.0 : 0.82,
                      rotateY: isCenter ? 0 : isLeft ? 24 : -24,
                      opacity: isVisible ? (isCenter ? 1.0 : 0.4) : 0,
                      zIndex: isCenter ? 10 : 5,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
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
                        padding: '1.5rem',
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
                          filter: isCenter ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.03))',
                          transition: 'filter 0.2s',
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 50,0 C 85,0 100,15 100,50 C 100,85 85,100 50,100 C 15,100 0,85 0,50 C 0,15 15,0 50,0 Z"
                          fill="var(--surface)"
                          stroke={isCenter ? 'var(--blue)' : 'var(--border)'}
                          strokeWidth={isCenter ? '2.5' : '1.5'}
                          vectorEffect="non-scaling-stroke"
                          style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                        />
                      </svg>

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
                        <div>
                          {/* Card Title */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
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
                              lineHeight: '1.55',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              lineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {repo.description || 'No description provided.'}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Floating controls - Next Trigger */}
              {filtered.length > 1 && (
                <button
                  onClick={handleNext}
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
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  aria-label="Next Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
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
  );
}
