import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, siteId, siteName } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Netlify API token is required' },
        { status: 400 }
      );
    }

    let site;
    
    // Create or get site
    if (siteId) {
      console.log('Getting existing Netlify site:', siteId);
      const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!siteResponse.ok) {
        return NextResponse.json(
          { error: 'Site not found or access denied' },
          { status: 404 }
        );
      }
      
      site = await siteResponse.json();
    } else {
      console.log('Creating new Netlify site...');
      // Create new site
      const createResponse = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: siteName || 'personal-website'
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Netlify site creation error:', errorText);
        return NextResponse.json(
          { error: `Netlify site creation error: ${errorText}` },
          { status: createResponse.status }
        );
      }

      site = await createResponse.json();
      console.log('Site created:', site.url);
    }

    // Trigger deployment
    console.log('Starting deployment...');
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dir: '.next',
        branch: 'main'
      })
    });

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      console.error('Netlify deploy error:', errorText);
      return NextResponse.json(
        { error: `Netlify deploy error: ${errorText}` },
        { status: deployResponse.status }
      );
    }

    const deploy = await deployResponse.json();
    console.log('Deployment started:', deploy.deploy_url);

    // Poll for deployment completion
    let status = 'new';
    let attempts = 0;
    const maxAttempts = 30;

    while ((status === 'new' || status === 'uploading' || status === 'processing') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const statusResponse = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (statusResponse.ok) {
        const deployStatus = await statusResponse.json();
        status = deployStatus.state;
        console.log(`Deployment status: ${status}`);
      } else {
        console.error('Failed to get deployment status');
        break;
      }
      
      attempts++;
    }

    if (status === 'ready') {
      return NextResponse.json({
        success: true,
        deploymentUrl: site.url,
        status: 'ready'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Deployment failed with status: ${status}`,
        status
      });
    }

  } catch (error) {
    console.error('Netlify deployment error:', error);
    return NextResponse.json(
      { error: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
