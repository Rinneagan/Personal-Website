export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
}

export interface BaseRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages?: string[];
  language_stats?: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  license?: { name: string; spdx_id?: string } | null;
}

export interface GitHubRepo extends BaseRepo {
  full_name: string;
  watchers_count: number;
  created_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
  archived: boolean;
  visibility: string;
}

export interface GitHubCommitEvent {
  id: string;
  repoName: string;
  message: string;
  sha: string;
  timestamp: string;
}

