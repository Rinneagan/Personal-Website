'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Globe, 
  Github, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Terminal
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  deployCommand: string;
  buildCommand: string;
  status: 'ready' | 'needs-config' | 'deploying' | 'success' | 'error';
  url?: string;
  config?: {
    domains?: string[];
    envVars?: string[];
    buildOutput?: string;
  };
}

interface DeploymentHelperProps {
  className?: string;
}

export function DeploymentHelper({ className = '' }: DeploymentHelperProps) {
  const [platforms] = useState<Platform[]>([
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Optimized for Next.js with automatic deployments',
      icon: <Rocket className="w-5 h-5" />,
      deployCommand: 'vercel --prod',
      buildCommand: 'npm run build',
      status: 'ready',
      url: 'https://vercel.com',
      config: {
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN']
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'Static site hosting with continuous deployment',
      icon: <Globe className="w-5 h-5" />,
      deployCommand: 'netlify deploy --prod --dir=.next',
      buildCommand: 'npm run build && npm run export',
      status: 'ready',
      url: 'https://netlify.com',
      config: {
        domains: ['your-domain.netlify.app'],
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN']
      }
    },
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free static hosting directly from your repository',
      icon: <Github className="w-5 h-5" />,
      deployCommand: 'npm run build && npm run deploy',
      buildCommand: 'npm run build && npm run export',
      status: 'ready',
      url: 'https://pages.github.com',
      config: {
        domains: ['your-username.github.io'],
        buildOutput: 'out'
      }
    },
    {
      id: 'railway',
      name: 'Railway',
      description: 'Simple deployment with database support',
      icon: <Terminal className="w-5 h-5" />,
      deployCommand: 'railway up',
      buildCommand: 'npm run build',
      status: 'ready',
      url: 'https://railway.app',
      config: {
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN', 'NODE_ENV']
      }
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Modern hosting for web services',
      icon: <ExternalLink className="w-5 h-5" />,
      deployCommand: 'render deploy',
      buildCommand: 'npm run build',
      status: 'ready',
      url: 'https://render.com',
      config: {
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN']
      }
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<Record<string, 'deploying' | 'success' | 'error' | undefined>>({});

  const handleDeploy = async (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    setDeploymentStatus(prev => ({ ...prev, [platformId]: 'deploying' }));
    setSelectedPlatform(platformId);

    try {
      // Simulate deployment process
      console.log(`Starting deployment to ${platform.name}...`);
      console.log(`Build command: ${platform.buildCommand}`);
      console.log(`Deploy command: ${platform.deployCommand}`);

      // In a real implementation, this would execute the actual commands
      await new Promise(resolve => setTimeout(resolve, 3000));

      setDeploymentStatus(prev => ({ ...prev, [platformId]: 'success' }));
      
      setTimeout(() => {
        setDeploymentStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[platformId];
          return newStatus;
        });
      }, 5000);

    } catch (error) {
      console.error(`Deployment to ${platform.name} failed:`, error);
      setDeploymentStatus(prev => ({ ...prev, [platformId]: 'error' }));
      
      setTimeout(() => {
        setDeploymentStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[platformId];
          return newStatus;
        });
      }, 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-config':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'deploying':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Platform['status']) => {
    const variants = {
      ready: 'default',
      'needs-config': 'secondary',
      deploying: 'secondary',
      success: 'default',
      error: 'destructive'
    } as const;

    const labels = {
      ready: 'Ready',
      'needs-config': 'Needs Config',
      deploying: 'Deploying',
      success: 'Success',
      error: 'Error'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deployment Helper
          </CardTitle>
          <CardDescription>
            One-click deployment to popular hosting platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('npm run build')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Build Command
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('npm install')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Install Command
                </Button>
              </div>
            </div>

            {/* Platform Cards */}
            <div className="grid gap-4">
              <h4 className="font-semibold">Deployment Platforms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                        </div>
                        {getStatusBadge(platform.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="mb-4">
                        {platform.description}
                      </CardDescription>
                      
                      {platform.url && (
                        <div className="mb-4">
                          <a 
                            href={platform.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {platform.url}
                          </a>
                        </div>
                      )}

                      {platform.config && (
                        <div className="space-y-2 mb-4">
                          {platform.config.envVars && (
                            <div>
                              <span className="text-sm font-medium">Environment Variables:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {platform.config.envVars.map(envVar => (
                                  <Badge key={envVar} variant="outline" className="text-xs">
                                    {envVar}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {platform.config.domains && (
                            <div>
                              <span className="text-sm font-medium">Custom Domains:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {platform.config.domains.map(domain => (
                                  <Badge key={domain} variant="outline" className="text-xs">
                                    {domain}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Build:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                            {platform.buildCommand}
                          </code>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Deploy:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                            {platform.deployCommand}
                          </code>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleDeploy(platform.id)}
                        disabled={deploymentStatus[platform.id] === 'deploying'}
                      >
                        {deploymentStatus[platform.id] === 'deploying' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Deploying...
                          </>
                        ) : deploymentStatus[platform.id] === 'success' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Deployed!
                          </>
                        ) : deploymentStatus[platform.id] === 'error' ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Try Again
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            Deploy to {platform.name}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Deployment Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                💡 Deployment Tips
              </h4>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• Always test your build locally before deploying</li>
                <li>• Set environment variables in your hosting platform dashboard</li>
                <li>• Use custom domains for professional appearance</li>
                <li>• Enable automatic deployments for seamless updates</li>
                <li>• Monitor deployment logs for troubleshooting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
