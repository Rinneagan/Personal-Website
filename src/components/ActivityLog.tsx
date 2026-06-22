'use client';

import { GitHubCommitEvent } from '@/types';

interface ActivityLogProps {
  activity: GitHubCommitEvent[];
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function ActivityLog({ activity }: ActivityLogProps) {
  const logs = activity || [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '1.25rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        minWidth: '240px',
        flex: '1',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)' }}>
          Live Git Stream
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'inline-block',
              animation: 'pulse 1.8s infinite',
            }}
          />
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          `}</style>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 600 }}>Active</span>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-dim)' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxHeight: '140px',
          overflowY: 'auto',
          paddingRight: '2px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', textAlign: 'center', paddingBlock: '1rem' }}>
            No recent logs found.
          </div>
        ) : (
          logs.slice(0, 4).map((log) => (
            <a
              key={log.id}
              href={`https://github.com/Rinneagan/${log.repoName}/commit/${log.sha}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.15rem',
                textDecoration: 'none',
                padding: '0.4rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                border: '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.background = 'var(--bg-subtle)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--blue)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px',
                  }}
                >
                  {log.repoName}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {log.sha}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-2)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    flex: '1',
                  }}
                  title={log.message}
                >
                  {log.message}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', flexShrink: 0 }}>
                  {formatRelativeTime(log.timestamp)}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
