export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at?: string;
  topics: string[];
  homepage: string | null;
  license: {
    name: string;
  } | null;
  size: number;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GITHUB_API_BASE = 'https://api.github.com';

export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 300 } // Cache for 5 minutes for more frequent updates
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    return repos.filter((repo: GitHubRepo) => !repo.fork);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

export async function getUserInfo(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 300 } // Cache for 5 minutes for more frequent updates
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
