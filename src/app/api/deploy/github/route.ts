import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, owner, repo } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      );
    }

    const ownerName = owner || 'Rinneagan';
    const repoName = repo || 'personal-website';

    console.log('Setting up GitHub Pages for:', `${ownerName}/${repoName}`);

    // Get repository info
    const repoResponse = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      console.error('GitHub repository error:', errorText);
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: repoResponse.status }
      );
    }

    const repoData = await repoResponse.json();
    console.log('Found repository:', repoData.full_name);

    // Enable GitHub Pages
    console.log('Enabling GitHub Pages...');
    const pagesResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          type: 'branch',
          branch: 'gh-pages'
        }
      })
    });

    let pagesData;
    if (pagesResponse.status === 409) {
      console.log('GitHub Pages already enabled');
      // Get existing pages info
      const existingPagesResponse = await fetch(`https://api.github.com/repos/${repoData.full_name}/pages`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (existingPagesResponse.ok) {
        pagesData = await existingPagesResponse.json();
      }
    } else if (!pagesResponse.ok) {
      const errorText = await pagesResponse.text();
      console.error('GitHub Pages error:', errorText);
      return NextResponse.json(
        { error: `GitHub Pages error: ${errorText}` },
        { status: pagesResponse.status }
      );
    } else {
      pagesData = await pagesResponse.json();
      console.log('GitHub Pages enabled successfully');
    }

    // Construct the GitHub Pages URL
    const pagesUrl = repoData.pages?.html_url || `https://${repoData.owner.login.toLowerCase()}.github.io/${repoData.name}`;
    
    return NextResponse.json({
      success: true,
      deploymentUrl: pagesUrl,
      status: 'ready',
      repository: repoData.full_name
    });

  } catch (error) {
    console.error('GitHub Pages deployment error:', error);
    return NextResponse.json(
      { error: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
