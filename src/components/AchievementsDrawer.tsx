'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS, getUnlockedAchievements, Achievement } from '@/lib/achievements';

export function AchievementsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<Record<string, string>>({});

  // Sync state with localstorage on load and whenever an achievement event fires
  const loadAchievements = () => {
    setUnlocked(getUnlockedAchievements());
  };

  useEffect(() => {
    loadAchievements();
    window.addEventListener('achievement-unlocked', loadAchievements);
    return () => window.removeEventListener('achievement-unlocked', loadAchievements);
  }, []);

  const totalBadges = Object.keys(ACHIEVEMENTS).length;
  const unlockedCount = Object.keys(unlocked).length;

  return (
    <>
      {/* Floating Trophy Widget */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 9999,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '0.65rem 1.1rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-1)',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '1rem' }}>🏆</span>
        <span>Achievements</span>
        <span
          style={{
            background: unlockedCount === totalBadges ? 'var(--green)' : 'var(--blue)',
            color: '#fff',
            borderRadius: '99px',
            padding: '0.1rem 0.45rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            transition: 'background 0.3s',
          }}
        >
          {unlockedCount}/{totalBadges}
        </span>
      </motion.button>

      {/* Drawer Overlay & Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#000',
                zIndex: 99998,
                cursor: 'pointer',
              }}
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '350px',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                padding: '1.75rem',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-dim)',
                  paddingBottom: '1rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-1)' }}>
                    🏆 Achievements
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0 }}>
                    Gamified portfolio milestones tracker
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Summary Bar */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  <span style={{ color: 'var(--text-2)' }}>Milestones Completed</span>
                  <span style={{ color: 'var(--blue)' }}>
                    {Math.round((unlockedCount / totalBadges) * 100)}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: unlockedCount === totalBadges ? 'var(--green)' : 'var(--blue)',
                    }}
                  />
                </div>
              </div>

              {/* Badges List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(ACHIEVEMENTS).map(([id, info]) => {
                  const isUnlocked = !!unlocked[id];
                  const unlockDate = unlocked[id];

                  return (
                    <div
                      key={id}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        opacity: isUnlocked ? 1 : 0.45,
                        transition: 'opacity 0.25s',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        background: isUnlocked ? 'var(--surface)' : 'var(--bg-subtle)',
                      }}
                    >
                      {/* Icon Container */}
                      <div
                        style={{
                          fontSize: '1.6rem',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--radius-sm)',
                          background: isUnlocked ? 'var(--blue-bg)' : 'var(--border)',
                          border: isUnlocked ? '1px solid var(--blue-border)' : '1px solid transparent',
                          flexShrink: 0,
                        }}
                      >
                        {isUnlocked ? info.icon : '🔒'}
                      </div>

                      {/* Detail Text */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-1)' }}>
                          {info.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-2)', lineHeight: '1.3' }}>
                          {info.description}
                        </div>
                        {isUnlocked && unlockDate && (
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-3)' }}>
                            Unlocked: {new Date(unlockDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-3)',
                  textAlign: 'center',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-dim)',
                }}
              >
                Can you unlock all of them? 😉
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
