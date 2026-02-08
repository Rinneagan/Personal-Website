'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GitHubUser, getUserInfo, getUserRepos } from '@/lib/github';
import { 
  Users, 
  Search, 
  Star, 
  MapPin, 
  Calendar, 
  Github, 
  Code,
  Briefcase,
  Target,
  Filter,
  ExternalLink,
  Users2,
  Building,
  Link,
  Mail
} from 'lucide-react';

interface Collaborator {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  languages: string[];
  repoCount: number;
  totalStars: number;
  lastActive: string;
  matchScore: number;
  collaborationLevel: 'high' | 'medium' | 'low';
}

interface CollaborationHubProps {
  userSkills?: string[];
  userInterests?: string[];
  className?: string;
}

// Real GitHub users known for collaboration and open source contributions
const ACTIVE_COLLABORATORS = [
  'gaearon', 'sophiebits', 'dan_abramov', 'yyx990803', 'kentcdodds'
];

export function CollaborationHub({ 
  userSkills = [], 
  userInterests = [], 
  className = '' 
}: CollaborationHubProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filteredCollaborators, setFilteredCollaborators] = useState<Collaborator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCollaborationLevel, setSelectedCollaborationLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'followers' | 'stars' | 'repos'>('match');
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback collaborators when GitHub API fails
  const getFallbackCollaborators = (): Collaborator[] => [
    {
      login: 'gaearon',
      name: 'Dan Abramov',
      avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
      html_url: 'https://github.com/gaearon',
      bio: 'Working on React.js. Co-author of Redux and Create React App. Fan of functional programming, static typing, and Emacs.',
      followers: 95000,
      following: 227,
      public_repos: 264,
      languages: ['JavaScript', 'TypeScript', 'React'],
      repoCount: 264,
      totalStars: 150000,
      lastActive: new Date().toLocaleDateString(),
      matchScore: 95,
      collaborationLevel: 'high' as const
    },
    {
      login: 'sophiebits',
      name: 'Sophie Alpert',
      avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4',
      html_url: 'https://github.com/sophiebits',
      bio: 'React core team. Working on React at Facebook.',
      followers: 12000,
      following: 67,
      public_repos: 142,
      languages: ['JavaScript', 'TypeScript', 'React'],
      repoCount: 142,
      totalStars: 45000,
      lastActive: new Date().toLocaleDateString(),
      matchScore: 92,
      collaborationLevel: 'high' as const
    },
    {
      login: 'yyx990803',
      name: 'Evan You',
      avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4',
      html_url: 'https://github.com/yyx990803',
      bio: 'Creator of Vue.js. Living the dream.',
      followers: 58000,
      following: 187,
      public_repos: 189,
      languages: ['JavaScript', 'TypeScript', 'Vue'],
      repoCount: 189,
      totalStars: 180000,
      lastActive: new Date().toLocaleDateString(),
      matchScore: 88,
      collaborationLevel: 'high' as const
    }
  ];

  // Fetch real GitHub users and their data
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const collaboratorsData: Collaborator[] = [];
        
        // Fetch data for collaborative GitHub users
        for (const username of ACTIVE_COLLABORATORS.slice(0, 3)) {
          try {
            const userData = await getUserInfo(username);
            if (!userData) continue;
            
            console.log(`Successfully fetched data for ${username}`);
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get repository data to analyze languages and collaboration patterns
            const repos = await getUserRepos(username);
            
            // Analyze collaboration level based on repository activity
            const collaborationLevel = analyzeCollaborationLevel(userData, repos);
            
            // Calculate match score based on skills and interests
            const matchScore = calculateMatchScore(userData, repos, userSkills, userInterests);
            
            // Extract languages from repositories
            const languages = extractLanguages(repos);
            
            // Calculate total stars across all repositories
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            
            const collaborator: Collaborator = {
              login: userData.login,
              name: userData.name,
              avatar_url: userData.avatar_url,
              html_url: userData.html_url,
              bio: userData.bio,
              followers: userData.followers,
              following: userData.following,
              public_repos: userData.public_repos,
              languages,
              repoCount: repos.length,
              totalStars,
              lastActive: new Date().toLocaleDateString(),
              matchScore,
              collaborationLevel
            };
            
            collaboratorsData.push(collaborator);
            
            // Add longer delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 3000));
          } catch (error) {
            console.log(`Could not fetch data for ${username}:`, error);
            // Continue with next user even if one fails
            continue;
          }
        }
        
        setCollaborators(collaboratorsData);
        setFilteredCollaborators(collaboratorsData);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        // If we get any error (404, 403, etc.), immediately use fallback
        console.log('Using fallback collaborators due to API error');
        const fallbackCollaborators = getFallbackCollaborators();
        setCollaborators(fallbackCollaborators);
        setFilteredCollaborators(fallbackCollaborators);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollaborators();
  }, [userSkills, userInterests]);

  const analyzeCollaborationLevel = (user: GitHubUser, repos: any[]): 'high' | 'medium' | 'low' => {
    let score = 0;
    
    // High collaboration indicators
    if (user.followers > 1000) score += 3;
    if (user.following > 100) score += 2;
    if (user.public_repos > 50) score += 2;
    
    // Check for collaborative repositories
    const collaborativeRepos = repos.filter(repo => 
      repo.forks_count > 10 || 
      repo.open_issues_count > 5 ||
      repo.stargazers_count > 100
    );
    
    if (collaborativeRepos.length > 10) score += 3;
    else if (collaborativeRepos.length > 5) score += 2;
    else if (collaborativeRepos.length > 2) score += 1;
    
    // Check bio for collaboration keywords
    if (user.bio) {
      const collaborationKeywords = ['open source', 'collaboration', 'contributor', 'maintainer', 'community', 'team'];
      collaborationKeywords.forEach(keyword => {
        if (user.bio!.toLowerCase().includes(keyword)) score += 1;
      });
    }
    
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  const calculateMatchScore = (user: GitHubUser, repos: any[], userSkills: string[], userInterests: string[]): number => {
    let score = 30; // Base score
    
    // Boost score based on followers and activity
    if (user.followers > 10000) score += 25;
    else if (user.followers > 1000) score += 20;
    else if (user.followers > 100) score += 15;
    else if (user.followers > 10) score += 10;
    
    // Boost score based on repositories
    if (user.public_repos > 100) score += 15;
    else if (user.public_repos > 50) score += 10;
    else if (user.public_repos > 10) score += 5;
    
    // Check for skill matches in bio and repositories
    if (user.bio) {
      const bio = user.bio.toLowerCase();
      userSkills.forEach(skill => {
        if (bio.includes(skill.toLowerCase())) score += 5;
      });
      
      userInterests.forEach(interest => {
        if (bio.includes(interest.toLowerCase())) score += 3;
      });
    }
    
    // Check repository names and descriptions for skill matches
    repos.forEach(repo => {
      const repoText = `${repo.name} ${repo.description || ''}`.toLowerCase();
      userSkills.forEach(skill => {
        if (repoText.includes(skill.toLowerCase())) score += 2;
      });
    });
    
    return Math.min(100, Math.max(0, score));
  };

  const extractLanguages = (repos: any[]): string[] => {
    const languageCount: { [key: string]: number } = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });
    
    // Sort by frequency and return top languages
    return Object.entries(languageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([language]) => language);
  };

  // Filter collaborators based on search and filters
  useEffect(() => {
    let filtered = collaborators;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(collaborator =>
        collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborator.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collaborator.bio && collaborator.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        collaborator.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Languages filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(collaborator =>
        selectedLanguages.some(lang => collaborator.languages.includes(lang))
      );
    }

    // Collaboration level filter
    if (selectedCollaborationLevel !== 'all') {
      filtered = filtered.filter(collaborator => collaborator.collaborationLevel === selectedCollaborationLevel);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'followers':
          return b.followers - a.followers;
        case 'stars':
          return b.totalStars - a.totalStars;
        case 'repos':
          return b.repoCount - a.repoCount;
        default:
          return 0;
      }
    });

    setFilteredCollaborators(filtered);
  }, [collaborators, searchTerm, selectedLanguages, selectedCollaborationLevel, sortBy]);

  const allLanguages = Array.from(
    new Set(collaborators.flatMap(c => c.languages))
  ).sort();

  const getCollaborationLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCollaborationLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'High Collaboration';
      case 'medium': return 'Medium Collaboration';
      case 'low': return 'Low Collaboration';
      default: return 'Unknown';
    }
  };

  const CollaboratorCard = ({ collaborator }: { collaborator: Collaborator }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-background border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedCollaborator(collaborator)}
    >
      <div className="flex items-start gap-4">
        <img
          src={collaborator.avatar_url}
          alt={collaborator.name}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{collaborator.name || collaborator.login}</h3>
              <p className="text-sm text-muted-foreground">@{collaborator.login}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getCollaborationLevelColor(collaborator.collaborationLevel)}`} />
              <span className="text-xs text-muted-foreground">
                {getCollaborationLevelText(collaborator.collaborationLevel)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {collaborator.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {collaborator.location}
              </div>
            )}
            {collaborator.company && (
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {collaborator.company}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {collaborator.followers.toLocaleString()}
            </div>
          </div>

          {collaborator.bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {collaborator.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {collaborator.languages.slice(0, 4).map((language) => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language}
              </Badge>
            ))}
            {collaborator.languages.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{collaborator.languages.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{collaborator.repoCount} repos</span>
              <span>{collaborator.totalStars.toLocaleString()} stars</span>
              <span>{collaborator.lastActive}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-primary" />
              <span className="text-sm font-medium text-primary">
                {collaborator.matchScore}% match
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="w-5 h-5" />
            GitHub Collaboration Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Users2 className="w-8 h-8 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Fetching real GitHub collaborators...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5" />
            GitHub Collaboration Hub
          </div>
          <Badge variant="secondary">{filteredCollaborators.length} collaborators</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search GitHub users, languages, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {allLanguages.slice(0, 8).map((language) => (
                  <Badge
                    key={language}
                    variant={selectedLanguages.includes(language) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedLanguages(prev =>
                        prev.includes(language)
                          ? prev.filter(l => l !== language)
                          : [...prev, language]
                      );
                    }}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Collaboration Level</label>
              <select
                value={selectedCollaborationLevel}
                onChange={(e) => setSelectedCollaborationLevel(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="all">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="match">Best Match</option>
                <option value="followers">Most Followers</option>
                <option value="stars">Total Stars</option>
                <option value="repos">Most Repos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collaborators Grid */}
        <div className="space-y-4">
          {filteredCollaborators.length === 0 ? (
            <div className="text-center py-12">
              <Users2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No collaborators found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCollaborators.map((collaborator) => (
                <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
              ))}
            </div>
          )}
        </div>

        {/* Collaborator Detail Modal */}
        <AnimatePresence>
          {selectedCollaborator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCollaborator(null)}
            >
              <motion.div
                className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={selectedCollaborator.avatar_url}
                      alt={selectedCollaborator.name}
                      className="w-16 h-16 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{selectedCollaborator.name || selectedCollaborator.login}</h3>
                          <p className="text-muted-foreground">@{selectedCollaborator.login}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCollaborationLevelColor(selectedCollaborator.collaborationLevel)}`} />
                          <span className="text-sm">{getCollaborationLevelText(selectedCollaborator.collaborationLevel)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {selectedCollaborator.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {selectedCollaborator.location}
                          </div>
                        )}
                        {selectedCollaborator.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {selectedCollaborator.company}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {selectedCollaborator.followers.toLocaleString()} followers
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-primary" />
                          {selectedCollaborator.matchScore}% match
                        </div>
                      </div>

                      {selectedCollaborator.bio && (
                        <p className="text-muted-foreground mb-4">{selectedCollaborator.bio}</p>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedCollaborator.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                            GitHub Profile
                          </a>
                        </Button>
                        {selectedCollaborator.blog && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedCollaborator.blog} target="_blank" rel="noopener noreferrer">
                              <Link className="w-4 h-4" />
                              Website
                            </a>
                          </Button>
                        )}
                        {selectedCollaborator.twitter_username && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://twitter.com/${selectedCollaborator.twitter_username}`} target="_blank" rel="noopener noreferrer">
                              <Mail className="w-4 h-4" />
                              Twitter
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Primary Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaborator.languages.map((language) => (
                          <Badge key={language} variant="secondary">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCollaborator.repoCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Repositories</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCollaborator.totalStars.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Stars</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCollaborator.followers.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1" asChild>
                      <a href={selectedCollaborator.html_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View GitHub Profile
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedCollaborator(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
