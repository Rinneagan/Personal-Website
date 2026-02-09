'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Globe, 
  Users, 
  Eye, 
  TrendingUp, 
  Activity,
  Clock,
  Settings,
  RefreshCw,
  Maximize2,
  Navigation
} from 'lucide-react';

interface Visitor {
  id: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  timestamp: string;
  page: string;
  duration: number;
  referrer?: string;
  userAgent?: string;
}

interface VisitorMapProps {
  className?: string;
}

export function VisitorMap({ className = '' }: VisitorMapProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to New York
  const [mapZoom, setMapZoom] = useState(2);

  // Generate visitor data function
  const generateVisitorData = () => {
    const cities = [
      { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
      { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
      { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
      { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
      { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
      { name: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
      { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
      { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 }
    ];

    const pages = ['/portfolio', '/projects', '/about', '/contact', '/blog'];
    const referrers = ['google.com', 'github.com', 'linkedin.com', 'twitter.com', 'direct'];

    const newVisitors: Visitor[] = [];
    const visitorCount = Math.floor(Math.random() * 50) + 20; // 20-70 visitors

    for (let i = 0; i < visitorCount; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const page = pages[Math.floor(Math.random() * pages.length)];
      const referrer = referrers[Math.floor(Math.random() * referrers.length)];
      
      newVisitors.push({
        id: `visitor-${Date.now()}-${i}`,
        location: {
          city: city.name,
          country: city.country,
          coordinates: { lat: city.lat, lng: city.lng }
        },
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
        page,
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        referrer: Math.random() > 0.5 ? referrer : undefined,
        userAgent: `Mozilla/5.0 (${['Windows', 'MacOS', 'Linux'][Math.floor(Math.random() * 3)]})`
      });
    }

    return newVisitors;
  };

  // Simulate real-time visitor data
  useEffect(() => {

    // Initial load
    const initialVisitors = generateVisitorData();
    setVisitors(initialVisitors);
    setTotalVisitors(initialVisitors.length);
    setActiveVisitors(Math.floor(Math.random() * 5) + 1);
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setVisitors(prev => {
        // Add new visitor occasionally
        if (Math.random() > 0.7) {
          const cities = [
            { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
            { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
            { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 }
          ];
          
          const city = cities[Math.floor(Math.random() * cities.length)];
          const pages = ['/portfolio', '/projects', '/about', '/contact'];
          
          const newVisitor: Visitor = {
            id: `visitor-${Date.now()}`,
            location: {
              city: city.name,
              country: city.country,
              coordinates: { lat: city.lat, lng: city.lng }
            },
            timestamp: new Date().toISOString(),
            page: pages[Math.floor(Math.random() * pages.length)],
            duration: Math.floor(Math.random() * 200) + 60,
            referrer: Math.random() > 0.5 ? 'google.com' : undefined
          };
          
          return [...prev.slice(-50), newVisitor]; // Keep last 50 visitors
        }
        return prev;
      });
      
      setTotalVisitors(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setActiveVisitors(Math.floor(Math.random() * 8) + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getFilteredVisitors = () => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,      // 1 hour in ms
      '24h': 24 * 60 * 60 * 1000, // 24 hours in ms
      '7d': 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      '30d': 30 * 24 * 60 * 60 * 1000 // 30 days in ms
    };

    const cutoffTime = new Date(now.getTime() - timeRanges[selectedTimeRange]);
    
    return visitors.filter(visitor => 
      new Date(visitor.timestamp) >= cutoffTime
    );
  };

  const getTopCountries = () => {
    const countryCounts = visitors.reduce((acc, visitor) => {
      const country = visitor.location.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
  };

  const getTopPages = () => {
    const pageCounts = visitors.reduce((acc, visitor) => {
      const page = visitor.page;
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));
  };

  const filteredVisitors = getFilteredVisitors();
  const topCountries = getTopCountries();
  const topPages = getTopPages();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Real-time Visitor Map
          </CardTitle>
          <CardDescription>
            Live world map showing visitors to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{totalVisitors}</div>
                    <div className="text-sm text-muted-foreground">Total Visitors</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{activeVisitors}</div>
                    <div className="text-sm text-muted-foreground">Active Now</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{filteredVisitors.length}</div>
                    <div className="text-sm text-muted-foreground">Last {selectedTimeRange}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{visitors.length > 0 ? Math.round((filteredVisitors.length / visitors.length) * 100) : 0}%</div>
                    <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium">Time Range:</span>
              <div className="flex gap-2">
                {(['1h', '24h', '7d', '30d'] as const).map(range => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVisitors(generateVisitorData());
                  setTotalVisitors(prev => prev + Math.floor(Math.random() * 10) + 5);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>

            {/* Map Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Map */}
              <div className="lg:col-span-2">
                <div className="bg-muted/30 rounded-lg p-4 h-96 relative overflow-hidden">
                  <div className="absolute inset-0">
                    {/* Simulated world map with visitor dots */}
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                      {/* Map decoration */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="grid grid-cols-8 grid-rows-4 w-full h-full">
                          {Array.from({ length: 32 }).map((_, i) => (
                            <div
                              key={i}
                              className={`border border-border/20 ${
                                i % 8 === 0 || i % 8 === 7 ? 'border-l-2 border-r-2' : ''
                              } ${i % 8 < 4 ? 'border-b-2' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Visitor dots on map */}
                      {filteredVisitors.slice(0, 20).map((visitor, index) => {
                        const x = ((visitor.location.coordinates.lng + 180) / 360) * 100; // Convert to 0-100 percentage
                        const y = ((90 - visitor.location.coordinates.lat) / 180) * 100; // Convert to 0-100 percentage
                        const size = Math.random() * 8 + 4; // 4-12px size
                        
                        return (
                          <div
                            key={visitor.id}
                            className="absolute w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-150 transition-transform"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: `${size}px`,
                              height: `${size}px`,
                              animationDelay: `${index * 0.1}s`
                            }}
                            title={`${visitor.location.city}, ${visitor.location.country} - ${new Date(visitor.timestamp).toLocaleString()}`}
                          >
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>Live Visitor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Recent Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Returning Visitor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Panels */}
              <div className="space-y-4">
                {/* Top Countries */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Top Countries
                  </h4>
                  <div className="space-y-2">
                    {topCountries.map(({ country, count }) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm">{country}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Pages */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Top Pages
                  </h4>
                  <div className="space-y-2">
                    {topPages.map(({ page, count }) => (
                      <div key={page} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{page}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2">
                    {filteredVisitors.slice(0, 5).map((visitor) => (
                      <div key={visitor.id} className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{visitor.location.city}</span>
                          <span className="text-muted-foreground">
                            {new Date(visitor.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Page: {visitor.page} • {visitor.duration}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status Indicator */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-muted-foreground">Live tracking active</span>
                <Badge variant="outline" className="ml-2">
                  {filteredVisitors.length} visitors in {selectedTimeRange}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
