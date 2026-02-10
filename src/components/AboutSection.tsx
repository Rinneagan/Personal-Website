'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubUser } from '@/lib/github';
import { GitHubHeatmap } from '@/components/GitHubHeatmap';
import { CollaborationHub } from '@/components/CollaborationHub';
import { 
  User, 
  Code, 
  Target, 
  Heart, 
  Zap, 
  Rocket, 
  Lightbulb,
  Award,
  Users,
  Globe,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Copy,
  Terminal,
  Calendar,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

interface AboutSectionProps {
  user?: GitHubUser | null;
}

interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
  icon: any;
  type: 'education' | 'career' | 'achievement' | 'project';
}

export function AboutSection({ user }: AboutSectionProps) {
  // Personal journey milestones - customized for Chemical Engineering to Software Development
  const journeyMilestones: JourneyMilestone[] = [
    {
      year: '2019',
      title: 'Chemical Engineering Studies',
      description: 'Began my academic journey in Chemical Engineering, developing strong analytical and problem-solving skills.',
      icon: Code,
      type: 'education'
    },
    {
      year: '2020',
      title: 'Discovering Programming',
      description: 'Found my passion for coding while solving engineering problems through Python and MATLAB.',
      icon: Lightbulb,
      type: 'achievement'
    },
    {
      year: '2021',
      title: 'Bridging Disciplines',
      description: 'Started applying engineering principles to software development, finding beauty in both code and chemical processes.',
      icon: Zap,
      type: 'education'
    },
    {
      year: '2022',
      title: 'First Open Source Contribution',
      description: 'Contributed to scientific computing projects, combining my engineering background with coding skills.',
      icon: Github,
      type: 'achievement'
    },
    {
      year: '2023',
      title: 'Full-Stack Development',
      description: 'Expanded into comprehensive web development, mastering modern frameworks and deployment practices.',
      icon: Rocket,
      type: 'career'
    },
    {
      year: '2024',
      title: 'Engineering Meets Poetry',
      description: 'Launched GitHub portfolio showcasing my unique journey from chemical engineering to creative coding.',
      icon: Award,
      type: 'achievement'
    }
  ];

  const coreValues = [
    {
      icon: Heart,
      title: 'Passion for Learning',
      description: 'Constantly exploring new technologies and improving my skills.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Believe in the power of teamwork and open source contribution.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Love solving problems and creating elegant solutions.'
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'Committed to writing clean, maintainable, and efficient code.'
    }
  ];

  const technicalInterests = [
    'Full-Stack Development',
    'Scientific Computing',
    'Computational Chemistry',
    'Open Source',
    'Cloud Architecture',
    'UI/UX Design',
    'Performance Optimization',
    'API Development',
    'Database Design',
    'DevOps Practices',
    'Technical Writing'
  ];

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'education': return 'text-blue-500';
      case 'career': return 'text-green-500';
      case 'achievement': return 'text-yellow-500';
      case 'project': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getMilestoneBgColor = (type: string) => {
    switch (type) {
      case 'education': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'career': return 'bg-green-100 dark:bg-green-900/20';
      case 'achievement': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'project': return 'bg-purple-100 dark:bg-purple-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {user?.bio || "Chemical Engineering major with a passion for coding and poetry. " +
          "I bridge the analytical precision of engineering with the creativity of software development, " +
          "crafting elegant solutions through code while finding beauty in both algorithms and verse."}
        </p>
      </motion.div>

      {/* Personal Introduction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                My Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                I'm a Chemical Engineering major who discovered coding along the way and completely fell in love with it. 
                What started as solving engineering problems with Python and MATLAB turned into a passion for creating 
                beautiful, functional software. There's something amazing about watching code come to life—kind of like 
                watching a chemical reaction work perfectly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I love reading and writing poetry too, which I think helps me appreciate both the precision 
                and creativity needed in good code. Whether I'm debugging a function or crafting a verse, I'm looking for 
                that elegant solution that just works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My engineering background gives me a systematic approach to problem-solving, while coding lets me 
                express my creative side. Together, they create the perfect balance for building innovative 
                software solutions.
              </p>
              
              {/* Quick Info */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Based in Kumasi, Ghana</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Active since 2023</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>ebenezerkessel99@gmail.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                What Drives Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 rounded-md bg-primary/10">
                      <value.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{value.title}</h4>
                      <p className="text-xs text-muted-foreground">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Journey Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              My Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-6">
                {journeyMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full ${getMilestoneBgColor(milestone.type)} 
                      flex items-center justify-center border-2 border-background`}>
                      <milestone.icon className={`w-6 h-6 ${getMilestoneColor(milestone.type)}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {milestone.year}
                        </Badge>
                        <h3 className="font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technical Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technicalInterests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {interest}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* GitHub Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-8"
      >
        <GitHubHeatmap username="Rinneagan" />
      </motion.div>

      {/* Collaboration Hub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-8"
      >
        <CollaborationHub />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="text-center"
      >
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Let's Connect!</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology. 
              Feel free to reach out through the contact form or connect with me on social media!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <a href="#contact" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Get In Touch
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/Rinneagan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
