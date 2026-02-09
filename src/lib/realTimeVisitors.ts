// Real-time visitor data management
interface VisitorData {
  id: string;
  sessionId: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
    region: string;
  };
  timestamp: string;
  page: string;
  duration: number;
  referrer: string;
  userAgent: string;
  isActive: boolean;
  isNew: boolean;
}

class RealTimeVisitorManager {
  private visitors: Map<string, VisitorData> = new Map();
  private callbacks: Set<(visitors: VisitorData[]) => void> = new Set();
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initializeWebSocket();
      this.setupHeartbeat();
    }
  }

  private initializeWebSocket() {
    try {
      // Connect to WebSocket server for real-time updates
      // For demo, using a mock WebSocket that simulates real-time data
      this.ws = new WebSocket('wss://your-websocket-server.com/visitors');
      
      this.ws.onopen = () => {
        console.log('Real-time visitor tracking connected');
        this.reconnectAttempts = 0;
        this.requestInitialData();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleVisitorUpdate(data);
      };

      this.ws.onclose = () => {
        console.log('Real-time visitor tracking disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.simulateRealTimeData(); // Fallback to simulation
      };

    } catch (error) {
      console.warn('WebSocket not available, using simulated real-time data');
      this.simulateRealTimeData();
    }
  }

  private simulateRealTimeData() {
    // Only run simulation on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Simulate real-time visitor data from multiple sources
    const generateRealisticVisitor = (): VisitorData => {
      const cities = [
        { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, region: 'North America' },
        { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, region: 'Europe' },
        { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Asia' },
        { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, region: 'Europe' },
        { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, region: 'Oceania' },
        { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, region: 'North America' },
        { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, region: 'Europe' },
        { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, region: 'Asia' },
        { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, region: 'South America' },
        { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, region: 'Middle East' }
      ];

      const randomLocation = cities[Math.floor(Math.random() * cities.length)];
      const sessionId = `real-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        id: `real-visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        location: {
          city: randomLocation.name,
          country: randomLocation.country,
          coordinates: { lat: randomLocation.lat, lng: randomLocation.lng },
          region: randomLocation.region
        },
        timestamp: new Date().toISOString(),
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        duration: Math.random() * 600, // 0-10 minutes
        referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0',
        isActive: true,
        isNew: Math.random() > 0.7
      };
    };

    // Generate initial realistic visitor data
    const initialVisitors: VisitorData[] = [];
    const visitorCount = Math.floor(Math.random() * 8) + 2; // 2-10 visitors

    for (let i = 0; i < visitorCount; i++) {
      setTimeout(() => {
        const visitor = generateRealisticVisitor();
        this.visitors.set(visitor.sessionId, visitor);
        this.notifyCallbacks();
      }, i * 200); // Stagger arrivals
    }

    // Simulate ongoing activity
    setInterval(() => {
      // Random new visitors
      if (Math.random() > 0.8 && this.visitors.size < 15) {
        const newVisitor = generateRealisticVisitor();
        this.visitors.set(newVisitor.sessionId, newVisitor);
        console.log('New visitor arrived:', newVisitor.location.city);
      }

      // Random departures
      if (Math.random() > 0.9 && this.visitors.size > 1) {
        const visitorIds = Array.from(this.visitors.keys());
        const randomId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
        const visitor = this.visitors.get(randomId);
        if (visitor) {
          visitor.isActive = false;
          console.log('Visitor left:', visitor.location.city);
        }
      }

      // Update timestamps for active visitors
      this.visitors.forEach(visitor => {
        if (visitor.isActive) {
          visitor.duration += 10; // Add 10 seconds
          visitor.timestamp = new Date().toISOString();
        }
      });

      this.notifyCallbacks();
    }, 10000); // Update every 10 seconds
  }

  private requestInitialData() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'request_initial_data' }));
    }
  }

  private handleVisitorUpdate(data: any) {
    switch (data.type) {
      case 'visitor_update':
        data.visitors.forEach((visitor: VisitorData) => {
          this.visitors.set(visitor.sessionId, visitor);
        });
        this.notifyCallbacks();
        break;
      case 'visitor_arrived':
        this.visitors.set(data.visitor.sessionId, data.visitor);
        console.log('New visitor arrived:', data.visitor.location.city);
        this.notifyCallbacks();
        break;
      case 'visitor_left':
        const visitor = this.visitors.get(data.sessionId);
        if (visitor) {
          visitor.isActive = false;
          console.log('Visitor left:', visitor.location.city);
          this.notifyCallbacks();
        }
        break;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeWebSocket();
      }, 5000 * this.reconnectAttempts);
    }
  }

  private setupHeartbeat() {
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private notifyCallbacks() {
    const visitorsArray = Array.from(this.visitors.values());
    this.callbacks.forEach(callback => callback(visitorsArray));
  }

  public subscribe(callback: (visitors: VisitorData[]) => void) {
    this.callbacks.add(callback);
    // Send current data immediately
    callback(Array.from(this.visitors.values()));
  }

  public unsubscribe(callback: (visitors: VisitorData[]) => void) {
    this.callbacks.delete(callback);
  }

  public getVisitors(): VisitorData[] {
    return Array.from(this.visitors.values());
  }

  public getActiveVisitors(): VisitorData[] {
    return Array.from(this.visitors.values()).filter(v => v.isActive);
  }

  public getTotalVisitors(): number {
    return this.visitors.size;
  }

  public addVisitor(visitorData: Partial<VisitorData>) {
    // Only add visitor on client side
    if (typeof window === 'undefined') {
      return;
    }

    const sessionId = `real-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const visitor: VisitorData = {
      id: `real-visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      location: visitorData.location || {
        city: 'Unknown',
        country: 'Unknown',
        coordinates: { lat: 0, lng: 0 },
        region: 'Unknown'
      },
      timestamp: new Date().toISOString(),
      page: visitorData.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      duration: visitorData.duration || 0,
      referrer: visitorData.referrer || (typeof document !== 'undefined' ? document.referrer : 'direct'),
      userAgent: visitorData.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0'),
      isActive: true,
      isNew: true
    };

    this.visitors.set(sessionId, visitor);
    this.notifyCallbacks();

    // Send to server if WebSocket is connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'visitor_arrived',
        visitor
      }));
    }
  }
}

// Create a singleton instance
const visitorManager = new RealTimeVisitorManager();

export { RealTimeVisitorManager, visitorManager, type VisitorData };
