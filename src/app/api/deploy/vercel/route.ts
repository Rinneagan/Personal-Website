import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, projectName } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Vercel API token is required' },
        { status: 400 }
      );
    }

    // First, get the project/repo information
    console.log('Getting Vercel project info...');
    
    // Try to get existing project or create a new one
    let project;
    
    // List existing projects to see if one already exists
    const projectsResponse = await fetch('https://api.vercel.com/v9/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      project = projects.projects?.find((p: any) => p.name === (projectName || 'personal-website'));
    }

    if (!project) {
      console.log('Creating new Vercel project...');
      // Create a new project without gitSource initially
      const createProjectResponse = await fetch('https://api.vercel.com/v10/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName || 'personal-website',
          framework: 'nextjs',
          buildCommand: 'npm run build',
          outputDirectory: '.next',
          rootDirectory: '',
          installCommand: 'npm install',
          devCommand: 'npm run dev'
        })
      });

      if (!createProjectResponse.ok) {
        const errorText = await createProjectResponse.text();
        console.error('Vercel project creation error:', errorText);
        return NextResponse.json(
          { error: `Vercel project creation error: ${errorText}` },
          { status: createProjectResponse.status }
        );
      }

      project = await createProjectResponse.json();
      console.log('Project created:', project);
    } else {
      console.log('Using existing project:', project.name);
    }

    // Create deployment for the project
    console.log('Creating deployment...');
    const deploymentData = {
      name: project.name,
      project: project.id,
      framework: 'nextjs',
      buildCommand: 'npm run build',
      outputDirectory: '.next',
      rootDirectory: '',
      target: 'production'
    };

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vercel deployment error:', errorText);
      return NextResponse.json(
        { error: `Vercel deployment error: ${errorText}` },
        { status: response.status }
      );
    }

    const deployment = await response.json();
    console.log('Deployment created:', deployment);

    // Start polling for deployment status
    const deploymentId = deployment.id;
    let status = 'BUILDING';
    let attempts = 0;
    const maxAttempts = 30; // 2 minutes with 4-second intervals

    while ((status === 'BUILDING' || status === 'INITIALIZING') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (statusResponse.ok) {
        const deploymentStatus = await statusResponse.json();
        status = deploymentStatus.readyState;
        console.log(`Deployment status: ${status}`);
      } else {
        console.error('Failed to get deployment status');
        break;
      }
      
      attempts++;
    }

    if (status === 'READY') {
      return NextResponse.json({
        success: true,
        deploymentUrl: deployment.url,
        status: 'READY'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Deployment failed with status: ${status}`,
        status
      });
    }

  } catch (error) {
    console.error('Vercel deployment error:', error);
    return NextResponse.json(
      { error: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
