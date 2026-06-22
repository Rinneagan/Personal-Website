export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'id'>> = {
  'retro-hacker': {
    title: 'Retro Hacker',
    description: 'Enabled the terminal monospace theme.',
    icon: '💻',
  },
  'keyboard-warrior': {
    title: 'Keyboard Warrior',
    description: 'Opened the Command Palette using keyboard shortcut (Ctrl+K or ⌘K).',
    icon: '⌨️',
  },
  'dna-explorer': {
    title: 'DNA Explorer',
    description: 'Triggered the Project DNA simulation.',
    icon: '🧬',
  },
  'secret-agent': {
    title: 'Secret Agent',
    description: 'Typed "sudo rm -rf /" in the CLI terminal.',
    icon: '🕵️',
  },
  'detailed-reviewer': {
    title: 'Detailed Reviewer',
    description: 'Opened at least 3 project detail modals.',
    icon: '🔍',
  },
};

export const getUnlockedAchievements = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('portfolio-achievements');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const unlockAchievement = (id: string) => {
  if (typeof window === 'undefined') return;
  if (!ACHIEVEMENTS[id]) return;

  try {
    const unlocked = getUnlockedAchievements();
    if (unlocked[id]) return; // Already unlocked

    const now = new Date().toISOString();
    unlocked[id] = now;
    localStorage.setItem('portfolio-achievements', JSON.stringify(unlocked));

    // Dispatch a custom event to notify any mounted toast listeners
    const event = new CustomEvent('achievement-unlocked', {
      detail: {
        id,
        unlockedAt: now,
        ...ACHIEVEMENTS[id],
      },
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.error('Error unlocking achievement:', err);
  }
};
