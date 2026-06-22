import { GitHubUser, GitHubRepo, GitHubCommitEvent } from '@/types';

const USERNAME = process.env.GITHUB_USERNAME || 'Rinneagan';
const BASE_URL = 'https://api.github.com';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': `portfolio-${USERNAME}`,
  };
  
  let token = process.env.GITHUB_TOKEN;
  if (!token || token === 'your_personal_access_token_here' || token === 'your_github_token_here') {
    token = process.env.GITHUB_PAT;
  }
  
  if (token && token !== 'your_personal_access_token_here' && token !== 'your_github_token_here') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchUser(): Promise<GitHubUser | null> {
  try {
    const headers = getHeaders();
    let res = await fetch(`${BASE_URL}/users/${USERNAME}`, {
      headers,
      next: { revalidate: 3600 },
    });
    
    // If token returns 401 Bad credentials, retry public fetch
    if (res.status === 401 && headers['Authorization']) {
      console.warn('GitHub API token returned 401. Retrying without token...');
      const publicHeaders = { ...headers };
      delete publicHeaders['Authorization'];
      res = await fetch(`${BASE_URL}/users/${USERNAME}`, {
        headers: publicHeaders,
        next: { revalidate: 3600 },
      });
    }
    
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const REPO_DESCRIPTIONS: Record<string, string> = {
  'Pact': 'A decentralized consensus coordinator and secure contract-state manager designed to handle cryptographic transaction integrity.',
  'Automation-Scripts': 'A suite of high-performance shell pipelines and devops scripts configured to automate system deployment, container staging, and backup cycles.',
  'MatlabExtension': 'An advanced VS Code integration engine for MATLAB supporting real-time simulation plots, compiler diagnostics, and mathematical inline auto-completions.',
  'non-ideal-reactor-engine': 'A high-fidelity numerical simulation runtime designed to compute thermodynamic kinetics, concentration gradients, and heat dispersion in non-ideal chemical reactors.',
  'Personal-Website': 'A premium, custom-themed developer portfolio featuring live GitHub API telemetry, adaptive theme switches, and secure honey-pot validation systems.',
  'CheMate': 'A specialized molecular indexing database and stoichiometric ratio calculator designed to optimize chemical formulation yield metrics.',
  'ClassChronicle': 'A robust academic coordinator and scheduling platform that automates course enrollments, timetables, and teacher allocations.',
  'Noesis': 'A lightweight machine learning inference hub and neural text parser built to process semantic vector searches and classification logs.',
  'CHEESA-ChatBot': 'An AI-powered conversational agent trained on academic curricula to assist engineering students with real-time course answers.',
  'Songsify': 'A responsive audio streaming analytics deck and playback controller connected to live Spotify streams, featuring canvas-rendered visualizers.',
  'PacketHound': 'A low-level network packet inspector and socket telemetry collector designed to capture, decode, and analyze TCP/IP network frames.',
  'Rinne': 'A custom utility kernel providing strictly typed memory allocators, core algorithmic helpers, and hardware diagnostic hooks.',
};

export async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const headers = getHeaders();
    let res = await fetch(
      `${BASE_URL}/users/${USERNAME}/repos?sort=pushed&per_page=100&type=owner`,
      { headers, next: { revalidate: 3600 } }
    );
    
    // If token returns 401 Bad credentials, retry public fetch
    if (res.status === 401 && headers['Authorization']) {
      console.warn('GitHub API token returned 401. Retrying without token...');
      const publicHeaders = { ...headers };
      delete publicHeaders['Authorization'];
      res = await fetch(
        `${BASE_URL}/users/${USERNAME}/repos?sort=pushed&per_page=100&type=owner`,
        { headers: publicHeaders, next: { revalidate: 3600 } }
      );
    }
    
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    const activeRepos = repos.filter((r) => !r.fork && !r.archived);

    // Fetch languages for each active repository to support multiple languages per project
    const reposWithLangs = await Promise.all(
      activeRepos.map(async (repo) => {
        try {
          const reqHeaders = getHeaders();
          let langRes = await fetch(`${BASE_URL}/repos/${USERNAME}/${repo.name}/languages`, {
            headers: reqHeaders,
            next: { revalidate: 3600 },
          });

          if (langRes.status === 401 && reqHeaders['Authorization']) {
            const publicHeaders = { ...reqHeaders };
            delete publicHeaders['Authorization'];
            langRes = await fetch(`${BASE_URL}/repos/${USERNAME}/${repo.name}/languages`, {
              headers: publicHeaders,
              next: { revalidate: 3600 },
            });
          }

          if (langRes.ok) {
            const langData = await langRes.json();
            repo.languages = Object.keys(langData);
            repo.language_stats = langData;
          } else {
            repo.languages = repo.language ? [repo.language] : [];
            repo.language_stats = repo.language ? { [repo.language]: 1 } : {};
          }
        } catch {
          repo.languages = repo.language ? [repo.language] : [];
          repo.language_stats = repo.language ? { [repo.language]: 1 } : {};
        }

        // Apply compelling description overrides for actual projects
        repo.description = REPO_DESCRIPTIONS[repo.name] || repo.description || 'Open-source software project engineered and published to GitHub.';
        
        return repo;
      })
    );

    return reposWithLangs;
  } catch {
    return [];
  }
}

