import { NextResponse } from 'next/server';

const USERNAME = process.env.GITHUB_USERNAME || 'Rinneagan';
const BASE_URL = 'https://api.github.com';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3.raw', // Request raw file content directly
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
    const path = searchParams.get('path');
    const branch = searchParams.get('branch') || 'main';

    if (!repo || !path) {
      return NextResponse.json({ error: 'Repository and path required' }, { status: 400 });
    }

    const headers = getHeaders();
    const contentUrl = `${BASE_URL}/repos/${USERNAME}/${repo}/contents/${path}?ref=${branch}`;

    let res = await fetch(contentUrl, {
      headers,
      next: { revalidate: 3600 },
    });

    if (res.status === 401 && headers['Authorization']) {
      const publicHeaders = { ...headers };
      delete publicHeaders['Authorization'];
      res = await fetch(contentUrl, {
        headers: publicHeaders,
        next: { revalidate: 3600 },
      });
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const rawContent = await res.text();
    
    // Map extension to language
    const ext = path.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
      go: 'go',
      py: 'python',
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      rs: 'rust',
      cpp: 'cpp',
      c: 'cpp',
      h: 'cpp',
      sh: 'bash',
      json: 'json',
      css: 'css',
      md: 'markdown',
      yaml: 'markdown',
      yml: 'markdown',
    };

    const language = langMap[ext] || 'typescript';

    return NextResponse.json({ content: rawContent, language, isFallback: false });
  } catch (err: any) {
    console.warn(`File content API error, falling back to mock:`, err.message);
    return NextResponse.json({ content: '', language: 'typescript', isFallback: true });
  }
}
