'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',   href: '#skills'   },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
];

const PureWhiteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const THEMES = [
  { id: 'white', label: 'Pure White', icon: <PureWhiteIcon /> },
  { id: 'light', label: 'Warm Editorial', icon: <SunIcon /> },
  { id: 'dark', label: 'Sleek Dark', icon: <MoonIcon /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon /> },
];

interface NavbarProps {
  theme: string;
  onChangeTheme: (theme: string) => void;
  onOpenPalette: () => void;
}

export function Navbar({ theme, onChangeTheme, onOpenPalette }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-logo">Rinneagan</a>

        <nav aria-label="Main navigation">
          <ul className="nav-links" onMouseLeave={() => setHoveredLink(null)}>
            {LINKS.map((l) => (
              <li key={l.href} style={{ position: 'relative' }}>
                <a
                  href={l.href}
                  className="nav-link"
                  onMouseEnter={() => setHoveredLink(l.href)}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {hoveredLink === l.href && (
                    <motion.div
                      layoutId="nav-hover-bg"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right" style={{ gap: '0.5rem' }}>
          {/* Command Palette Visual Trigger */}
          <button
            onClick={onOpenPalette}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '4px 10px',
              color: 'var(--text-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
            title="Search commands and projects (Cmd+K)"
            aria-label="Search commands and projects (Cmd+K)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ opacity: 0.8 }} className="nav-github-text">Search ⌘K</span>
          </button>

          {/* Theme Switcher Segmented Control */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '2px',
            gap: '1px',
          }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onChangeTheme(t.id)}
                style={{
                  background: theme === t.id ? 'var(--surface)' : 'transparent',
                  border: 'none',
                  color: theme === t.id ? 'var(--text-1)' : 'var(--text-3)',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                title={`Switch to ${t.label} theme`}
                aria-label={`Switch to ${t.label} theme`}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <a
            href="https://github.com/Rinneagan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="nav-github-text">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
