'use client';

import { motion } from 'framer-motion';
import { GitHubUser } from '@/types';

interface AboutProps {
  user: GitHubUser | null;
}

export function About({ user }: AboutProps) {
  return (
    <section id="about" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Background</div>
          <h2 className="section-title">About me</h2>
        </motion.div>

        <motion.div
          className="about-layout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="about-body">
            <p>
              I am a software engineer bridging mathematical simulation with polished developer interfaces. 
              I build distributed consensus protocols, numerical reaction models, and clean web applications, focusing on strict typing and structural clarity. 
              My development approach combines the analytical rigor of chemical engineering with the precision of modern systems design.
            </p>
          </div>

          <div className="about-sidebar">
            {user?.location && (
              <div className="about-row">
                <div className="about-row-label">Location</div>
                <div className="about-row-value">{user.location}</div>
              </div>
            )}
            <div className="about-row">
              <div className="about-row-label">Focus</div>
              <div className="about-row-value">Full-Stack Development / Systems</div>
            </div>
            <div className="about-row">
              <div className="about-row-label">Currently building</div>
              <div className="about-row-value">Distributed systems and graphics utilities</div>
            </div>
            <div className="about-row">
              <div className="about-row-label">GitHub</div>
              <a
                href={user?.html_url || 'https://github.com/Rinneagan'}
                target="_blank"
                rel="noopener noreferrer"
                className="about-row-link"
              >
                @{user?.login || 'Rinneagan'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

