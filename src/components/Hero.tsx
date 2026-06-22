'use client';

import { motion } from 'framer-motion';
import { GitHubUser } from '@/types';
import { formatNumber } from '@/lib/utils';
import { VibeWidget } from './VibeWidget';
import { ActivityLog } from './ActivityLog';
import { GitHubCommitEvent } from '@/types';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
});

interface HeroProps { user: GitHubUser | null; activity: GitHubCommitEvent[] }

export function Hero({ user, activity }: HeroProps) {
  const yearsOnGH = user
    ? new Date().getFullYear() - new Date(user.created_at).getFullYear()
    : null;

  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header block with avatar and name inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            
            {/* SVG profile picture (Sleek Superellipse Squircle shape) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}
            >
              <svg width="120" height="120" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(var(--shadow-md))' }}>
                <defs>
                  <clipPath id="avatar-clip">
                    <path d="M 100,10 C 170,10 190,30 190,100 C 190,170 170,190 100,190 C 30,190 10,170 10,100 C 10,30 30,10 100,10 Z" />
                  </clipPath>
                </defs>
                <image
                  href={user?.avatar_url || 'https://avatars.githubusercontent.com/u/164281023?v=4'}
                  width="200"
                  height="200"
                  clipPath="url(#avatar-clip)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <path
                  d="M 100,10 C 170,10 190,30 190,100 C 190,170 170,190 100,190 C 30,190 10,170 10,100 C 10,30 30,10 100,10 Z"
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="5.5"
                  style={{ opacity: 0.9 }}
                />
              </svg>
            </motion.div>

            {/* Name, Badge, and Role block */}
            <div style={{ flex: '1', minWidth: '280px' }}>
              <motion.div {...anim(0)}>
                <div className="hero-badge" style={{ marginBottom: '0.65rem' }}>
                  <span className="hero-badge-pulse" aria-hidden="true" />
                  Open to opportunities
                </div>
              </motion.div>

              <motion.h1 className="hero-name" style={{ margin: 0, lineHeight: 1.05 }} {...anim(0.07)}>
                {user?.name || 'Ebenezer K. Essel'}
              </motion.h1>

              <motion.p className="hero-role" style={{ margin: '0.4rem 0 0 0' }} {...anim(0.13)}>
                Full-Stack Developer / Systems Engineer
              </motion.p>
            </div>
          </div>

          {/* Underneath details: Bio, Actions, and Stats */}
          <div style={{ maxWidth: '800px' }}>
            <motion.p className="hero-bio" style={{ maxWidth: '720px', fontSize: '1.05rem', marginBlock: '1rem 2rem' }} {...anim(0.18)}>
              {user?.bio || 'I build clean, high-performance software — from backend architectures to polished interfaces. Focused on modular, scalable designs.'}
            </motion.p>

            <motion.div className="hero-actions" style={{ marginBottom: '2.5rem' }} {...anim(0.24)}>
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#contact" className="btn btn-outline">Get in touch</a>
              <a
                href={user?.html_url || 'https://github.com/Rinneagan'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                @{user?.login || 'Rinneagan'}
              </a>
            </motion.div>

            {user && (
              <motion.div {...anim(0.3)}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
                  <div className="hero-stats" style={{ flex: '1', minWidth: '240px' }}>
                    <div className="hero-stat" style={{ flex: '1' }}>
                      <div className="hero-stat-number">{formatNumber(user.public_repos)}</div>
                      <div className="hero-stat-label">Repos</div>
                    </div>
                    <div className="hero-stat" style={{ flex: '1' }}>
                      <div className="hero-stat-number">{formatNumber(user.followers)}</div>
                      <div className="hero-stat-label">Followers</div>
                    </div>
                    {yearsOnGH !== null && (
                      <div className="hero-stat" style={{ flex: '1' }}>
                        <div className="hero-stat-number">{yearsOnGH}<span style={{fontSize:'1rem',fontWeight:400}}>yr</span></div>
                        <div className="hero-stat-label">GitHub</div>
                      </div>
                    )}
                  </div>
                  
                  <VibeWidget />
                  
                  <ActivityLog activity={activity} />
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
