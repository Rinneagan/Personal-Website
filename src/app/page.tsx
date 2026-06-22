'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CommandPalette } from '@/components/CommandPalette';
import { ProjectModal } from '@/components/ProjectModal';
import { AchievementToaster } from '@/components/AchievementToaster';
import { AchievementsDrawer } from '@/components/AchievementsDrawer';
import { GitHubUser, GitHubRepo, GitHubCommitEvent } from '@/types';
import { MOCK_USER, MOCK_REPOS, MOCK_COMMITS } from '@/lib/github';
import { unlockAchievement } from '@/lib/achievements';

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [activity, setActivity] = useState<GitHubCommitEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [openedRepos, setOpenedRepos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'terminal') {
      unlockAchievement('retro-hacker');
    }
  };

  const handleSelectRepo = (repo: GitHubRepo | null) => {
    setSelectedRepo(repo);
    if (repo) {
      setOpenedRepos((prev) => {
        const next = new Set(prev);
        next.add(repo.name);
        if (next.size >= 3) {
          unlockAchievement('detailed-reviewer');
        }
        return next;
      });
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/github?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setRepos(data.repos);
          setActivity(data.activity || []);
        } else {
          setUser(MOCK_USER);
          setRepos(MOCK_REPOS);
          setActivity(MOCK_COMMITS);
        }
      } catch {
        setUser(MOCK_USER);
        setRepos(MOCK_REPOS);
        setActivity(MOCK_COMMITS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Set up global shortcut (Cmd+K or Ctrl+K) to toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
        unlockAchievement('keyboard-warrior');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--text-1)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <div className="crt-overlay" />
      <Navbar theme={theme} onChangeTheme={changeTheme} onOpenPalette={() => setIsPaletteOpen(true)} />
      <main style={{ paddingTop: '56px' }}>
        <Hero user={user} activity={activity} />
        <Projects repos={repos} selectedRepo={selectedRepo} onSelectRepo={handleSelectRepo} />
        <Experience repos={repos} onSelectRepo={handleSelectRepo} />
        <Skills />
        <About user={user} />
        <Contact />
      </main>
      <Footer />
      
      <CommandPalette
        repos={repos}
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onChangeTheme={changeTheme}
        onSelectRepo={handleSelectRepo}
        currentTheme={theme}
        activity={activity}
      />
      
      <ProjectModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />

      <AchievementToaster />
      <AchievementsDrawer />
    </>
  );
}
