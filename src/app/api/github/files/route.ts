import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo');
    const branch = searchParams.get('branch') || 'main';

    if (!repo) {
      return NextResponse.json({ error: 'Repository name required' }, { status: 400 });
    }

    const headers = getHeaders();
    
    // Fetch repository default branch first if we didn't receive one
    let targetBranch = branch;
    if (!searchParams.get('branch')) {
      const repoRes = await fetch(`${BASE_URL}/repos/${USERNAME}/${repo}`, {
        headers,
        next: { revalidate: 3600 }
      });
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        targetBranch = repoData.default_branch || 'main';
      }
    }

    const treeUrl = `${BASE_URL}/repos/${USERNAME}/${repo}/git/trees/${targetBranch}?recursive=1`;
    let res = await fetch(treeUrl, {
      headers,
      next: { revalidate: 3600 },
    });

    // If rate limited or 404, retry without Auth (or fallback if already public)
    if (res.status === 401 && headers['Authorization']) {
      const publicHeaders = { ...headers };
      delete publicHeaders['Authorization'];
      res = await fetch(treeUrl, {
        headers: publicHeaders,
        next: { revalidate: 3600 },
      });
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const data = await res.json();
    if (!data.tree || !Array.isArray(data.tree)) {
      throw new Error('Invalid tree response');
    }

    // Filter files (blobs) with source code extensions
    const fileExtensions = /\.(go|py|ts|tsx|js|jsx|rs|cpp|c|h|sh|json|css|md|yaml|yml)$/i;
    // Exclude common build/node/temp folders to keep tree clean
    const excludePaths = /^(node_modules|\.next|build|dist|\.git|\.github|package-lock\.json|yarn\.lock|pnpm-lock\.yaml)/i;

    const files = data.tree
      .filter((item: any) => item.type === 'blob' && fileExtensions.test(item.path) && !excludePaths.test(item.path))
      .map((item: any) => ({
        path: item.path,
        name: item.path.split('/').pop() || item.path,
        size: item.size || 0,
        url: item.url,
      }))
      .slice(0, 30); // Limit to 30 files maximum to avoid cluttering the tree selector

    return NextResponse.json({ files, defaultBranch: targetBranch, isFallback: false });
  } catch (err: any) {
    console.warn(`Files API error for repo, falling back to mock:`, err.message);
    // Return flag indicating fallback so the client can use mock tree
    return NextResponse.json({ files: [], isFallback: true });
  }
}
