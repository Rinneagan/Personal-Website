'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitHubRepo } from '@/types';
import { ProjectModal } from './ProjectModal';
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

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean) as string[]);
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = useMemo(() =>
    activeFilter ? repos.filter((r) => r.language === activeFilter) : repos,
    [repos, activeFilter]
  );

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

          {/* Language filter */}
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

          <motion.div
            className="projects-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {filtered.length === 0 ? (
              <div className="empty-state">
                No repositories found.
              </div>
            ) : (
              filtered.map((repo, idx) => {
              const langColor = repo.language
                ? (LANG_COLORS[repo.language] ?? '#8a8078')
                : '#8a8078';
              return (
                <motion.button
                  key={repo.id}
                  className="project-card"
                  onClick={() => onSelectRepo(repo)}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="project-card-header">
                    <span className="project-card-name">{repo.name}</span>
                    <svg className="project-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                  
                  <div className="project-card-desc">
                    {repo.description || 'No description provided.'}
                  </div>
                  
                  <div className="project-card-footer">
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
            })
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
