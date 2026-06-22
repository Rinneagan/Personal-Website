'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/achievements';

export function AchievementToaster() {
  const [toasts, setToasts] = useState<Achievement[]>([]);

  useEffect(() => {
    const handleUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<Achievement>;
      const newAchievement = customEvent.detail;
      
      // Add toast
      setToasts((prev) => [...prev, newAchievement]);

      // Automatically remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newAchievement.id));
      }, 5000);
    };

    window.addEventListener('achievement-unlocked', handleUnlock);
    return () => window.removeEventListener('achievement-unlocked', handleUnlock);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
        maxWidth: '320px',
        width: '100%',
      }}
    >
      <AnimatePresence>
        {toasts.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{
              pointerEvents: 'auto',
              background: 'var(--surface)',
              border: '1px solid var(--blue)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.18), var(--shadow-lg)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glowing Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'var(--blue)',
              }}
            />

            {/* Icon */}
            <div
              style={{
                fontSize: '1.75rem',
                lineHeight: 1,
                padding: '0.2rem',
                background: 'var(--blue-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--blue-border)',
                flexShrink: 0,
              }}
            >
              {achievement.icon}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--blue)',
                }}
              >
                🏆 Achievement Unlocked!
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-1)',
                }}
              >
                {achievement.title}
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-2)',
                  lineHeight: '1.4',
                }}
              >
                {achievement.description}
              </div>
            </div>

            {/* Manual Close Button */}
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== achievement.id))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-3)',
                cursor: 'pointer',
                padding: '0.2rem',
                margin: '-0.2rem -0.2rem 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              aria-label="Close Notification"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
