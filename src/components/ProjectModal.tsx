'use client';

import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubRepo } from '@/lib/github';
import { ExternalLink, Github, Calendar, GitFork, Star, Users } from 'lucide-react';
import { TechStackIcons } from '@/components/TechStackIcons';

interface ProjectModalProps {
  repo: GitHubRepo;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ repo, isOpen, onClose }: ProjectModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate a placeholder screenshot URL based on the repo
  const getScreenshotUrl = () => {
    // In a real implementation, you'd have actual screenshots
    // For now, we'll use a placeholder service
    return `https://via.placeholder.com/800x400/1e293b/ffffff?text=${encodeURIComponent(repo.name)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {repo.name}
            <Badge variant="secondary">{repo.language || 'Unknown'}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Screenshot Section */}
          <div className="relative group">
            <div className="overflow-hidden rounded-lg border bg-muted">
              <img
                src={getScreenshotUrl()}
                alt={`${repo.name} screenshot`}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              <p className="text-white text-center px-4">
                Project Screenshot
              </p>
            </div>
          </div>

          {/* Description */}
          {repo.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                {repo.description}
              </p>
            </div>
          )}

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Technologies & Topics</h3>
              <div className="space-y-3">
                <TechStackIcons 
                  language={repo.language} 
                  topics={repo.topics}
                  className="flex-wrap gap-2"
                />
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="font-semibold">{repo.stargazers_count}</p>
                <p className="text-xs text-muted-foreground">Stars</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-semibold">{repo.forks_count}</p>
                <p className="text-xs text-muted-foreground">Forks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-semibold text-sm">
                  {new Date(repo.created_at).getFullYear()}
                </p>
                <p className="text-xs text-muted-foreground">Created</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">
                  {formatDate(repo.updated_at)}
                </p>
                <p className="text-xs text-muted-foreground">Updated</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </Button>
            
            {repo.homepage && (
              <Button asChild variant="outline" className="flex-1">
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>

          {/* README Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Repository:</strong> {repo.name}</p>
              <p><strong>Main Language:</strong> {repo.language || 'Not specified'}</p>
              <p><strong>License:</strong> {repo.license?.name || 'No license'}</p>
              <p><strong>Size:</strong> {(repo.size / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
