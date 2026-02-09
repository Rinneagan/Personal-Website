'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GitHubUser, getUserInfo } from '@/lib/github';
import { 
  Users2, 
  Search, 
  MessageCircle, 
  Star, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Twitter,
  Globe,
  Code,
  Briefcase,
  Award,
  Target,
  TrendingUp,
  Filter,
  UserPlus,
  Mail,
  ExternalLink
} from 'lucide-react';

interface Collaborator {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location?: string | null;
  company?: string | null;
  blog?: string | null;
  twitter_username?: string | null;
  updated_at?: string;
  type?: string;
  collaborationTypes: string[];
  rating: number;
  projectsCompleted: number;
  responseRate: number;
  matchScore: number;
  skills: string[];
  interests: string[];
}

interface CollaborationHubProps {
  userSkills?: string[];
  userInterests?: string[];
  className?: string;
}

// GitHub users known for collaboration and open source (reduced to avoid rate limiting)
const COLLABORATIVE_GITHUB_USERS = [
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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'followers' | 'recent'>('match');
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false); // Prevent re-fetching

  // Fetch real GitHub users with rate limiting (only fetch once)
  useEffect(() => {
    // Only fetch if we haven't loaded yet
    if (hasLoaded || collaborators.length > 0) {
      console.log('Collaborators already loaded, skipping fetch');
      return;
    }

    const fetchCollaborators = async () => {
      try {
        console.log('Starting collaborators fetch...');
        const collaboratorsData: Collaborator[] = [];
        
        // Fetch data for each collaborative GitHub user with delays to avoid rate limiting
        for (let i = 0; i < COLLABORATIVE_GITHUB_USERS.length; i++) {
          const username = COLLABORATIVE_GITHUB_USERS[i];
          
          try {
            const userData = await getUserInfo(username);
            
            if (userData) {
              // Calculate match score based on skills and interests
              const matchScore = calculateMatchScore(userData, userSkills, userInterests);
              
              // Extract skills from bio and repositories
              const skills = extractSkills(userData);
              const interests = extractInterests(userData);
              
              const collaborator: Collaborator = {
                login: userData.login,
                name: userData.name,
                bio: userData.bio,
                avatar_url: userData.avatar_url,
                html_url: userData.html_url,
                public_repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                collaborationTypes: getCollaborationTypes(userData),
                rating: 4.0 + Math.random() * 1.0,
                projectsCompleted: userData.public_repos,
                responseRate: 85 + Math.floor(Math.random() * 15),
                matchScore,
                skills,
                interests
              };
              
              collaboratorsData.push(collaborator);
            }
            
            // Add delay between API calls to avoid rate limiting
            if (i < COLLABORATIVE_GITHUB_USERS.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay
            }
          } catch (error) {
            console.log(`Could not fetch data for ${username}:`, error);
          }
        }
        
        // Batch update all collaborators at once to prevent blinking
        setCollaborators(collaboratorsData);
        setFilteredCollaborators(collaboratorsData);
        setHasLoaded(true); // Mark as loaded
        console.log(`Successfully loaded ${collaboratorsData.length} collaborators`);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollaborators();
  }, [userSkills, userInterests, hasLoaded, collaborators.length]); // Add dependencies to prevent re-fetch

  const calculateMatchScore = (user: GitHubUser, userSkills: string[], userInterests: string[]): number => {
    let score = 50;
    
    if (user.followers > 1000) score += 20;
    else if (user.followers > 100) score += 10;
    else if (user.followers > 10) score += 5;
    
    if (user.public_repos > 100) score += 15;
    else if (user.public_repos > 50) score += 10;
    else if (user.public_repos > 10) score += 5;
    
    if (user.bio) {
      const bio = user.bio.toLowerCase();
      const collaborationKeywords = ['open source', 'collaboration', 'contributor', 'maintainer', 'community'];
      collaborationKeywords.forEach(keyword => {
        if (bio.includes(keyword)) score += 5;
      });
      
      userSkills.forEach(skill => {
        if (bio.includes(skill.toLowerCase())) score += 3;
      });
      
      userInterests.forEach(interest => {
        if (bio.includes(interest.toLowerCase())) score += 2;
      });
    }
    
    return Math.min(100, Math.max(0, score));
  };

  const extractSkills = (user: GitHubUser): string[] => {
    const skills: string[] = [];
    const bio = (user.bio || '').toLowerCase();
    
    const techKeywords = [
      'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'gatsby',
      'node', 'python', 'java', 'typescript', 'javascript', 'go', 'rust',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'vercel', 'netlify',
      'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest api',
      'tailwind', 'css', 'html', 'sass', 'webpack', 'vite', 'rollup',
      'testing', 'jest', 'cypress', 'storybook', 'design systems'
    ];
    
    techKeywords.forEach(keyword => {
      if (bio.includes(keyword)) {
        skills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    if (user.type === 'User') {
      skills.push('Open Source');
    }
    
    return skills.slice(0, 8);
  };

  const extractInterests = (user: GitHubUser): string[] => {
    const interests: string[] = [];
    const bio = (user.bio || '').toLowerCase();
    
    const interestKeywords = [
      'open source', 'developer tools', 'web development', 'mobile',
      'design', 'ux', 'ui', 'performance', 'security', 'ai', 'ml',
      'education', 'mentoring', 'community', 'startup', 'entrepreneurship',
      'blogging', 'writing', 'speaking', 'teaching', 'research'
    ];
    
    interestKeywords.forEach(keyword => {
      if (bio.includes(keyword)) {
        interests.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    return interests.slice(0, 6);
  };

  const getCollaborationTypes = (user: GitHubUser): string[] => {
    const types: string[] = [];
    const bio = (user.bio || '').toLowerCase();
    
    if (bio.includes('freelance') || bio.includes('consultant')) {
      types.push('Freelance');
    }
    if (bio.includes('mentor') || bio.includes('teaching')) {
      types.push('Mentorship');
    }
    if (bio.includes('open source') || bio.includes('contributor')) {
      types.push('Open Source');
    }
    if (user.company) {
      types.push('Full-time');
    }
    
    if (types.length === 0) {
      types.push('Open Source', 'Collaboration');
    }
    
    return types;
  };

  // Filter collaborators based on search and filters
  useEffect(() => {
    let filtered = collaborators;

    if (searchTerm) {
      filtered = filtered.filter(collaborator =>
        (collaborator.name && collaborator.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        collaborator.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collaborator.bio && collaborator.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        collaborator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(collaborator =>
        selectedSkills.some(skill => collaborator.skills.includes(skill))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'followers':
          return b.followers - a.followers;
        case 'recent':
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

    setFilteredCollaborators(filtered);
  }, [collaborators, searchTerm, selectedSkills, sortBy]);

  const allSkills = Array.from(
    new Set(collaborators.flatMap(c => c.skills))
  ).sort();

  const CollaboratorCard = ({ collaborator }: { collaborator: Collaborator }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-background border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedCollaborator(collaborator)}
    >
      <div className="flex items-start gap-4">
        <img
          src={collaborator.avatar_url}
          alt={collaborator.name || collaborator.login}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{collaborator.name || collaborator.login}</h3>
              <p className="text-sm text-muted-foreground">@{collaborator.login}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Active</span>
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
                <Briefcase className="w-3 h-3" />
                {collaborator.company}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {collaborator.followers} followers
            </div>
          </div>

          {collaborator.bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {collaborator.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {collaborator.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {collaborator.skills.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{collaborator.skills.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{collaborator.public_repos} repos</span>
              <span>{collaborator.responseRate}% response</span>
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
              <p className="text-muted-foreground">Fetching GitHub collaborators...</p>
              <p className="text-xs text-muted-foreground mt-2">
                Loading 5 top open source contributors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if no collaborators loaded and not loading
  if (!isLoading && collaborators.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="w-5 h-5" />
            GitHub Collaboration Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Unable to load GitHub collaborators.
            </p>
            <p className="text-xs text-muted-foreground">
              GitHub API may be rate limited. Check console for details.
            </p>
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
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search GitHub users, skills, or interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Skills</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.slice(0, 8).map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedSkills(prev =>
                        prev.includes(skill)
                          ? prev.filter(s => s !== skill)
                          : [...prev, skill]
                      );
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
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
                <option value="recent">Recently Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fixed height container to prevent layout shifts */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Users2 className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading collaborators...</p>
              </div>
            </div>
          ) : filteredCollaborators.length === 0 ? (
            <div className="text-center py-12">
              <Users2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No collaborators found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCollaborators.map((collaborator) => (
                <CollaboratorCard key={collaborator.login} collaborator={collaborator} />
              ))}
            </div>
          )}
        </div>

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
                      alt={selectedCollaborator.name || selectedCollaborator.login}
                      className="w-16 h-16 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{selectedCollaborator.name || selectedCollaborator.login}</h3>
                          <p className="text-muted-foreground">@{selectedCollaborator.login}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm">Active</span>
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
                            <Briefcase className="w-3 h-3" />
                            {selectedCollaborator.company}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {selectedCollaborator.followers} followers
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
                            GitHub
                          </a>
                        </Button>
                        {selectedCollaborator.blog && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedCollaborator.blog} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4" />
                              Website
                            </a>
                          </Button>
                        )}
                        {selectedCollaborator.twitter_username && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://twitter.com/${selectedCollaborator.twitter_username}`} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                              Twitter
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaborator.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaborator.interests.map((interest) => (
                          <Badge key={interest} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCollaborator.public_repos}
                        </div>
                        <div className="text-xs text-muted-foreground">Repositories</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCollaborator.followers}
                        </div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCollaborator.matchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1" asChild>
                      <a href={selectedCollaborator.html_url} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact on GitHub
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
