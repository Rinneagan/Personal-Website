'use client';

import { useState, useEffect, useRef } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ProjectTimeline } from '@/components/ProjectTimeline';
import { SkillsSection } from '@/components/SkillsSection';
import { ContactForm } from '@/components/ContactForm';
import { AboutSection } from '@/components/AboutSection';
import { MyTools } from '@/components/MyTools';
import { PageTransition, TabTransition, SectionTransition } from '@/components/PageTransition';
import { PageSEO } from '@/components/SEO';
import { SearchAutocomplete, SearchSuggestions } from '@/components/SearchAutocomplete';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubUser, GitHubRepo, getUserInfo, getUserRepos, testGitHubAPI } from '@/lib/github';
import { Search, Code, Clock, Award, Mail, User, Settings } from 'lucide-react';
import { initializeFromUrl, updateUrlState } from '@/lib/urlState';

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = 'Rinneagan'; // Replace with your GitHub username
  const [activeTab, setActiveTab] = useState('projects');
  const tabs = [
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'about', label: 'About', icon: User },
    { id: 'tools', label: 'My Tools', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];
  const dataLoadedRef = useRef(false);

  // Initialize from URL and handle URL updates
  useEffect(() => {
    const urlState = initializeFromUrl();
    
    // Set active tab from URL
    if (urlState.section) {
      setActiveTab(urlState.section);
    }
    
    // Open modal if project is specified in URL
    if (urlState.projectId && urlState.modal) {
      const repo = repos.find(r => r.name === urlState.modal);
      if (repo) {
        setSelectedRepo(repo);
        setIsModalOpen(true);
      }
    }
  }, [repos]);

  // Update URL when tab changes
  useEffect(() => {
    updateUrlState({ section: activeTab });
  }, [activeTab]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Test GitHub API first
        console.log('Testing GitHub API connectivity...');
        const apiTest = await testGitHubAPI();
        console.log('GitHub API test result:', apiTest);
        
        if (!apiTest) {
          console.error('GitHub API test failed - skipping data fetch');
          setLoading(false);
          return;
        }
        
        console.log('GitHub API test passed - fetching user data...');
        
        const [userData, reposData] = await Promise.all([
          getUserInfo(username),
          getUserRepos(username)
        ]);
        
        if (userData) {
          setUser(userData);
          dataLoadedRef.current = true;
          console.log('User data set successfully');
        } else {
          console.error('Failed to fetch user data');
        }
        
        if (reposData && reposData.length > 0) {
          setRepos(reposData);
          setFilteredRepos(reposData);
          dataLoadedRef.current = true;
          console.log('Repos data set successfully');
        } else {
          console.log('No repositories found or API error');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
    // Force loading to complete after 10 seconds if API is completely stuck
    const timeout = setTimeout(() => {
      setLoading(false);
      console.log('Loading timeout reached - API may be having issues');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [username]);

  useEffect(() => {
    let filtered = repos;

    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

    setFilteredRepos(filtered);
  }, [searchTerm, selectedLanguage, repos]);

  const languages = Array.from(
    new Set(repos.map(repo => repo.language).filter(Boolean))
  ) as string[];

  const handleViewDetails = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Code className="w-8 h-8 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSEO 
        page="Portfolio"
        title="Rinneagan - Full Stack Developer Portfolio"
        description="Explore my portfolio showcasing GitHub projects, technical skills, and development journey. Full-stack developer with expertise in React, Next.js, TypeScript, and more."
        keywords={['full stack developer', 'react developer', 'next.js', 'typescript', 'node.js', 'web development', 'portfolio', 'github']}
      />
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <SectionTransition animation="slideUp">
              {user && <ProfileHeader user={user} />}
            </SectionTransition>

            <div className="mt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-1 sm:gap-2">
                  <TabsTrigger value="about" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    My Tools
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact
                  </TabsTrigger>
                </TabsList>

                <TabTransition isActive={activeTab === 'about'}>
                  <TabsContent value="about" className="mt-6">
                    <AboutSection user={user} />
                  </TabsContent>
                </TabTransition>

                <TabTransition isActive={activeTab === 'projects'}>
                  <TabsContent value="projects" className="space-y-6 mt-6">
                    <SectionTransition animation="fadeIn">
                      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div className="flex-1 max-w-md">
                          <SearchAutocomplete
                            repos={repos}
                            onSearch={handleSearch}
                            onRepoSelect={handleViewDetails}
                            placeholder="Search repositories..."
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={selectedLanguage === null ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedLanguage(null)}
                          >
                            All
                          </Badge>
                          {languages.map((language) => (
                            <Badge
                              key={language}
                              variant={selectedLanguage === language ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedLanguage(
                                selectedLanguage === language ? null : language
                              )}
                            >
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Search Suggestions */}
                      {searchTerm === '' && repos.length > 0 && (
                        <div className="mt-4">
                          <SearchSuggestions
                            repos={repos}
                            onSuggestionClick={handleSuggestionClick}
                          />
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground mt-4">
                        {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'} found
                      </div>

                      {filteredRepos.length === 0 ? (
                        <div className="text-center py-12">
                          <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No repositories found matching your criteria.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {filteredRepos.map((repo) => (
                            <ProjectCard 
                              key={repo.id} 
                              repo={repo} 
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      )}
                    </SectionTransition>
                  </TabsContent>
                </TabTransition>

                <TabTransition isActive={activeTab === 'timeline'}>
                  <TabsContent value="timeline" className="mt-6">
                    <ProjectTimeline 
                      repos={repos} 
                      onViewDetails={handleViewDetails}
                    />
                  </TabsContent>
                </TabTransition>

                <TabTransition isActive={activeTab === 'skills'}>
                  <TabsContent value="skills" className="mt-6">
                    <SkillsSection repos={repos} />
                  </TabsContent>
                </TabTransition>
                
                <TabTransition isActive={activeTab === 'tools'}>
                  <TabsContent value="tools" className="mt-6">
                    <MyTools />
                  </TabsContent>
                </TabTransition>

                <TabTransition isActive={activeTab === 'contact'}>
                  <TabsContent value="contact" className="mt-6">
                    <ContactForm user={user} />
                  </TabsContent>
                </TabTransition>
              </Tabs>
            </div>
            
            {selectedRepo && (
              <ProjectModal
                repo={selectedRepo}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