/* Fallback mock data shown when the API is unavailable */
export const MOCK_USER: GitHubUser = {
  login: 'Rinneagan',
  name: 'Ebenezer K. Essel',
  avatar_url: 'https://avatars.githubusercontent.com/u/150322017?v=4',
  bio: 'Full-stack software engineer building high-performance systems and polished interfaces.',
  location: 'Accra, Ghana',
  html_url: 'https://github.com/Rinneagan',
  followers: 12,
  following: 8,
  public_repos: 4,
  blog: null,
  twitter_username: null,
  created_at: '2023-11-10T00:00:00Z',
};

export const MOCK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'Personal-Website',
    full_name: 'Rinneagan/Personal-Website',
    description: 'A premium, custom-themed portfolio website with dynamic GitHub status telemetry and contact systems.',
    html_url: 'https://github.com/Rinneagan/Personal-Website',
    homepage: 'https://essel-portfolio.dev',
    language: 'TypeScript',
    languages: ['TypeScript', 'CSS', 'HTML'],
    language_stats: { TypeScript: 124300, CSS: 23500, HTML: 9800 },
    stargazers_count: 5,
    forks_count: 1,
    watchers_count: 5,
    topics: ['nextjs', 'typescript', 'framer-motion', 'theme-switcher'],
    created_at: '2026-06-18T10:00:00Z',
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    size: 2048,
    fork: false,
    archived: false,
    license: { name: 'MIT License', spdx_id: 'MIT' },
    visibility: 'public',
  },
];

export async function fetchActivity(): Promise<GitHubCommitEvent[]> {
  try {
    const headers = getHeaders();
    let res = await fetch(`${BASE_URL}/users/${USERNAME}/events`, {
      headers,
      next: { revalidate: 1800 }, // Cache events list for 30 minutes
    });

    if (res.status === 401 && headers['Authorization']) {
      const publicHeaders = { ...headers };
      delete publicHeaders['Authorization'];
      res = await fetch(`${BASE_URL}/users/${USERNAME}/events`, {
        headers: publicHeaders,
        next: { revalidate: 1800 },
      });
    }

    if (!res.ok) return [];
    const events = await res.json();
    const pushEvents = events.filter((e: any) => e.type === 'PushEvent');

    const commits: GitHubCommitEvent[] = [];
    pushEvents.forEach((event: any) => {
      const repoName = event.repo.name.replace(`${USERNAME}/`, '');
      const eventCommits = event.payload.commits || [];
      eventCommits.forEach((commit: any) => {
        commits.push({
          id: `${event.id}-${commit.sha}`,
          repoName,
          message: commit.message,
          sha: commit.sha.substring(0, 7),
          timestamp: event.created_at,
        });
      });
    });

    return commits.slice(0, 10);
  } catch {
    return [];
  }
}

export const MOCK_COMMITS: GitHubCommitEvent[] = [
  { id: 'mock-1', repoName: 'Pact', message: 'Optimized consensus verification signature latency', sha: 'a8d3e91', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'mock-2', repoName: 'Personal-Website', message: 'Added interactive project architecture DNA maps', sha: '9f2c10b', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'mock-3', repoName: 'non-ideal-reactor-engine', message: 'Integrated thermodynamic differential PDE solvers', sha: 'e4f1a23', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'mock-4', repoName: 'Rinne', message: 'Refactored memory aligned allocator pointer offsets', sha: 'd3c2b1a', timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
];


