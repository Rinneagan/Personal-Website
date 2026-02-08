'use client';

import { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ProjectTimeline } from '@/components/ProjectTimeline';
import { SkillsSection } from '@/components/SkillsSection';
import { ContactForm } from '@/components/ContactForm';
import { AboutSection } from '@/components/AboutSection';
import { UpdateNotification } from '@/components/UpdateNotification';
import { PageTransition, TabTransition, SectionTransition } from '@/components/PageTransition';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubUser, GitHubRepo } from '@/lib/github';
import { getUserInfo, getUserRepos } from '@/lib/github';
import { Search, Code, Clock, Award, Mail, User, RefreshCw } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [previousRepoCount, setPreviousRepoCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const username = 'Rinneagan'; // Replace with your GitHub username
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, reposData] = await Promise.all([
          getUserInfo(username),
          getUserRepos(username)
        ]);
        
        setUser(userData);
        setRepos(reposData);
        setFilteredRepos(reposData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepo(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setShowNotification(false);
    try {
      const [userData, reposData] = await Promise.all([
        getUserInfo(username),
        getUserRepos(username)
      ]);
      
      setUser(userData);
      setRepos(reposData);
      setFilteredRepos(reposData);
      setLastUpdated(new Date());
      setPreviousRepoCount(reposData.length);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [username]);

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
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating...' : 'Refresh'}
              </Button>
              <ThemeToggle />
            </div>
          </div>
          
          <SectionTransition animation="slideUp">
            {user && <ProfileHeader user={user} />}
          </SectionTransition>

          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
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
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search repositories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
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

                    <div className="text-sm text-muted-foreground">
                      {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'} found
                    </div>

                    {filteredRepos.length === 0 ? (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No repositories found matching your criteria.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          {showNotification && (
            <UpdateNotification
              newRepos={repos.slice(0, repos.length - previousRepoCount)}
              onDismiss={() => setShowNotification(false)}
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
