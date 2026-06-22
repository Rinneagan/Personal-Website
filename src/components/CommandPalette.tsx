'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubRepo, GitHubCommitEvent } from '@/types';
import { LanguageIcon } from './LanguageIcon';

// Matrix rain fall animation
const MatrixRain = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 540;
    canvas.height = 300;

    const columns = Math.floor(canvas.width / 12);
    const yPositions = Array(columns).fill(0);
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+-/\\|";

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#50fa7b';
      ctx.font = '10px monospace';

      for (let i = 0; i < yPositions.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 12;
        const y = yPositions[i];

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          yPositions[i] = 0;
        } else {
          yPositions[i] += 12;
        }
      }
    };

    const interval = setInterval(draw, 33);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExit]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', background: '#000' }} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        fontSize: '0.65rem',
        color: '#50fa7b',
        background: 'rgba(10, 12, 16, 0.8)',
        padding: '2px 6px',
        borderRadius: '3px',
        fontFamily: 'var(--font-mono)',
        border: '1px solid #1b4332',
        pointerEvents: 'none'
      }}>
        ESC to exit Matrix mode
      </div>
    </div>
  );
};

interface CommandPaletteProps {
  repos: GitHubRepo[];
  isOpen: boolean;
  onClose: () => void;
  onChangeTheme: (theme: string) => void;
  onSelectRepo: (repo: GitHubRepo) => void;
  currentTheme?: string;
  activity: GitHubCommitEvent[];
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Themes' | 'Actions';
  action: () => void;
}

interface ConsoleLine {
  id: string;
  type: 'input' | 'output' | 'error';
  text: React.ReactNode;
}

