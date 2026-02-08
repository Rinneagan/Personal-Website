'use client';

import { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ProjectTimeline } from '@/components/ProjectTimeline';
import { SkillsSection } from '@/components/SkillsSection';
import { ContactForm } from '@/components/ContactForm';
import { DeploymentSection } from '@/components/DeploymentSection';
import { CollaborationSection } from '@/components/CollaborationSection';
import { PageTransition, TabTransition, SectionTransition } from '@/components/PageTransition';
import { SEOHead, PageSEO } from '@/components/SEOHead';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubUser, GitHubRepo, getUserInfo, getUserRepos } from '@/lib/github';
import { Search, Code, Clock, Award, Mail, User } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = 'Rinneagan';

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, reposData] = await Promise.all([
          getUserInfo(username),
          getUserRepos(username)
        ]);
        
        if (userData) {
          setUser(userData);
        }
        
        if (reposData && reposData.length > 0) {
          setRepos(reposData);
          setFilteredRepos(reposData);
        }
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
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

    setFilteredRepos(filtered);
  }, [repos, searchTerm, selectedLanguage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead />
      <PageTransition>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ProfileHeader user={user} />
          
          <Tabs value="projects" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="deployment">Deploy</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            <TabTransition value="projects">
              <TabsContent value="projects" className="space-y-6">
                <SectionTransition>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Code className="w-8 h-8 mx-auto mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading projects...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRepos.map((repo) => (
                          <ProjectCard
                            key={repo.id}
                            repo={repo}
                            onClick={() => {
                              setSelectedRepo(repo);
                              setIsModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                      {filteredRepos.length === 0 && (
                        <div className="text-center py-12">
                          <Code className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No projects found matching your criteria.</p>
                        </div>
                      )}
                    </>
                  )}
                </SectionTransition>
              </TabsContent>

              <TabsContent value="timeline">
                <SectionTransition>
                  <ProjectTimeline repos={repos} />
                </SectionTransition>
              </TabsContent>

              <TabsContent value="skills">
                <SectionTransition>
                  <SkillsSection />
                </SectionTransition>
              </TabsContent>

              <TabsContent value="contact">
                <SectionTransition>
                  <ContactForm />
                </SectionTransition>
              </TabsContent>

              <TabsContent value="deployment">
                <SectionTransition>
                  <DeploymentSection />
                </SectionTransition>
              </TabsContent>

              <TabsContent value="collaboration">
                <SectionTransition>
                  <CollaborationSection />
                </SectionTransition>
              </TabsContent>
            </TabTransition>
          </Tabs>

          <ProjectModal
            repo={selectedRepo}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </PageTransition>
      <PageSEO />
    </div>
  );
}
