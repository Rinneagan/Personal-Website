'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Code, Database, Globe, Shield } from 'lucide-react';

interface ProjectComponent {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'api' | 'auth';
  size: number;
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  description: string;
  technologies: string[];
}

interface ProjectDNAProps {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  projectLanguage?: string | null;
  projectTopics?: string[];
  className?: string;
}

export function ProjectDNA({ 
  projectId, 
  projectName, 
  projectDescription, 
  projectLanguage, 
  projectTopics, 
  className = '' 
}: ProjectDNAProps) {
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateProjectDNA = (): ProjectComponent[] => {
      // Dynamic analysis based on project characteristics
      const components: ProjectComponent[] = [];
      
      // Analyze project name, description, language, and topics for clues
      const projectLower = projectName.toLowerCase();
      const descriptionLower = (projectDescription || '').toLowerCase();
      const languageLower = (projectLanguage || '').toLowerCase();
      const topicsLower = (projectTopics || []).join(' ').toLowerCase();
      
      const allText = `${projectLower} ${descriptionLower} ${languageLower} ${topicsLower}`;
      
      const hasFrontend = allText.includes('web') || allText.includes('ui') || allText.includes('frontend') || allText.includes('react') || allText.includes('vue') || allText.includes('angular') || allText.includes('javascript') || allText.includes('typescript') || allText.includes('css') || allText.includes('html');
      const hasBackend = allText.includes('api') || allText.includes('server') || allText.includes('backend') || allText.includes('node') || allText.includes('express') || allText.includes('python') || allText.includes('django') || allText.includes('flask') || allText.includes('java') || allText.includes('spring');
      const hasDatabase = allText.includes('db') || allText.includes('database') || allText.includes('sql') || allText.includes('mongo') || allText.includes('postgresql') || allText.includes('mysql') || allText.includes('redis');
      const hasAuth = allText.includes('auth') || allText.includes('login') || allText.includes('user') || allText.includes('security') || allText.includes('jwt') || allText.includes('oauth');
      const isMobile = allText.includes('mobile') || allText.includes('app') || allText.includes('ios') || allText.includes('android') || allText.includes('react-native') || allText.includes('flutter');
      const isML = allText.includes('ml') || allText.includes('ai') || allText.includes('machine') || allText.includes('learning') || allText.includes('tensorflow') || allText.includes('pytorch') || allText.includes('scikit');
      const isGame = allText.includes('game') || allText.includes('gaming') || allText.includes('unity') || allText.includes('unreal');
      
      // Generate components dynamically
      if (hasFrontend || !hasBackend) {
        components.push({
          id: 'frontend',
          name: isMobile ? 'Mobile App' : isGame ? 'Game UI' : 'Frontend',
          type: 'frontend',
          size: hasFrontend ? 35 : 25,
          complexity: 'high',
          dependencies: hasBackend ? ['backend'] : [],
          description: isMobile ? 'Mobile application interface and logic' : isGame ? 'Game user interface and graphics' : 'User interface and client-side logic',
          technologies: isMobile ? ['React Native', 'TypeScript', 'Expo'] : isGame ? ['Unity', 'C#', 'WebGL'] : ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
        });
      }
      
      if (hasBackend || hasFrontend) {
        components.push({
          id: 'backend',
          name: isML ? 'ML Pipeline' : 'Backend API',
          type: 'backend',
          size: hasBackend ? 30 : 20,
          complexity: isML ? 'high' : 'high',
          dependencies: ['database'],
          description: isML ? 'Machine learning pipeline and model serving' : 'Server-side API and business logic',
          technologies: isML ? ['Python', 'TensorFlow', 'FastAPI', 'Scikit-learn'] : ['Node.js', 'Express', 'REST API', 'GraphQL']
        });
      }
      
      if (hasDatabase || hasBackend || hasAuth) {
        components.push({
          id: 'database',
          name: isML ? 'Data Lake' : 'Database',
          type: 'database',
          size: hasDatabase ? 25 : 15,
          complexity: isML ? 'high' : 'medium',
          dependencies: [],
          description: isML ? 'Data storage and processing for ML models' : 'Data storage and management',
          technologies: isML ? ['MongoDB', 'Apache Spark', 'MinIO'] : ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma']
        });
      }
      
      if (hasAuth || hasBackend) {
        components.push({
          id: 'auth',
          name: 'Authentication',
          type: 'auth',
          size: 10,
          complexity: 'medium',
          dependencies: ['database'],
          description: 'User authentication and authorization',
          technologies: ['JWT', 'OAuth 2.0', 'Passport.js', 'bcrypt']
        });
      }
      
      // Add specialized components based on project type
      if (isML) {
        components.push({
          id: 'training',
          name: 'Model Training',
          type: 'backend',
          size: 15,
          complexity: 'high',
          dependencies: ['database'],
          description: 'Machine learning model training and optimization',
          technologies: ['Jupyter', 'PyTorch', 'MLflow', 'Docker']
        });
      }
      
      if (isGame) {
        components.push({
          id: 'gameengine',
          name: 'Game Engine',
          type: 'backend',
          size: 20,
          complexity: 'high',
          dependencies: ['frontend'],
          description: 'Game physics, rendering, and core mechanics',
          technologies: ['Unity', 'C#', 'PhysX', 'OpenGL']
        });
      }
      
      if (isMobile) {
        components.push({
          id: 'storage',
          name: 'Local Storage',
          type: 'database',
          size: 8,
          complexity: 'low',
          dependencies: [],
          description: 'Mobile device storage and caching',
          technologies: ['SQLite', 'AsyncStorage', 'Realm']
        });
      }
      
      // Add testing component for most projects
      if (components.length > 1) {
        components.push({
          id: 'testing',
          name: 'Testing Suite',
          type: 'api',
          size: 5,
          complexity: 'medium',
          dependencies: components.map(c => c.id).filter(id => id !== 'testing'),
          description: 'Unit and integration tests',
          technologies: ['Jest', 'Cypress', 'Testing Library', 'Coverage']
        });
      }
      
      // Add deployment component
      components.push({
        id: 'deployment',
        name: 'Deployment',
        type: 'api',
        size: 3,
        complexity: 'medium',
        dependencies: components.map(c => c.id).filter(id => id !== 'deployment'),
        description: 'CI/CD and deployment configuration',
        technologies: ['Docker', 'GitHub Actions', 'Vercel', 'AWS']
      });
      
      // Normalize sizes to sum to 100
      const totalSize = components.reduce((sum, c) => sum + c.size, 0);
      if (totalSize !== 100 && totalSize > 0) {
        const scale = 100 / totalSize;
        components.forEach(c => {
          c.size = Math.round(c.size * scale);
        });
      }
      
      return components;
    };

    setTimeout(() => {
      setComponents(generateProjectDNA());
      setIsLoading(false);
    }, 1000);
  }, [projectId, projectName, projectDescription, projectLanguage, projectTopics]);

  const getComponentIcon = (type: ProjectComponent['type']) => {
    const icons = {
      frontend: Globe,
      backend: Code,
      database: Database,
      api: Code,
      auth: Shield
    };
    return icons[type] || Code;
  };

  const getComplexityColor = (complexity: ProjectComponent['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Project DNA Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing project structure...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Project DNA Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={component.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {React.createElement(getComponentIcon(component.type), {
                    className: 'w-5 h-5'
                  })}
                  <span className="font-medium">{component.name}</span>
                </div>
                <Badge variant="outline">{component.size}%</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${component.size}%` }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getComplexityColor(component.complexity)}`} />
                <span className="text-xs capitalize">{component.complexity} complexity</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {component.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{components.length}</div>
            <div className="text-xs text-muted-foreground">Components</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {components.filter(c => c.complexity === 'low').length}
            </div>
            <div className="text-xs text-muted-foreground">Simple</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {components.filter(c => c.complexity === 'medium').length}
            </div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {components.filter(c => c.complexity === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">Complex</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