export function CommandPalette({
  repos,
  isOpen,
  onClose,
  onChangeTheme,
  onSelectRepo,
  currentTheme = 'light',
  activity = [],
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Terminal Theme CLI specific states
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<ConsoleLine[]>([
    {
      id: 'welcome',
      type: 'output',
      text: 'Welcome to Essel-Shell v1.2.0 (Retro Terminal mode). Type "help" for a list of available CLI commands.',
    },
  ]);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Easter Eggs states
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isKernelPanic, setIsKernelPanic] = useState(false);
  const [panicProgress, setPanicProgress] = useState(0);

  // Focus managers
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (currentTheme === 'terminal') {
        setTimeout(() => terminalInputRef.current?.focus(), 80);
      } else {
        setTimeout(() => inputRef.current?.focus(), 80);
        setActiveIndex(0);
        setQuery('');
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentTheme]);

  // Autoscroll terminal shell to bottom when history updates
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const staticCommands: CommandItem[] = [
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      category: 'Navigation',
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-timeline',
      title: 'Go to Project History',
      category: 'Navigation',
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-skills',
      title: 'Go to Skills',
      category: 'Navigation',
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-about',
      title: 'Go to About Me',
      category: 'Navigation',
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-contact',
      title: 'Go to Contact Form',
      category: 'Navigation',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'theme-white',
      title: 'Set Theme to Pure White',
      category: 'Themes',
      action: () => {
        onChangeTheme('white');
        onClose();
      },
    },
    {
      id: 'theme-light',
      title: 'Set Theme to Warm Editorial',
      category: 'Themes',
      action: () => {
        onChangeTheme('light');
        onClose();
      },
    },
    {
      id: 'theme-dark',
      title: 'Set Theme to Dracula Dark',
      category: 'Themes',
      action: () => {
        onChangeTheme('dark');
        onClose();
      },
    },
    {
      id: 'theme-terminal',
      title: 'Set Theme to Monospace Terminal',
      category: 'Themes',
      action: () => {
        onChangeTheme('terminal');
        onClose();
      },
    },
    {
      id: 'action-copy-email',
      title: 'Copy Email Address',
      category: 'Actions',
      action: () => {
        navigator.clipboard.writeText('ebenezer.k.b.essel@gmail.com');
        alert('Email copied to clipboard!');
        onClose();
      },
    },
    {
      id: 'action-github',
      title: 'Open GitHub Profile',
      category: 'Actions',
      action: () => {
        window.open('https://github.com/Rinneagan', '_blank');
        onClose();
      },
    },
  ];

  // Visual Palette Filtering
  const filteredCommands = staticCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.language && r.language.toLowerCase().includes(query.toLowerCase()))
  );

  const totalItems = filteredCommands.length + filteredRepos.length;

  // Keyboard navigation inside search mode
  useEffect(() => {
    if (currentTheme === 'terminal') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex < filteredCommands.length) {
          filteredCommands[activeIndex].action();
        } else {
          const repoIndex = activeIndex - filteredCommands.length;
          onSelectRepo(filteredRepos[repoIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, totalItems, filteredCommands, filteredRepos, currentTheme]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Terminal mode commands parser
  const handleTerminalSubmit = () => {
    const rawCmd = terminalInput.trim();
    if (!rawCmd) return;

    const newLines: ConsoleLine[] = [
      {
        id: `input-${Date.now()}`,
        type: 'input',
        text: `guest@essel-desktop:~$ ${rawCmd}`,
      },
    ];

    const parts = rawCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span>Available CLI commands:</span>
              <span>  help              - Show this help manual</span>
              <span>  about             - Print biography and engineering context</span>
              <span>  projects          - List owner projects on GitHub</span>
              <span>  project &lt;num&gt;     - Inspect project stats modal (e.g. &quot;project 1&quot;)</span>
              <span>  commits           - Display recent dynamic git push activity log</span>
              <span>  theme &lt;name&gt;      - Switch theme (white, light, dark, terminal)</span>
              <span>  neofetch          - Print system info layout</span>
              <span>  matrix            - Start Matrix code digital rain simulator</span>
              <span>  sudo rm -rf /     - Test system security overrides</span>
              <span>  contact           - Display email address & copy to clipboard</span>
              <span>  clear             - Clear screen history log</span>
              <span>  exit / close      - Close shell overlays</span>
            </div>
          ),
        });
        break;

      case 'commits':
      case 'activity':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ textDecoration: 'underline' }}>Recent GitHub Logs ({activity.length} commits):</span>
              {activity.length === 0 ? (
                <span>No recent commits found.</span>
              ) : (
                activity.map((log) => (
                  <span key={log.id}>
                    [<span style={{ color: '#8be9fd' }}>{log.sha}</span>] {log.repoName} - {log.message}
                  </span>
                ))
              )}
            </div>
          ),
        });
        break;

      case 'about':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--blue)' }}>Ebenezer K. Essel</span>
              <span>Systems Engineer & Full-Stack Developer creating scalable software architectures.</span>
              <span>Primary Tech: Go, Rust, TypeScript, Python, React, Next.js, Docker, Linux systems.</span>
              <span>Location: Accra, Ghana</span>
            </div>
          ),
        });
        break;

      case 'projects':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ textDecoration: 'underline' }}>Dynamic Repositories ({repos.length} owners):</span>
              {repos.map((repo, idx) => (
                <span key={repo.id}>
                  [{idx + 1}] <strong style={{ color: 'var(--text-1)' }}>{repo.name}</strong> - ⭐ {repo.stargazers_count} stars | {repo.language || 'N/A'}
                </span>
              ))}
              <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.2rem' }}>
                Use &quot;project &lt;num&gt;&quot; to inspect details.
              </span>
            </div>
          ),
        });
        break;

      case 'project': {
        const index = parseInt(args[0], 10);
        if (isNaN(index) || index < 1 || index > repos.length) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: 'Error: invalid project index. Type "projects" to view indices.',
          });
        } else {
          const repo = repos[index - 1];
          onSelectRepo(repo);
          onClose();
          return; // Modal opens, close overlay instantly
        }
        break;
      }

      case 'theme': {
        const selectedTheme = args[0]?.toLowerCase();
        if (['white', 'light', 'dark', 'terminal'].includes(selectedTheme)) {
          onChangeTheme(selectedTheme);
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            text: `Theme successfully set to: ${selectedTheme}`,
          });
        } else {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: 'Error: theme not found. Select "white", "light", "dark", or "terminal".',
          });
        }
        break;
      }

      case 'neofetch': {
        const resWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const resHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const uptimeMins = Math.floor(performance.now() / 60000) + 12;
        const asciiLogo = [
          "   .-/+oossssoo+/-.   ",
          "  `:+ssssssssssssss:` ",
          "  -+ssssssssssssssss+-",
          " `syyyyyyyyyyyyyyyyyys`",
          "`yyyyyyyyyyyyyyyyyyyyyy`",
          "`yyyyyyyyyyyyyyyyyyyyyy`",
          "`syyyyyyyyyyyyyyyyyys`",
          " -+ssssssssssssssss+-",
          "  `:+ssssssssssssss:` ",
          "   `.-/+oossssoo+/-.` "
        ].join("\n");

        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: '1.3' }}>
              <div style={{ color: '#50fa7b', whiteSpace: 'pre', flexShrink: 0 }}>
                {asciiLogo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ color: '#8be9fd', fontWeight: 700 }}>guest@essel-desktop</span>
                <span>-------------------</span>
                <span><strong style={{color:'#ff5555'}}>OS:</strong> Essel-OS v1.2.0 (Terminal Mode)</span>
                <span><strong style={{color:'#ff5555'}}>Host:</strong> Personal-Website v2.0 (Next.js 16)</span>
                <span><strong style={{color:'#ff5555'}}>Kernel:</strong> V8 JS Sandbox Engine</span>
                <span><strong style={{color:'#ff5555'}}>Uptime:</strong> {uptimeMins}m (Session active)</span>
                <span><strong style={{color:'#ff5555'}}>Shell:</strong> Essel-Terminal CLI (zsh-like)</span>
                <span><strong style={{color:'#ff5555'}}>Resolution:</strong> {resWidth}x{resHeight} px</span>
                <span><strong style={{color:'#ff5555'}}>Theme:</strong> Dracula Monospace Dark</span>
                <span><strong style={{color:'#ff5555'}}>CPU:</strong> Client Virtual Thread Executer</span>
                <span><strong style={{color:'#ff5555'}}>Memory:</strong> Dynamic JS Heap (Sufficient)</span>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'matrix':
        setIsMatrixMode(true);
        break;

      case 'sudo': {
        const fullCmd = rawCmd.toLowerCase();
        if (fullCmd.includes('rm -rf')) {
          setIsKernelPanic(true);
          setPanicProgress(0);
          
          const lines = [
            'WARNING: Root partition deletion requested.',
            'Initializing administrative wiping protocol...',
            'Wiping /bin ... [OK]',
            'Wiping /etc ... [OK]',
            'Wiping /lib ... [OK]',
            'Wiping /sys ... [OK]',
            'Wiping /usr ... [OK]',
            'Wiping local cache ... [CRITICAL PRE-CONDITION FAIL]',
            '!!! EXCEPTION: KERNEL PANIC !!!',
          ];

          let timer = 0;
          lines.forEach((lineText, index) => {
            setTimeout(() => {
              setTerminalHistory((prev) => [
                ...prev,
                {
                  id: `panic-${Date.now()}-${index}`,
                  type: lineText.startsWith('!') || lineText.includes('CRITICAL') ? 'error' : 'output',
                  text: lineText,
                },
              ]);
            }, timer);
            timer += 250;
          });

          setTimeout(() => {
            setPanicProgress(1);
          }, timer + 400);

          setTimeout(() => {
            setIsKernelPanic(false);
            setPanicProgress(0);
            setTerminalHistory((prev) => [
              ...prev,
              {
                id: `panic-recover-${Date.now()}`,
                type: 'output',
                text: 'System self-healed. Dynamic state restored from cache backup. Don\'t try that again!',
              },
            ]);
          }, timer + 4400);

        } else {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: 'Error: superuser action unauthorized. Try "sudo rm -rf /" to check system security.',
          });
        }
        break;
      }

      case 'contact':
        navigator.clipboard.writeText('ebenezer.k.b.essel@gmail.com');
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Email: ebenezer.k.b.essel@gmail.com (Successfully copied to clipboard!)',
        });
        break;

      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;

      case 'exit':
      case 'close':
        onClose();
        setTerminalInput('');
        return;

      default:
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `Error: command not found: "${command}". Type "help" to display commands.`,
        });
    }

    setTerminalHistory((prev) => [...prev, ...newLines]);
    setTerminalInput('');
  };

  if (!isOpen) return null;

  const isTerminal = currentTheme === 'terminal';

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12vh',
          paddingInline: '1rem',
        }}
      >
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '560px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isTerminal ? (
            /* ================= TERMINAL MODE SHELL UI ================= */
            <div style={{ display: 'flex', flexDirection: 'column', background: '#0a0c10', color: '#50fa7b', fontFamily: 'var(--font-mono)' }}>
              {/* Shell header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: '#12161f', borderBottom: '1px solid #1b4332', fontSize: '0.7rem', color: '#8a9b8f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5555' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1fa8c' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#50fa7b' }} />
                  <span style={{ marginLeft: '0.35rem' }}>guest@essel-desktop:~</span>
                </div>
                <span>sh</span>
              </div>

              {/* Terminal Stdout history */}
              {isKernelPanic && panicProgress === 1 ? (
                <div
                  style={{
                    height: '300px',
                    background: '#7f0000',
                    color: '#fff',
                    padding: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textShadow: '0 0 4px rgba(255, 0, 0, 0.5)',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ff5555', borderBottom: '2px solid #ff5555', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    ☣️ KERNEL PANIC: ROOT_DIRECTORY_PURGED
                  </div>
                  <div>A fatal security exception has occurred and standard terminal thread processing is suspended.</div>
                  <div style={{ color: '#f1fa8c' }}>Exception: Unauthorized root execution "sudo rm -rf /".</div>
                  <div style={{ opacity: 0.8 }}>Dump details: Code 0xDEADBEEF, Segment 0x00FF8B4</div>
                  <div style={{ opacity: 0.8 }}>Contacting systems engineer Ebenezer Essel...</div>
                  <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#50fa7b' }}>
                    Rebooting environment and restoring state files...
                  </div>
                </div>
              ) : isMatrixMode ? (
                <MatrixRain onExit={() => setIsMatrixMode(false)} />
              ) : (
                <div
                  ref={terminalScrollRef}
                  style={{
                    height: '300px',
                    overflowY: 'auto',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                  }}
                >
                  {terminalHistory.map((line) => (
                    <div
                      key={line.id}
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: line.type === 'error' ? '#ff5555' : line.type === 'input' ? '#8be9fd' : '#50fa7b',
                        textShadow: line.type === 'output' ? '0 0 3px rgba(80, 250, 123, 0.35)' : 'none',
                      }}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Terminal Input Prompt */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderTop: '1px solid #1b4332', gap: '0.5rem', background: '#0a0c10' }}>
                <span style={{ color: '#8be9fd', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>guest@essel-desktop:~$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  disabled={isKernelPanic || isMatrixMode}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalSubmit();
                    } else if (e.key === 'Escape') {
                      onClose();
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.8rem',
                    color: '#50fa7b',
                    fontFamily: 'var(--font-mono)',
                    caretColor: '#50fa7b',
                  }}
                  placeholder={isKernelPanic ? "System locked..." : isMatrixMode ? "Press ESC to exit..." : "Type commands..."}
                />
              </div>
            </div>
          ) : (
            /* ================= STANDARD SEARCH OVERLAY UI ================= */
            <>
              {/* Input field */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-dim)', gap: '0.75rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, navigation, or commands..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: 'var(--text-1)',
                    fontFamily: 'inherit',
                  }}
                />
                <div
                  onClick={onClose}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.4rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  ESC
                </div>
              </div>

              {/* Results list */}
              <div
                style={{
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {totalItems === 0 && (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}

                {/* Static Commands */}
                {filteredCommands.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.65rem', fontWeight: 650, textTransform: 'uppercase', color: 'var(--text-3)', padding: '0.5rem 0.75rem 0.25rem', letterSpacing: '0.08em' }}>
                      Commands & Actions
                    </div>
                    {filteredCommands.map((cmd, idx) => {
                      const isHighlighted = idx === activeIndex;
                      return (
                        <div
                          key={cmd.id}
                          onClick={() => cmd.action()}
                          style={{
                            padding: '0.6rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isHighlighted ? 'var(--bg-subtle)' : 'transparent',
                            color: isHighlighted ? 'var(--text-1)' : 'var(--text-2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.86rem',
                            fontWeight: isHighlighted ? 500 : 450,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.7 }}>
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            {cmd.title}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{cmd.category}</span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Repositories */}
                {filteredRepos.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.65rem', fontWeight: 650, textTransform: 'uppercase', color: 'var(--text-3)', padding: '0.75rem 0.75rem 0.25rem', letterSpacing: '0.08em' }}>
                      GitHub Repositories
                    </div>
                    {filteredRepos.map((repo, idx) => {
                      const itemIndex = filteredCommands.length + idx;
                      const isHighlighted = itemIndex === activeIndex;
                      return (
                        <div
                          key={repo.id}
                          onClick={() => {
                            onSelectRepo(repo);
                            onClose();
                          }}
                          style={{
                            padding: '0.6rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isHighlighted ? 'var(--bg-subtle)' : 'transparent',
                            color: isHighlighted ? 'var(--text-1)' : 'var(--text-2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.86rem',
                            fontWeight: isHighlighted ? 500 : 450,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                            {repo.language && (
                              <LanguageIcon language={repo.language} size={14} />
                            )}
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {repo.name}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
                            ★ {repo.stargazers_count}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}

          {/* Footer guides */}
          <div
            style={{
              padding: '0.65rem 1.25rem',
              background: isTerminal ? '#12161f' : 'var(--bg-subtle)',
              borderTop: isTerminal ? '1px solid #1b4332' : '1px solid var(--border-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: isTerminal ? '#8a9b8f' : 'var(--text-3)',
              fontWeight: 500,
            }}
          >
            {isTerminal ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span>Type &quot;help&quot; for instruction manual</span>
                <span>ESC to exit shell</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span>↑↓ Navigation</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
            )}
            <div>⌘K / Ctrl+K</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
