'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Activity, TrendingUp, Zap } from 'lucide-react';

interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 for intensity
}

interface GitHubHeatmapProps {
  username: string;
  className?: string;
}

export function GitHubHeatmap({ username, className = '' }: GitHubHeatmapProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    averagePerDay: 0
  });

  // Generate mock activity data for demonstration
  // In production, you would fetch this from GitHub API
  const generateMockActivityData = (): ActivityData[] => {
    const data: ActivityData[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const randomCount = Math.random();
      let count = 0;
      let level = 0;

      if (randomCount > 0.7) {
        count = Math.floor(Math.random() * 5) + 1;
        level = Math.min(4, Math.ceil(count / 2));
      } else if (randomCount > 0.5) {
        count = 1;
        level = 1;
      }

      data.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }

    return data;
  };

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      try {
        // For demo purposes, generate mock data
        // In production, you'd fetch from GitHub API:
        // const response = await fetch(`https://api.github.com/users/${username}/events`);
        // const events = await response.json();
        // Process events to create activity data
        
        const mockData = generateMockActivityData();
        setActivityData(mockData);

        // Calculate stats
        const totalContributions = mockData.reduce((sum, day) => sum + day.count, 0);
        const activeDays = mockData.filter(day => day.count > 0).length;
        const currentStreak = calculateCurrentStreak(mockData);
        const longestStreak = calculateLongestStreak(mockData);
        const averagePerDay = Math.round(totalContributions / 365);

        setStats({
          totalContributions,
          currentStreak,
          longestStreak,
          averagePerDay
        });
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [username]);

  const calculateCurrentStreak = (data: ActivityData[]): number => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].date === today || data[i].date > today) {
        if (data[i].count > 0) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (data: ActivityData[]): number => {
    let longestStreak = 0;
    let currentStreak = 0;

    for (const day of data) {
      if (day.count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return longestStreak;
  };

  const getIntensityColor = (level: number): string => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-green-100 dark:bg-green-900/30',
      'bg-green-300 dark:bg-green-700/50',
      'bg-green-500 dark:bg-green-500/70',
      'bg-green-700 dark:bg-green-400'
    ];
    return colors[level] || colors[0];
  };

  const getMonthLabels = (): string[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - (11 - i));
      labels.push(months[date.getMonth()]);
    }
    
    return labels;
  };

  const getDayLabels = (): string[] => {
    return ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            GitHub Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            GitHub Activity Heatmap
          </CardTitle>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last year</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{stats.totalContributions} contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-semibold">{stats.currentStreak} day streak</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalContributions}</div>
              <div className="text-xs text-muted-foreground">Total Contributions</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.averagePerDay}</div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
                {getMonthLabels().map((month, index) => (
                  <div key={index} className="w-12 text-center">
                    {index % 2 === 0 ? month : ''}
                  </div>
                ))}
              </div>

              {/* Day labels and heatmap */}
              <div className="flex gap-1">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
                  {getDayLabels().map((day, index) => (
                    <div key={index} className="h-3 flex items-center">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1">
                  {activityData.map((day, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.001 }}
                          className={`w-3 h-3 rounded-sm cursor-pointer border border-border ${getIntensityColor(day.level)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-semibold">{day.date}</div>
                          <div>{day.count} contributions</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm border border-border ${getIntensityColor(level)}`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-2">Activity Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Most active day: </span>
                <span className="font-medium">
                  {activityData.reduce((max, day) => day.count > max.count ? day : max).date}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Active days: </span>
                <span className="font-medium">
                  {activityData.filter(day => day.count > 0).length} / {activityData.length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
