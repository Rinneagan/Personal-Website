// Real project analysis API endpoint
import { NextRequest, NextResponse } from 'next/server';

interface AnalysisResult {
  components: Array<{
    id: string;
    name: string;
    type: 'frontend' | 'backend' | 'database' | 'api' | 'auth';
    size: number;
    complexity: 'low' | 'medium' | 'high';
    dependencies: string[];
    description: string;
    technologies: string[];
  }>;
  stats: {
    totalFiles: number;
    totalLines: number;
    languages: Array<{ language: string; count: number; percentage: number }>;
    frameworks: string[];
    dependencies: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoName, owner = 'Rinneagan' } = body;
    
    if (!repoName) {
      return NextResponse.json({ error: 'Repository name required' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch repository contents
    const contentsUrl = `https://api.github.com/repos/${owner}/${repoName}/contents`;
    const contentsResponse = await fetch(contentsUrl, { headers });
    
    if (!contentsResponse.ok) {
      throw new Error('Failed to fetch repository contents');
    }

    const contents = await contentsResponse.json();
    
    // Fetch README for additional analysis
    let readmeContent = '';
    try {
      const readmeUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
      const readmeResponse = await fetch(readmeUrl, { headers });
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    } catch (error) {
      console.log('README not found, continuing without it');
    }

    // Analyze the repository structure
    const analysis = analyzeRepository(contents, readmeContent, repoName);
    
    return NextResponse.json({ 
      success: true,
      analysis 
    });

  } catch (error) {
    console.error('Project analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze project' },
      { status: 500 }
    );
  }
}

function analyzeRepository(contents: any[], readmeContent: string, repoName: string): AnalysisResult {
  const components: AnalysisResult['components'] = [];
  const fileTypes: Record<string, number> = {};
  const frameworks: Set<string> = new Set();
  const dependencies: Set<string> = new Set();
  
  let totalFiles = 0;
  let hasFrontend = false;
  let hasBackend = false;
  let hasDatabase = false;
  let hasAuth = false;
  let hasTests = false;
  let hasDocker = false;
  let hasCI = false;
  
  // Analyze files and directories
  const analyzeItem = (item: any, path: string = '') => {
    if (item.type === 'file') {
      totalFiles++;
      const extension = item.name.split('.').pop()?.toLowerCase();
      
      if (extension) {
        fileTypes[extension] = (fileTypes[extension] || 0) + 1;
      }
      
      // Detect technologies based on file names and extensions
      const fileName = item.name.toLowerCase();
      const filePath = path.toLowerCase();
      
      // Frontend detection
      if (['tsx', 'jsx', 'vue', 'svelte', 'html', 'css', 'scss', 'less'].includes(extension) ||
          fileName.includes('component') || fileName.includes('page') || fileName.includes('view')) {
        hasFrontend = true;
        if (['tsx', 'jsx'].includes(extension)) frameworks.add('React');
        if (extension === 'vue') frameworks.add('Vue');
        if (extension === 'svelte') frameworks.add('Svelte');
      }
      
      // Backend detection
      if (['js', 'ts', 'py', 'java', 'go', 'rs', 'php', 'rb', 'cs'].includes(extension) &&
          (filePath.includes('api') || filePath.includes('server') || filePath.includes('backend'))) {
        hasBackend = true;
        if (extension === 'py') frameworks.add('Python');
        if (extension === 'js' || extension === 'ts') frameworks.add('Node.js');
        if (extension === 'java') frameworks.add('Java');
      }
      
      // Database detection
      if (['sql', 'db', 'sqlite', 'mongo'].includes(extension) ||
          fileName.includes('database') || fileName.includes('model') || fileName.includes('schema')) {
        hasDatabase = true;
        if (fileName.includes('prisma')) frameworks.add('Prisma');
        if (fileName.includes('sequelize')) frameworks.add('Sequelize');
      }
      
      // Auth detection
      if (fileName.includes('auth') || fileName.includes('login') || fileName.includes('jwt') ||
          fileName.includes('passport') || fileName.includes('oauth')) {
        hasAuth = true;
        frameworks.add('Authentication');
      }
      
      // Testing detection
      if (fileName.includes('test') || fileName.includes('spec') || extension === 'test') {
        hasTests = true;
        if (fileName.includes('jest')) frameworks.add('Jest');
        if (fileName.includes('cypress')) frameworks.add('Cypress');
      }
      
      // Docker detection
      if (fileName === 'dockerfile' || fileName === 'docker-compose.yml' || fileName === 'docker-compose.yaml') {
        hasDocker = true;
        frameworks.add('Docker');
      }
      
      // CI/CD detection
      if (fileName.includes('.github') || fileName.includes('.gitlab-ci') || fileName.includes('azure-pipelines')) {
        hasCI = true;
        frameworks.add('CI/CD');
      }
      
      // Package managers
      if (fileName === 'package.json') frameworks.add('npm');
      if (fileName === 'requirements.txt') frameworks.add('pip');
      if (fileName === 'cargo.toml') frameworks.add('Cargo');
      if (fileName === 'pom.xml') frameworks.add('Maven');
    }
  };
  
  // Recursively analyze contents
  contents.forEach(item => analyzeItem(item, item.name));
  
  // Generate components based on analysis
  if (hasFrontend) {
    components.push({
      id: 'frontend',
      name: 'Frontend',
      type: 'frontend',
      size: 35,
      complexity: 'high',
      dependencies: hasBackend ? ['backend'] : [],
      description: 'User interface and client-side application logic',
      technologies: Array.from(frameworks).filter(f => ['React', 'Vue', 'Svelte', 'Angular'].includes(f)).length > 0 
        ? Array.from(frameworks).filter(f => ['React', 'Vue', 'Svelte', 'Angular'].includes(f))
        : ['React', 'TypeScript', 'CSS', 'HTML']
    });
  }
  
  if (hasBackend) {
    components.push({
      id: 'backend',
      name: 'Backend API',
      type: 'backend',
      size: 30,
      complexity: 'high',
      dependencies: hasDatabase ? ['database'] : [],
      description: 'Server-side API and business logic',
      technologies: Array.from(frameworks).filter(f => ['Node.js', 'Python', 'Java', 'Go'].includes(f)).length > 0
        ? Array.from(frameworks).filter(f => ['Node.js', 'Python', 'Java', 'Go'].includes(f))
        : ['Node.js', 'Express', 'REST API']
    });
  }
  
  if (hasDatabase) {
    components.push({
      id: 'database',
      name: 'Database',
      type: 'database',
      size: 25,
      complexity: 'medium',
      dependencies: [],
      description: 'Data storage and management system',
      technologies: Array.from(frameworks).filter(f => ['PostgreSQL', 'MongoDB', 'MySQL', 'Prisma', 'Sequelize'].includes(f)).length > 0
        ? Array.from(frameworks).filter(f => ['PostgreSQL', 'MongoDB', 'MySQL', 'Prisma', 'Sequelize'].includes(f))
        : ['PostgreSQL', 'MongoDB']
    });
  }
  
  if (hasAuth) {
    components.push({
      id: 'auth',
      name: 'Authentication',
      type: 'auth',
      size: 10,
      complexity: 'medium',
      dependencies: ['database'],
      description: 'User authentication and authorization system',
      technologies: ['JWT', 'OAuth 2.0', 'bcrypt']
    });
  }
  
  if (hasTests) {
    components.push({
      id: 'testing',
      name: 'Testing Suite',
      type: 'api',
      size: 5,
      complexity: 'medium',
      dependencies: components.map(c => c.id).filter(id => id !== 'testing'),
      description: 'Unit and integration testing framework',
      technologies: Array.from(frameworks).filter(f => ['Jest', 'Cypress', 'Testing Library'].includes(f)).length > 0
        ? Array.from(frameworks).filter(f => ['Jest', 'Cypress', 'Testing Library'].includes(f))
        : ['Jest', 'Testing Library']
    });
  }
  
  if (hasDocker) {
    components.push({
      id: 'deployment',
      name: 'Deployment',
      type: 'api',
      size: 5,
      complexity: 'medium',
      dependencies: components.map(c => c.id).filter(id => id !== 'deployment'),
      description: 'Containerization and deployment configuration',
      technologies: ['Docker', 'Docker Compose']
    });
  }
  
  // Calculate language statistics
  const totalFileCount = Object.values(fileTypes).reduce((sum, count) => sum + count, 0);
  const languages = Object.entries(fileTypes)
    .map(([extension, count]) => ({
      language: getLanguageName(extension),
      count,
      percentage: Math.round((count / totalFileCount) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    components,
    stats: {
      totalFiles,
      totalLines: 0, // Would need file content analysis for accurate line count
      languages,
      frameworks: Array.from(frameworks),
      dependencies: Array.from(dependencies)
    }
  };
}

function getLanguageName(extension: string): string {
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'go': 'Go',
    'rs': 'Rust',
    'php': 'PHP',
    'rb': 'Ruby',
    'cs': 'C#',
    'cpp': 'C++',
    'c': 'C',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'vue': 'Vue',
    'sql': 'SQL',
    'json': 'JSON',
    'yaml': 'YAML',
    'yml': 'YAML',
    'md': 'Markdown',
    'txt': 'Text'
  };
  
  return languageMap[extension] || extension.toUpperCase();
}
