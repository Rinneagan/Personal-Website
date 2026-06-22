'use client';

import { useState, useMemo, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean) as string[]);
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = useMemo(() =>
    activeFilter ? repos.filter((r) => r.language === activeFilter) : repos,
    [repos, activeFilter]
  );

  // Reset index to first card whenever active filters update
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  // Swiping gestural handlers
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold && currentIndex < filtered.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
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

          {/* Language filters row */}
          {languages.length > 0 && (
            <motion.div
              className="filter-row"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
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

          {/* Carousel Slider Panel */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              No repositories found.
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', overflow: 'visible', marginBlock: '2.5rem 1.5rem' }}>
              
              {/* Slidable Window */}
              <div style={{ position: 'relative', width: '100%', overflow: 'hidden', paddingBlock: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={{ x: `calc(50% - 150px - ${currentIndex * 320}px)` }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    cursor: 'grab',
                    width: 'fit-content',
                  }}
                  whileTap={{ cursor: 'grabbing' }}
                >
                  {filtered.map((repo, idx) => {
                    const isCenter = idx === currentIndex;
                    return (
                      <motion.button
                        key={repo.id}
                        className={`project-card ${isCenter ? 'focused' : ''}`}
                        onClick={() => {
                          if (isCenter) {
                            onSelectRepo(repo);
                          } else {
                            setCurrentIndex(idx);
                          }
                        }}
                        animate={{
                          scale: isCenter ? 1.05 : 0.92,
                          opacity: isCenter ? 1 : 0.45,
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          width: '300px',
                          flexShrink: 0,
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: isCenter ? 'var(--shadow-md)' : 'none',
                          border: isCenter ? '1px solid var(--border)' : '1px solid var(--border-dim)',
                          padding: '1.25rem',
                          background: 'var(--surface)',
                          borderRadius: 'var(--radius-lg)',
                          minHeight: '200px',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="project-card-header" style={{ width: '100%' }}>
                          <span className="project-card-name" style={{ fontSize: '1rem', fontWeight: 650 }}>{repo.name}</span>
                          <svg className="project-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                        
                        <div className="project-card-desc" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', lineHeight: '1.5' }}>
                          {repo.description || 'No description provided.'}
                        </div>
                        
                        <div className="project-card-footer" style={{ marginTop: 'auto', width: '100%' }}>
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
                          <div className="star-count">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            {repo.stargazers_count}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Slider Chevrons / Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem',
              }}>
                <button
                  onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="carousel-nav-btn"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-1)',
                    opacity: currentIndex === 0 ? 0.35 : 0.85,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title="Previous Project"
                  aria-label="Previous Project"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {/* Dot Pagination indicators */}
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', maxWidth: '180px', paddingBlock: '4px' }}>
                  {filtered.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        width: idx === currentIndex ? '24px' : '6px',
                        height: '6px',
                        borderRadius: '99px',
                        border: 'none',
                        background: idx === currentIndex ? 'var(--blue)' : 'var(--text-3)',
                        opacity: idx === currentIndex ? 1 : 0.4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        padding: 0,
                      }}
                      title={`Go to project ${idx + 1}`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => currentIndex < filtered.length - 1 && setCurrentIndex(currentIndex + 1)}
                  disabled={currentIndex === filtered.length - 1}
                  className="carousel-nav-btn"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-1)',
                    opacity: currentIndex === filtered.length - 1 ? 0.35 : 0.85,
                    cursor: currentIndex === filtered.length - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title="Next Project"
                  aria-label="Next Project"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  );
}
