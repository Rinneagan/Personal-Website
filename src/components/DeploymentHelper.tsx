'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Rocket, 
  Globe, 
  Github, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Terminal,
  Key,
  Settings,
  Loader2
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
    apiToken?: string;
    siteId?: string;
    teamId?: string;
  };
}

interface DeploymentHelperProps {
  className?: string;
}

export function DeploymentHelper({ className = '' }: DeploymentHelperProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Optimized for Next.js with automatic deployments',
      icon: <Rocket className="w-5 h-5" />,
      deployCommand: 'vercel --prod',
      buildCommand: 'npm run build',
      status: 'needs-config',
      url: 'https://vercel.com',
      config: {
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN', 'VERCEL_TOKEN'],
        apiToken: '',
        teamId: ''
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'Static site hosting with continuous deployment',
      icon: <Globe className="w-5 h-5" />,
      deployCommand: 'netlify deploy --prod --dir=.next',
      buildCommand: 'npm run build && npm run export',
      status: 'needs-config',
      url: 'https://netlify.com',
      config: {
        domains: ['your-domain.netlify.app'],
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN', 'NETLIFY_TOKEN'],
        apiToken: '',
        siteId: ''
      }
    },
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free static hosting directly from your repository',
      icon: <Github className="w-5 h-5" />,
      deployCommand: 'npm run build && npm run deploy',
      buildCommand: 'npm run build && npm run export',
      status: 'needs-config',
      url: 'https://pages.github.com',
      config: {
        domains: ['your-username.github.io'],
        envVars: ['NEXT_PUBLIC_GITHUB_TOKEN', 'GITHUB_TOKEN'],
        buildOutput: 'out',
        apiToken: ''
      }
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<Record<string, 'deploying' | 'success' | 'error' | undefined>>({});
  const [deploymentLogs, setDeploymentLogs] = useState<Record<string, string[]>>({});
  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, any>>({});

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('deployment-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfigForm(parsed);
        // Update platforms with saved tokens
        setPlatforms(prev => prev.map(platform => ({
          ...platform,
          config: {
            ...platform.config,
            apiToken: parsed[`${platform.id}_apiToken`] || '',
            siteId: parsed[`${platform.id}_siteId`] || '',
            teamId: parsed[`${platform.id}_teamId`] || ''
          }
        })));
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  const saveConfig = (platformId: string, config: any) => {
    const newConfig = { ...configForm, ...config };
    setConfigForm(newConfig);
    localStorage.setItem('deployment-config', JSON.stringify(newConfig));
    
    // Update platform with new config
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { 
            ...platform, 
            config: { 
              ...platform.config, 
              apiToken: config[`${platformId}_apiToken`] || '',
              siteId: config[`${platformId}_siteId`] || '',
              teamId: config[`${platformId}_teamId`] || ''
            },
            status: config[`${platformId}_apiToken`] ? 'ready' : 'needs-config'
          }
        : platform
    ));
  };

  const addLog = (platformId: string, message: string) => {
    setDeploymentLogs(prev => ({
      ...prev,
      [platformId]: [...(prev[platformId] || []), `[${new Date().toLocaleTimeString()}] ${message}`]
    }));
  };

  const deployToVercel = async (platform: Platform) => {
    const token = platform.config?.apiToken;
    if (!token) {
      throw new Error('Vercel API token is required');
    }

    addLog(platform.id, 'Starting Vercel deployment...');
    
    try {
      // Create deployment
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'personal-website',
          framework: 'nextjs',
          buildCommand: platform.buildCommand,
          outputDirectory: '.next',
          rootDirectory: '.',
          gitSource: {
            type: 'github',
            repo: 'Rinneagan/personal-website',
            ref: 'main'
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Vercel API error: ${error}`);
      }

      const deployment = await response.json();
      addLog(platform.id, `Deployment created: ${deployment.url}`);
      
      // Wait for deployment to complete
      let status = 'BUILDING';
      while (status === 'BUILDING' || status === 'INITIALIZING') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deployment.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const deploymentStatus = await statusResponse.json();
        status = deploymentStatus.readyState;
        addLog(platform.id, `Status: ${status}`);
      }

      if (status === 'READY') {
        addLog(platform.id, `✅ Deployment successful: ${deployment.url}`);
        return deployment.url;
      } else {
        throw new Error(`Deployment failed with status: ${status}`);
      }
    } catch (error) {
      addLog(platform.id, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const deployToNetlify = async (platform: Platform) => {
    const token = platform.config?.apiToken;
    const siteId = platform.config?.siteId;
    
    if (!token) {
      throw new Error('Netlify API token is required');
    }

    addLog(platform.id, 'Starting Netlify deployment...');
    
    try {
      // Create or get site
      let site;
      if (siteId) {
        const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        site = await siteResponse.json();
      } else {
        // Create new site
        const createResponse = await fetch('https://api.netlify.com/api/v1/sites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'personal-website'
          })
        });
        site = await createResponse.json();
        addLog(platform.id, `Created site: ${site.url}`);
      }

      // Trigger deployment
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
        const error = await deployResponse.text();
        throw new Error(`Netlify API error: ${error}`);
      }

      const deploy = await deployResponse.json();
      addLog(platform.id, `Deployment started: ${deploy.deploy_url}`);
      
      // Wait for deployment to complete
      let status = 'new';
      while (status === 'new' || status === 'uploading' || status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const deployStatus = await statusResponse.json();
        status = deployStatus.state;
        addLog(platform.id, `Status: ${status}`);
      }

      if (status === 'ready') {
        addLog(platform.id, `✅ Deployment successful: ${site.url}`);
        return site.url;
      } else {
        throw new Error(`Deployment failed with status: ${status}`);
      }
    } catch (error) {
      addLog(platform.id, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const deployToGitHubPages = async (platform: Platform) => {
    const token = platform.config?.apiToken;
    if (!token) {
      throw new Error('GitHub token is required');
    }

    addLog(platform.id, 'Starting GitHub Pages deployment...');
    
    try {
      // Get repository info
      const repoResponse = await fetch('https://api.github.com/repos/Rinneagan/personal-website', {
        headers: {
          'Authorization': `token ${token}`,
        }
      });

      if (!repoResponse.ok) {
        throw new Error('Repository not found or access denied');
      }

      const repo = await repoResponse.json();
      addLog(platform.id, `Found repository: ${repo.full_name}`);

      // Create GitHub Pages deployment
      const pagesResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pages`, {
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

      if (pagesResponse.status === 409) {
        addLog(platform.id, 'GitHub Pages already enabled');
      } else if (!pagesResponse.ok) {
        const error = await pagesResponse.text();
        throw new Error(`GitHub Pages error: ${error}`);
      } else {
        addLog(platform.id, 'GitHub Pages enabled');
      }

      const pagesUrl = `https://${repo.owner.login.toLowerCase()}.github.io/${repo.name}`;
      addLog(platform.id, `✅ GitHub Pages ready: ${pagesUrl}`);
      return pagesUrl;
    } catch (error) {
      addLog(platform.id, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleDeploy = async (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    setDeploymentStatus(prev => ({ ...prev, [platformId]: 'deploying' }));
    setSelectedPlatform(platformId);
    setDeploymentLogs(prev => ({ ...prev, [platformId]: [] }));

    try {
      let deployUrl: string;
      
      switch (platformId) {
        case 'vercel':
          deployUrl = await deployToVercel(platform);
          break;
        case 'netlify':
          deployUrl = await deployToNetlify(platform);
          break;
        case 'github-pages':
          deployUrl = await deployToGitHubPages(platform);
          break;
        default:
          throw new Error('Unsupported platform');
      }

      setDeploymentStatus(prev => ({ ...prev, [platformId]: 'success' }));
      
      setTimeout(() => {
        setDeploymentStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[platformId];
          return newStatus;
        });
      }, 5000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Deployment to ${platform.name} failed:`, error);
      addLog(platformId, `❌ Deployment failed: ${errorMessage}`);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1"
                          onClick={() => handleDeploy(platform.id)}
                          disabled={deploymentStatus[platform.id] === 'deploying'}
                        >
                          {deploymentStatus[platform.id] === 'deploying' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                              Deploy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => setShowConfig(showConfig === platform.id ? null : platform.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Configuration Panel */}
                      {showConfig === platform.id && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                          <h5 className="font-medium flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Configuration
                          </h5>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`${platform.id}-token`} className="text-sm font-medium">
                                API Token
                              </Label>
                              <Input
                                id={`${platform.id}-token`}
                                type="password"
                                placeholder={`Enter ${platform.name} API token`}
                                value={configForm[`${platform.id}_apiToken`] || ''}
                                onChange={(e) => {
                                  const newConfig = { ...configForm, [`${platform.id}_apiToken`]: e.target.value };
                                  setConfigForm(newConfig);
                                }}
                                className="mt-1"
                              />
                            </div>
                            {platform.id === 'netlify' && (
                              <div>
                                <Label htmlFor={`${platform.id}-siteId`} className="text-sm font-medium">
                                  Site ID (optional)
                                </Label>
                                <Input
                                  id={`${platform.id}-siteId`}
                                  type="text"
                                  placeholder="Enter Netlify site ID"
                                  value={configForm[`${platform.id}_siteId`] || ''}
                                  onChange={(e) => {
                                    const newConfig = { ...configForm, [`${platform.id}_siteId`]: e.target.value };
                                    setConfigForm(newConfig);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            )}
                            <Button 
                              size="sm" 
                              onClick={() => saveConfig(platform.id, configForm)}
                              className="w-full"
                            >
                              Save Configuration
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Deployment Logs */}
                      {deploymentLogs[platform.id] && deploymentLogs[platform.id].length > 0 && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Deployment Logs
                          </h5>
                          <div className="bg-black/50 text-green-400 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                            {deploymentLogs[platform.id].map((log, index) => (
                              <div key={index} className="mb-1">{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Deployment Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                💡 Deployment Setup
              </h4>
              <div className="space-y-4 text-sm text-blue-700 dark:text-blue-300">
                <div>
                  <h5 className="font-medium mb-2">Getting API Tokens:</h5>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Vercel:</strong> Visit <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="underline">Account Settings → Tokens</a></li>
                    <li>• <strong>Netlify:</strong> Visit <a href="https://app.netlify.com/user/applications" target="_blank" rel="noopener noreferrer" className="underline">User Settings → Applications</a></li>
                    <li>• <strong>GitHub:</strong> Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">Developer Settings → Personal Access Tokens</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Best Practices:</h5>
                  <ul className="space-y-1 ml-4">
                    <li>• Store API tokens securely and never commit them to git</li>
                    <li>• Test your build locally before deploying</li>
                    <li>• Use custom domains for professional appearance</li>
                    <li>• Enable automatic deployments for seamless updates</li>
                    <li>• Monitor deployment logs for troubleshooting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
