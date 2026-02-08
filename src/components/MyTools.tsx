'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisitorMap } from '@/components/VisitorMap';
import { DeploymentHelper } from '@/components/DeploymentHelper';
import { 
  Settings, 
  Map, 
  Rocket, 
  BarChart3,
  Globe,
  Users,
  Eye,
  Zap,
  Clock,
  Target
} from 'lucide-react';

interface MyToolsProps {
  className?: string;
}

export function MyTools({ className = '' }: MyToolsProps) {
  const [activeTab, setActiveTab] = useState<'visitor-map' | 'deployment'>('visitor-map');

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            My Tools
          </CardTitle>
          <CardDescription>
            Analytics and deployment utilities for your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6">
              <Button
                variant={activeTab === 'visitor-map' ? 'default' : 'outline'}
                onClick={() => setActiveTab('visitor-map')}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Visitor Map
              </Button>
              <Button
                variant={activeTab === 'deployment' ? 'default' : 'outline'}
                onClick={() => setActiveTab('deployment')}
                className="flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Deployment
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === 'visitor-map' ? (
              <VisitorMap />
            ) : (
              <DeploymentHelper />
            )}
          </div>

          {/* Tools Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                Visitor Analytics
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time visitor tracking with interactive world map
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Live Visitors</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Geolocation</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Page Tracking</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-green-600" />
                Quick Deployment
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                One-click deployment to multiple platforms
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Vercel</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Netlify</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>GitHub Pages</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Performance Metrics
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Track engagement and user behavior
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Page Views</span>
                  <Badge variant="secondary">Tracked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Duration</span>
                  <Badge variant="secondary">Tracked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bounce Rate</span>
                  <Badge variant="secondary">Tracked</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 mt-6">
            <h4 className="font-semibold mb-4 text-center">Quick Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-muted-foreground">Total Visitors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">4:32</div>
                <div className="text-sm text-muted-foreground">Avg. Session</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">23.5%</div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
