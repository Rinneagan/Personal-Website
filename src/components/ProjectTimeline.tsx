'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubRepo } from '@/lib/github';
import { Calendar, Star, GitFork, ExternalLink, Code } from 'lucide-react';
import { TechStackIcons } from '@/components/TechStackIcons';

interface ProjectTimelineProps {
  repos: GitHubRepo[];
  onViewDetails?: (repo: GitHubRepo) => void;
}

interface TimelineItem {
  year: number;
  month: string;
  repos: GitHubRepo[];
}

export function ProjectTimeline({ repos, onViewDetails }: ProjectTimelineProps) {
  // Group repositories by year and month
  const groupByMonth = (repos: GitHubRepo[]): TimelineItem[] => {
    const grouped: Record<string, GitHubRepo[]> = {};
    
    repos.forEach(repo => {
      const date = new Date(repo.created_at);
      const year = date.getFullYear();
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const key = `${year}-${month}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(repo);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.entries(grouped)
      .map(([key, repoList]) => {
        const [year, month] = key.split('-');
        return {
          year: parseInt(year),
          month,
          repos: repoList.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        };
      })
      .sort((a, b) => b.year - a.year || b.month.localeCompare(a.month));
  };

  const timelineData = groupByMonth(repos);
  const totalProjects = repos.length;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const getYearColor = (index: number) => {
    const colors = [
      'text-blue-600',
      'text-green-600', 
      'text-purple-600',
      'text-orange-600',
      'text-pink-600',
      'text-cyan-600'
    ];
    return colors[index % colors.length];
  };

  const getTimelineLineColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500', 
      'bg-orange-500',
      'bg-pink-500',
      'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalStars}</div>
            <div className="text-sm text-muted-foreground">Total Stars</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalForks}</div>
            <div className="text-sm text-muted-foreground">Total Forks</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="relative">
        {timelineData.map((item, yearIndex) => (
          <div key={`${item.year}-${item.month}`} className="relative mb-12">
            {/* Year Header */}
            {yearIndex === 0 || timelineData[yearIndex - 1].year !== item.year ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: yearIndex * 0.1 }}
                className="mb-6"
              >
                <h2 className={`text-3xl font-bold ${getYearColor(yearIndex)}`}>
                  {item.year}
                </h2>
                <div className={`h-1 w-20 ${getTimelineLineColor(yearIndex)} rounded-full mt-2`}></div>
              </motion.div>
            ) : null}

            {/* Month Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: yearIndex * 0.1 + 0.2 }}
              className="relative mb-8"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 w-3 h-3 bg-white border-4 border-blue-500 rounded-full z-10"></div>
              
              {/* Timeline Line */}
              {yearIndex < timelineData.length - 1 && (
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gray-300"></div>
              )}

              {/* Month Header */}
              <div className="ml-6 mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {item.month}
                </h3>
                <div className="text-xs text-muted-foreground">
                  {item.repos.length} project{item.repos.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Projects for this month */}
              <div className="ml-6 space-y-2">
                {item.repos.map((repo, repoIndex) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: yearIndex * 0.1 + 0.3 + repoIndex * 0.1 
                    }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-sm">{repo.name}</h4>
                              {repo.language && (
                                <Badge variant="secondary" className="text-xs">
                                  {repo.language}
                                </Badge>
                              )}
                            </div>
                            
                            {repo.description && (
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {repo.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(repo.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="w-3 h-3" />
                                <span>{repo.forks_count}</span>
                              </div>
                            </div>

                            <TechStackIcons 
                              language={repo.language} 
                              topics={repo.topics}
                              className="mb-2"
                            />
                          </div>

                          <div className="flex gap-2 lg:flex-col">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onViewDetails?.(repo)}
                              className="flex items-center gap-2 text-xs h-8"
                            >
                              <Code className="w-3 h-3" />
                              Details
                            </Button>
                            <Button asChild size="sm" className="flex items-center gap-2 text-xs h-8">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                GitHub
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {timelineData.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No projects to display in timeline.</p>
        </div>
      )}
    </div>
  );
}
