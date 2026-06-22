'use client';

import { motion } from 'framer-motion';

import { GitHubRepo } from '@/types';
import { formatDate } from '@/lib/utils';
import { LanguageIcon } from './LanguageIcon';

interface ExperienceProps {
  repos: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
}

export function Experience({ repos, onSelectRepo }: ExperienceProps) {
  // Filter out forks, sort by creation date descending, and show the top 7 projects as timeline items
  const milestones = [...(repos || [])]
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 7);

  return (
    <section id="experience" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
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
          <div className="timeline">
            {milestones.map((repo, idx) => {
              const createdDate = formatDate(repo.created_at);
              const pushedDate = formatDate(repo.pushed_at);
              const sizeMB = Math.round((repo.size / 1024) * 10) / 10;
              
              // Generate custom points dynamically based on actual metadata
              const points = [
                repo.description || 'Open-source software project engineered and published to GitHub.',
                `Codebase footprint: ${sizeMB > 0 ? `${sizeMB} MB` : `${repo.size} KB`} size, containing stars: ${repo.stargazers_count} | forks: ${repo.forks_count}.`,
                `Active code logs maintained with recent pushes on ${pushedDate}.`
              ];

              return (
                <motion.div
                  key={repo.id}
                  className="timeline-item"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <div className="timeline-node" />
                  
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div>
                        <h3 className="timeline-role">
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
                              textAlign: 'left',
                              textDecoration: 'underline',
                              textDecorationColor: 'transparent',
                              transition: 'text-decoration-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = 'var(--text-1)'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
                            className="project-timeline-link"
                          >
                            {repo.name}
                          </button>
                        </h3>
                        <div className="timeline-company" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <span>GitHub Repository</span>
                          {repo.language && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              • <LanguageIcon language={repo.language} size={14} /> {repo.language}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="timeline-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                        <span className="timeline-date">{createdDate}</span>
                        <button
                          onClick={() => onSelectRepo(repo)}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            color: 'var(--text-2)',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--text-1)';
                            e.currentTarget.style.color = 'var(--text-1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-2)';
                          }}
                        >
                          View Details &rarr;
                        </button>
                      </div>
                    </div>

                    <ul className="timeline-points">
                      {points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="chips" style={{ marginTop: '1.25rem' }}>
                        {repo.topics.slice(0, 6).map((topic) => (
                          <span key={topic} className="chip" style={{ fontSize: '0.7rem' }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
