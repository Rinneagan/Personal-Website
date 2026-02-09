'use client';

import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubRepo } from '@/lib/github';
import { ExternalLink, Github, Calendar, GitFork, Star, Users, MessageCircle, Code, Activity } from 'lucide-react';
import { TechStackIcons } from '@/components/TechStackIcons';
import { CommentsSystem } from '@/components/CommentsSystem';
import { ProjectDNA } from '@/components/ProjectDNA';
import { useEffect, useState } from 'react';
import { updateUrlState, initializeFromUrl, saveScrollPosition } from '@/lib/urlState';

interface ProjectModalProps {
  repo: GitHubRepo;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ repo, isOpen, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize from URL and handle URL updates
  useEffect(() => {
    const urlState = initializeFromUrl();
    
    // Set active tab from URL if modal matches
    if (urlState.modal === repo.name) {
      if (urlState.tab) {
        setActiveTab(urlState.tab);
      } else {
        setActiveTab('overview');
      }
    } else {
      // URL doesn't match any repo, ensure modal is closed
      if (isOpen) {
        onClose();
      }
    }
  }, [repo.name, isOpen]);

  // Update URL when tab changes
  useEffect(() => {
    if (isOpen) {
      updateUrlState({ 
        modal: repo.name,
        tab: activeTab 
      });
    }
  }, [isOpen, activeTab, repo.name]);

  // Save scroll position before modal opens
  useEffect(() => {
    if (isOpen) {
      saveScrollPosition();
    }
  }, [isOpen]);

  // Clear modal from URL when closed
  useEffect(() => {
    if (!isOpen) {
      const currentState = initializeFromUrl();
      updateUrlState({ 
        modal: undefined,
        projectId: undefined,
        tab: undefined,
        section: currentState.section // Preserve the current section
      });
    }
  }, [isOpen]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate real repository preview image URL
  const getScreenshotUrl = () => {
    // Use GitHub's social preview image for the repository
    return `https://opengraph.githubassets.com/1/Rinneagan/${repo.name}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            {repo.name}
            <Badge variant="secondary">{repo.language || 'Unknown'}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="dna" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              DNA
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Repository Preview Image */}
            <div className="w-full">
              <img 
                src={getScreenshotUrl()} 
                alt={`${repo.name} repository preview`}
                className="w-full h-auto rounded-lg border"
                onError={(e) => {
                  // Fallback to a simple placeholder if GitHub preview fails
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x400/1e293b/ffffff?text=${encodeURIComponent(repo.name)}`;
                }}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                {repo.description ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {repo.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided.
                  </p>
                )}

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Technology Stack</h4>
                  <TechStackIcons 
                    language={repo.language} 
                    topics={repo.topics}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Repository Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">⭐ Stars</span>
                    <span className="font-medium">{repo.stargazers_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">🍴 Forks</span>
                    <span className="font-medium">{repo.forks_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">📦 Size</span>
                    <span className="font-medium">{repo.size} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">🔤 License</span>
                    <span className="font-medium">
                      {repo.license?.name || 'No License'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <Button asChild className="w-full justify-start">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                  {repo.homepage && (
                    <Button variant="outline" asChild className="w-full justify-start">
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Repository Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Created</span>
                    <div className="font-medium">
                      {formatDate(repo.created_at)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <div className="font-medium">
                      {new Date(repo.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Language</span>
                    <div className="font-medium">
                      {repo.language || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Topics & Tags</h4>
                {repo.topics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No topics specified.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dna" className="mt-6">
            <ProjectDNA 
              projectId={repo.id.toString()} 
              projectName={repo.name}
              projectDescription={repo.description}
              projectLanguage={repo.language}
              projectTopics={repo.topics}
            />
          </TabsContent>

          <TabsContent value="discussion" className="mt-6">
            <CommentsSystem 
              projectId={repo.id.toString()} 
              projectName={repo.name}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
