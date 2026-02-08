'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitHubRepo } from '@/lib/github';
import { 
  SiJavascript, 
  SiTypescript, 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiPython, 
  SiGo, 
  SiRust, 
  SiHtml5, 
  SiCss3, 
  SiTailwindcss, 
  SiDocker, 
  SiGit, 
  SiMongodb, 
  SiPostgresql 
} from 'react-icons/si';

interface SkillsSectionProps {
  repos: GitHubRepo[];
}

interface Skill {
  name: string;
  icon: any;
  level: number;
  projects: number;
  color: string;
  bgColor: string;
}

export function SkillsSection({ repos }: SkillsSectionProps) {
  // Calculate skills based on repository languages and topics
  const calculateSkills = (repos: GitHubRepo[]): Skill[] => {
    const skillMap: Record<string, { count: number; icon: any; color: string; bgColor: string }> = {
      'JavaScript': { count: 0, icon: SiJavascript, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
      'TypeScript': { count: 0, icon: SiTypescript, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
      'React': { count: 0, icon: SiReact, color: 'text-cyan-500', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' },
      'Next.js': { count: 0, icon: SiNextdotjs, color: 'text-gray-900 dark:text-white', bgColor: 'bg-gray-100 dark:bg-gray-800' },
      'Node.js': { count: 0, icon: SiNodedotjs, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' },
      'Python': { count: 0, icon: SiPython, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
      'Go': { count: 0, icon: SiGo, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' },
      'Rust': { count: 0, icon: SiRust, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
      'HTML': { count: 0, icon: SiHtml5, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
      'CSS': { count: 0, icon: SiCss3, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
      'Tailwind CSS': { count: 0, icon: SiTailwindcss, color: 'text-cyan-500', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' },
      'Docker': { count: 0, icon: SiDocker, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
      'Git': { count: 0, icon: SiGit, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
      'MongoDB': { count: 0, icon: SiMongodb, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
      'PostgreSQL': { count: 0, icon: SiPostgresql, color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    };

    // Count languages
    repos.forEach(repo => {
      if (repo.language && skillMap[repo.language]) {
        skillMap[repo.language].count++;
      }
    });

    // Count topics
    repos.forEach(repo => {
      repo.topics.forEach(topic => {
        const normalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        if (skillMap[normalizedTopic]) {
          skillMap[normalizedTopic].count++;
        }
      });
    });

    // Convert to skills array and calculate levels
    const skills: Skill[] = Object.entries(skillMap)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        icon: data.icon,
        level: Math.min(100, (data.count / repos.length) * 100 * 3), // Scale based on usage
        projects: data.count,
        color: data.color,
        bgColor: data.bgColor
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 8); // Top 8 skills

    return skills;
  };

  const skills = calculateSkills(repos);
  const totalProjects = repos.length;

  const getSkillLevel = (level: number): string => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    if (level >= 20) return 'Beginner';
    return 'Learning';
  };

  const getSkillColor = (level: number): string => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          My technical skills calculated based on {totalProjects} GitHub projects. 
          The more projects using a technology, the higher the skill level.
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${skill.bgColor}`}>
                    <skill.icon className={`w-6 h-6 ${skill.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {getSkillLevel(skill.level)}
                      </Badge>
                      <span>{skill.projects} project{skill.projects !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="font-medium">{Math.round(skill.level)}%</span>
                  </div>
                  <Progress 
                    value={skill.level} 
                    className="h-2"
                  />
                </div>

                {/* Skill Description */}
                <div className="mt-3 text-sm text-muted-foreground">
                  {skill.level >= 80 && "Extensive experience with multiple complex projects"}
                  {skill.level >= 60 && skill.level < 80 && "Strong practical experience in production environments"}
                  {skill.level >= 40 && skill.level < 60 && "Good working knowledge and project experience"}
                  {skill.level >= 20 && skill.level < 40 && "Basic understanding and some project exposure"}
                  {skill.level < 20 && "Currently learning and exploring"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Skills Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: skills.length * 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {skills.filter(s => s.level >= 60).length}
                </div>
                <div className="text-sm text-muted-foreground">Advanced Skills</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {skills.filter(s => s.level >= 40 && s.level < 60).length}
                </div>
                <div className="text-sm text-muted-foreground">Intermediate Skills</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Average Proficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">No Skills Data Yet</h3>
          <p className="text-muted-foreground">
            Start adding projects with different technologies to see your skills calculated here.
          </p>
        </div>
      )}
    </div>
  );
}
