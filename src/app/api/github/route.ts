import { NextResponse } from 'next/server';
import { fetchUser, fetchRepos, fetchActivity, MOCK_USER, MOCK_REPOS, MOCK_COMMITS } from '@/lib/github';
import { GitHubRepo } from '@/types';

export const dynamic = 'force-dynamic';

function computeLanguageStats(repos: GitHubRepo[]): Record<string, number> {
  const stats: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language_stats) {
      Object.entries(repo.language_stats).forEach(([lang, bytes]) => {
        stats[lang] = (stats[lang] || 0) + bytes;
      });
    }
  });
  return stats;
}

export async function GET() {
  try {
    const [user, repos, activity] = await Promise.all([fetchUser(), fetchRepos(), fetchActivity()]);

    if (!user) {
      const languageStats = computeLanguageStats(MOCK_REPOS);
      return NextResponse.json({ user: MOCK_USER, repos: MOCK_REPOS, languageStats, activity: MOCK_COMMITS, isFallback: true });
    }

    const languageStats = computeLanguageStats(repos);
    return NextResponse.json({ user, repos, languageStats, activity, isFallback: false });
  } catch (err) {
    console.error('GitHub API error:', err);
    const languageStats = computeLanguageStats(MOCK_REPOS);
    return NextResponse.json({ user: MOCK_USER, repos: MOCK_REPOS, languageStats, activity: MOCK_COMMITS, isFallback: true });
  }
}
