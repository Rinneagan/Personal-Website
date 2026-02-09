'use client';

import { useState, useEffect, useRef } from 'react';
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
  Navigation,
  MousePointer
} from 'lucide-react';

interface RealVisitor {
  id: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
    region?: string;
  };
  timestamp: string;
  page: string;
  duration: number;
  referrer?: string;
  userAgent?: string;
  sessionId: string;
  isNew: boolean;
}

interface VisitorMapProps {
  className?: string;
}

// Real-time visitor tracking hooks
export function useRealTimeVisitors() {
  const [visitors, setVisitors] = useState<RealVisitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<Set<string>>(new Set());
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [avgSessionDuration, setAvgSessionDuration] = useState(0);
  const [bounceRate, setBounceRate] = useState(0);
  const [topPages, setTopPages] = useState<Array<{page: string, count: number}>>([]);
  const [topCountries, setTopCountries] = useState<Array<{country: string, count: number}>>([]);
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(Date.now());
  const pageViewsRef = useRef<Set<string>>(new Set());
  const bouncedSessionsRef = useRef<Set<string>>(new Set());

  // Track page view
  const trackPageView = (page: string) => {
    const sessionId = sessionIdRef.current;
    
    // Track page view for this session
    pageViewsRef.current.add(page);
    setPageViews(prev => prev + 1);
    
    // Check if this is a bounce (single page view session)
    if (sessionId && pageViewsRef.current.size === 1) {
      // Set a timeout to detect if user leaves after single page view
      setTimeout(() => {
        if (pageViewsRef.current.size === 1) {
          bouncedSessionsRef.current.add(sessionId);
          updateBounceRate();
        }
      }, 30000); // 30 seconds to detect bounce
    }
    
    setTopPages(prev => {
      const newPages = [...prev];
      const existingIndex = newPages.findIndex(p => p.page === page);
      
      if (existingIndex >= 0) {
        newPages[existingIndex] = { page, count: newPages[existingIndex].count + 1 };
      } else {
        newPages.push({ page, count: 1 });
      }
      
      return newPages.sort((a, b) => b.count - a.count).slice(0, 5);
    });
  };

  // Update bounce rate calculation
  const updateBounceRate = () => {
    const totalSessions = Math.max(1, totalVisitors);
    const bouncedCount = bouncedSessionsRef.current.size;
    const rate = Math.round((bouncedCount / totalSessions) * 100);
    setBounceRate(rate);
  };

  // Track visitor session
  const trackVisitor = (visitorData: Partial<RealVisitor>) => {
    const sessionId = sessionIdRef.current || `session-${Date.now()}`;
    const visitor: RealVisitor = {
      id: `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      location: {
        city: 'Unknown',
        country: 'Unknown',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        region: 'Unknown'
      },
      timestamp: new Date().toISOString(),
      page: visitorData.page || window.location.pathname,
      duration: visitorData.duration || 0,
      referrer: visitorData.referrer || document.referrer,
      userAgent: visitorData.userAgent || navigator.userAgent,
      sessionId,
      isNew: true
    };

    setVisitors(prev => {
      const existingIndex = prev.findIndex(v => v.sessionId === sessionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...visitorData, isNew: false };
        return updated;
      }
      return [...prev, visitor];
    });

    setActiveVisitors(prev => new Set(prev).add(sessionId));
    setTotalVisitors(prev => prev + 1);
    
    // Update session duration
    const sessionDuration = (Date.now() - startTimeRef.current) / 1000;
    setAvgSessionDuration(prev => {
      const totalSessions = prev + 1;
      return ((prev * totalSessions) + sessionDuration) / totalSessions;
    });
  };

  // Get visitor location from IP (real-time data)
  const getVisitorLocation = async (): Promise<RealVisitor['location']> => {
    try {
      // First try browser geolocation (more accurate)
      if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Reverse geocoding to get city/country from coordinates
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en`
                );
                const data = await response.json();
                
                resolve({
                  city: data.address?.city || data.address?.town || 'Unknown',
                  country: data.address?.country || 'Unknown',
                  coordinates: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  },
                  region: data.address?.continent || 'Unknown'
                });
              } catch (error) {
                // Fallback to IP-based geolocation
                await getIPLocation();
              }
            },
            async () => {
              // Geolocation denied, fallback to IP-based
              await getIPLocation();
            }
          );
        });
      }
    } catch (error) {
      console.warn('Geolocation failed, using IP-based location');
    }

    // Fallback: IP-based geolocation
    async function getIPLocation(): Promise<RealVisitor['location']> {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        return {
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown',
          coordinates: {
            lat: data.latitude || 0,
            lng: data.longitude || 0
          },
          region: data.region || 'Unknown'
        };
      } catch (error) {
        console.warn('IP geolocation failed, using default location');
        // Ultimate fallback
        return {
          city: 'Unknown',
          country: 'Unknown',
          coordinates: { lat: 0, lng: 0 },
          region: 'Unknown'
        };
      }
    }

    return getIPLocation();
  };

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      sessionIdRef.current = `session-${Date.now()}`;
      startTimeRef.current = Date.now();
      
      const location = await getVisitorLocation();
      
      trackVisitor({
        page: window.location.pathname,
        location,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        duration: 0
      });

      trackPageView(window.location.pathname);
    };

    initSession();

    // Track page changes
    const handlePageChange = () => {
      const currentPath = window.location.pathname;
      trackPageView(currentPath);
    };

    window.addEventListener('popstate', handlePageChange);
    
    // Track session end
    const handleSessionEnd = () => {
      const currentSession = sessionIdRef.current;
      if (currentSession) {
        setVisitors(prev => prev.map(v => 
          v.sessionId === currentSession ? { ...v, duration: (Date.now() - startTimeRef.current) / 1000 } : v
        ));
        
        setActiveVisitors(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentSession);
          return newSet;
        });
      }
    };

    // Session cleanup on unload
    window.addEventListener('beforeunload', handleSessionEnd);
    
    // Periodic updates for active visitors
    const interval = setInterval(() => {
      const now = Date.now();
      setVisitors(prev => prev.map(visitor => {
        const sessionAge = (now - new Date(visitor.timestamp).getTime()) / 1000;
        const isActive = sessionAge < 1800; // Consider active if less than 30 minutes
        
        return {
          ...visitor,
          isActive: sessionAge < 1800
        };
      }));
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handlePageChange);
      window.removeEventListener('beforeunload', handleSessionEnd);
    };
  }, []);

  // Get unique countries
  const getUniqueCountries = () => {
    const countryCounts = visitors.reduce((acc, visitor) => {
      const country = visitor.location.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  };

  // Get recent visitors (last 10)
  const getRecentVisitors = () => {
    return visitors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  };

  return {
    visitors,
    activeVisitors,
    totalVisitors,
    pageViews,
    avgSessionDuration,
    bounceRate,
    topPages,
    topCountries: getUniqueCountries(),
    trackPageView,
    trackVisitor,
    getVisitorLocation,
    getRecentVisitors
  };
}

export function VisitorMap({ className = '' }: VisitorMapProps) {
  const {
    visitors,
    activeVisitors,
    totalVisitors,
    pageViews,
    avgSessionDuration,
    bounceRate,
    topPages,
    topCountries,
    getRecentVisitors,
    trackPageView,
    trackVisitor,
    getVisitorLocation
  } = useRealTimeVisitors();

  const recentVisitors = getRecentVisitors();

  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedVisitor, setSelectedVisitor] = useState<RealVisitor | null>(null);

  // Filter visitors based on time range
  const getFilteredVisitors = () => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = new Date(now.getTime() - timeRanges[selectedTimeRange]);
    
    return visitors.filter(visitor => 
      new Date(visitor.timestamp) >= cutoffTime
    );
  };

  const filteredVisitors = getFilteredVisitors();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Real-time Visitor Analytics
          </CardTitle>
          <CardDescription>
            Live visitor tracking with real-time data and interactive world map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Real-time Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{totalVisitors}</div>
                    <div className="text-sm text-muted-foreground">Total Visitors</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{activeVisitors.size}</div>
                    <div className="text-sm text-muted-foreground">Active Now</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{pageViews}</div>
                    <div className="text-sm text-muted-foreground">Page Views</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{Math.round(avgSessionDuration)}s</div>
                    <div className="text-sm text-muted-foreground">Avg. Session</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-4 mb-6">
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
            </div>

            {/* Interactive World Map */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Map */}
              <div className="xl:col-span-2">
                <div className="bg-muted/30 rounded-lg p-4 h-[250px] sm:h-[450px] relative overflow-hidden tools-map-container">
                  <div className="absolute inset-0">
                    {/* World Map Background */}
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-blue-950 dark:via-green-950 dark:to-yellow-950">
                      {/* Grid lines for world map effect */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-12 grid-rows-6 w-full h-full">
                          {Array.from({ length: 72 }).map((_, i) => (
                            <div
                              key={i}
                              className={`border border-border/20 ${
                                i % 12 === 0 || i % 12 === 11 ? 'border-l-2 border-r-2' : ''
                              } ${i % 12 < 6 ? 'border-b-2' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Real Visitor Dots */}
                      {filteredVisitors.slice(0, 25).map((visitor, index) => {
                        const x = ((visitor.location.coordinates.lng + 180) / 360) * 100;
                        const y = ((90 - visitor.location.coordinates.lat) / 180) * 100;
                        const size = visitor.isNew ? 8 : 6; // New visitors slightly larger
                        
                        return (
                          <div
                            key={visitor.id}
                            className={`absolute w-2 h-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 ${
                              visitor.isNew ? 'bg-red-500' : 'bg-blue-500'
                            } ${(visitor as any).isActive ? 'ring-2 ring-white ring-opacity-50' : ''}`}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: `${size}px`,
                              height: `${size}px`,
                              animationDelay: `${index * 0.05}s`,
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
                            }}
                            onClick={() => setSelectedVisitor(visitor)}
                            title={`${visitor.location.city}, ${visitor.location.country} - ${new Date(visitor.timestamp).toLocaleString()}`}
                          >
                            {/* Pulsing effect for active visitors */}
                            {(visitor as any).isActive && (
                              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                            )}
                            
                            {/* New visitor indicator */}
                            {visitor.isNew && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                                NEW
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs space-y-2">
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

              {/* Analytics Panels */}
              <div className="space-y-4">
                {/* Top Countries */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Top Countries ({topCountries.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto tools-overflow-scroll">
                    {topCountries.map(({ country, count }) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm">{country}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{count}</Badge>
                          <div className="w-16 h-2 bg-muted rounded">
                            <div 
                              className="h-full bg-blue-500 rounded" 
                              style={{ width: `${(count / Math.max(...topCountries.map(c => c.count))) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Pages */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Top Pages ({topPages.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto tools-overflow-scroll">
                    {topPages.map(({ page, count }) => (
                      <div key={page} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{page}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{count}</Badge>
                          <div className="w-16 h-2 bg-muted rounded">
                            <div 
                              className="h-full bg-purple-500 rounded" 
                              style={{ width: `${(count / Math.max(...topPages.map(p => p.count))) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activity ({recentVisitors.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto tools-overflow-scroll">
                    {recentVisitors.slice(0, 5).map((visitor: RealVisitor) => (
                      <div 
                        key={visitor.id} 
                        className="text-xs p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedVisitor(visitor)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{visitor.location.city}</span>
                          <span className="text-muted-foreground">
                            {new Date(visitor.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {visitor.page} • {visitor.duration}s
                          {visitor.isNew && (
                            <Badge variant="outline" className="ml-2">NEW</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status Bar */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Live tracking active • {filteredVisitors.length} visitors in {selectedTimeRange}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitor Details Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 bg-white backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:bg-black">
          <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Visitor Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVisitor(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Location</span>
                  <p className="text-lg">{selectedVisitor.location.city}, {selectedVisitor.location.country}</p>
                  {selectedVisitor.location.region && (
                    <p className="text-sm text-muted-foreground">{selectedVisitor.location.region}</p>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium">Session ID</span>
                  <p className="font-mono text-sm">{selectedVisitor.sessionId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Page</span>
                  <p className="font-mono text-sm">{selectedVisitor.page}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Duration</span>
                  <p>{selectedVisitor.duration}s</p>
                </div>
              <div>
                <span className="text-sm font-medium">Timestamp</span>
                <p>{new Date(selectedVisitor.timestamp).toLocaleString()}</p>
              </div>
              </div>
              
              {selectedVisitor.referrer && (
                <div>
                <span className="text-sm font-medium">Referrer</span>
                <p>{selectedVisitor.referrer}</p>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { VisitorMap as default };
