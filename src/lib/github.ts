export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  homepage: string | null;
  license: {
    name: string;
  } | null;
  size: number;
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
  type?: string;
  company?: string | null;
}

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Test simple API call
export async function testGitHubAPI(): Promise<boolean> {
  try {
    console.log('Making test API call to GitHub...');
    const url = 'https://api.github.com/users/github';
    console.log('Test URL:', url);
    
    // First try with token
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
      console.log('Using token for test call');
      console.log('Token starts with:', GITHUB_TOKEN.substring(0, 10) + '...');
    } else {
      console.log('No token for test call');
    }
    
    console.log('Request headers:', headers);
    
    const response = await fetch(url, { headers });
    
    console.log('Test response status:', response.status);
    console.log('Test response ok:', response.ok);
    
    // Check rate limit headers
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitLimit = response.headers.get('x-ratelimit-limit');
    
    console.log('Rate limit remaining:', rateLimitRemaining);
    console.log('Rate limit limit:', rateLimitLimit);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Test response body:', errorText);
      
      // If token fails, try without it
      if (GITHUB_TOKEN && (response.status === 401 || response.status === 403)) {
        console.log('Token failed, trying without authentication...');
        const unauthResponse = await fetch(url, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        
        console.log('Unauth response status:', unauthResponse.status);
        console.log('Unauth response ok:', unauthResponse.ok);
        
        if (unauthResponse.ok) {
          const data = await unauthResponse.json();
          console.log('Unauth API call successful for user:', data.login);
          return true;
        } else {
          const unauthError = await unauthResponse.text();
          console.log('Unauth response body:', unauthError);
          return false;
        }
      }
      
      return false;
    }
    
    const data = await response.json();
    console.log('Test API call successful for user:', data.login);
    console.log('Test user data:', { login: data.login, name: data.name, public_repos: data.public_repos });
    return true;
  } catch (error: any) {
    console.error('Test API call failed with error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add authorization header if token is available
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    console.log(`Fetching repos for: ${username}`);
    const url = `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=50`;
    console.log(`Request URL: ${url}`);

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    console.log(`Repos response status: ${response.status}`);
    console.log(`Repos response ok: ${response.ok}`);

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        console.warn(`GitHub API rate limit exceeded for ${username} repos`);
        return [];
      } else if (response.status === 404) {
        console.warn(`User ${username} not found`);
        return [];
      } else {
        const errorText = await response.text();
        console.error(`GitHub API error ${response.status}: ${errorText}`);
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    const repos = await response.json();
    console.log(`Fetched ${repos.length} repositories`);
    const filteredRepos = repos.filter((repo: any) => !repo.fork);
    console.log(`After filtering forks: ${filteredRepos.length} repositories`);
    return filteredRepos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

export async function getUserInfo(username: string): Promise<GitHubUser | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add authorization header if token is available
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      console.log('Using GitHub token for authentication');
    } else {
      console.log('No GitHub token found - using unauthenticated requests');
    }

    console.log(`Fetching user info for: ${username}`);
    const url = `${GITHUB_API_BASE}/users/${username}`;
    console.log(`Request URL: ${url}`);

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        console.warn(`GitHub API rate limit exceeded for ${username}`);
        return null;
      } else if (response.status === 404) {
        console.warn(`User ${username} not found`);
        return null;
      } else {
        const errorText = await response.text();
        console.error(`GitHub API error ${response.status}: ${errorText}`);
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    const userData = await response.json();
    console.log('User data fetched successfully:', userData.login);
    return userData;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
