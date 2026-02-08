'use client';

import { GitHubRepo } from '@/lib/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, GitFork, ExternalLink, Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechStackIcons } from '@/components/TechStackIcons';

interface ProjectCardProps {
  repo: GitHubRepo;
  className?: string;
  onViewDetails?: (repo: GitHubRepo) => void;
}

export function ProjectCard({ repo, className, onViewDetails }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-green-500',
      'Java': 'bg-orange-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-600',
      'C++': 'bg-purple-500',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-blue-500',
      'Vue': 'bg-green-500',
      'React': 'bg-cyan-500',
    };
    return language ? colors[language] || 'bg-gray-500' : 'bg-gray-500';
  };

  return (
    <Card className={cn('h-full flex flex-col transition-all hover:shadow-lg', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {repo.name}
          </CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{repo.stargazers_count}</span>
          </div>
        </div>
        {repo.description && (
          <CardDescription className="line-clamp-3">
            {repo.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap gap-1 min-h-[24px]">
          <TechStackIcons 
            language={repo.language} 
            topics={repo.topics}
            className="mb-2"
          />
          {repo.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span>{repo.forks_count}</span>
          </div>
          <div className="text-xs">
            Updated {formatDate(repo.updated_at)}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails?.(repo)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
          <Button asChild size="sm" className="flex-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              View Code
            </a>
          </Button>
          {repo.homepage && (
            <Button asChild size="sm" variant="outline">
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
