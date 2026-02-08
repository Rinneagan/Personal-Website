'use client';

import { 
  SiJavascript, 
  SiTypescript, 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiPython, 
  SiGo, 
  SiRust, 
  SiCplusplus, 
  SiHtml5, 
  SiCss3, 
  SiTailwindcss, 
  SiBootstrap, 
  SiMongodb, 
  SiPostgresql, 
  SiMysql, 
  SiRedis, 
  SiDocker, 
  SiKubernetes, 
  SiGit, 
  SiGithub, 
  SiFigma, 
  SiVercel, 
  SiNetlify, 
  SiHeroku,
  SiAmazon,
  SiGooglecloud,
  SiFirebase,
  SiSupabase,
  SiPrisma,
  SiGraphql,
  SiRedux,
  SiWebpack,
  SiVite,
  SiJest,
  SiCypress,
  SiStorybook,
  SiSass,
  SiLinux,
  SiApple,
  SiAndroid,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiRuby,
  SiPhp,
  SiLaravel,
  SiDjango,
  SiFlask,
  SiExpress,
  SiNestjs,
  SiAngular,
  SiV,
  SiSvelte,
  SiSolidity,
  SiEthereum,
  SiTensorflow,
  SiPytorch,
  SiJupyter,
  SiTableau,
  SiSlack,
  SiDiscord,
  SiNotion,
  SiTrello,
  SiJira,
  SiLinkedin,
  SiX,
  SiYoutube,
  SiInstagram,
  SiFacebook,
  SiTiktok
} from 'react-icons/si';

interface TechStackIconsProps {
  language: string | null;
  topics: string[];
  className?: string;
}

const techIconMap: Record<string, any> = {
  // Languages
  'javascript': SiJavascript,
  'typescript': SiTypescript,
  'python': SiPython,
  'go': SiGo,
  'rust': SiRust,
  'c++': SiCplusplus,
  'html': SiHtml5,
  'css': SiCss3,
  'scss': SiSass,
  'ruby': SiRuby,
  'php': SiPhp,
  'swift': SiSwift,
  'kotlin': SiKotlin,
  'dart': SiFlutter,
  'solidity': SiSolidity,
  
  // Frontend Frameworks
  'react': SiReact,
  'nextjs': SiNextdotjs,
  'next.js': SiNextdotjs,
  'vue': SiV,
  'vuejs': SiV,
  'angular': SiAngular,
  'svelte': SiSvelte,
  'redux': SiRedux,
  
  // Backend Frameworks
  'node': SiNodedotjs,
  'nodejs': SiNodedotjs,
  'express': SiExpress,
  'nestjs': SiNestjs,
  'django': SiDjango,
  'flask': SiFlask,
  'laravel': SiLaravel,
  
  // CSS Frameworks
  'tailwind': SiTailwindcss,
  'tailwindcss': SiTailwindcss,
  'bootstrap': SiBootstrap,
  
  // Databases
  'mongodb': SiMongodb,
  'postgresql': SiPostgresql,
  'mysql': SiMysql,
  'redis': SiRedis,
  'prisma': SiPrisma,
  'supabase': SiSupabase,
  'firebase': SiFirebase,
  
  // DevOps & Cloud
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'aws': SiAmazon,
  'amazonaws': SiAmazon,
  'gcp': SiGooglecloud,
  'googlecloud': SiGooglecloud,
  'vercel': SiVercel,
  'netlify': SiNetlify,
  'heroku': SiHeroku,
  
  // Tools & Technologies
  'git': SiGit,
  'github': SiGithub,
  'graphql': SiGraphql,
  'webpack': SiWebpack,
  'vite': SiVite,
  'jest': SiJest,
  'cypress': SiCypress,
  'storybook': SiStorybook,
  
  // ML/AI
  'tensorflow': SiTensorflow,
  'pytorch': SiPytorch,
  'jupyter': SiJupyter,
  
  // Other
  'figma': SiFigma,
  'linux': SiLinux,
  'apple': SiApple,
  'android': SiAndroid,
  'ios': SiApple,
  'flutter': SiFlutter,
  'ethereum': SiEthereum,
  'blockchain': SiEthereum,
};

const getIconForTech = (tech: string) => {
  const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  return techIconMap[normalizedTech] || null;
};

const getTechColor = (tech: string): string => {
  const colorMap: Record<string, string> = {
    'javascript': 'text-yellow-500',
    'typescript': 'text-blue-500',
    'react': 'text-cyan-500',
    'nextjs': 'text-gray-900 dark:text-white',
    'next.js': 'text-gray-900 dark:text-white',
    'node': 'text-green-600',
    'nodejs': 'text-green-600',
    'python': 'text-blue-600',
    'java': 'text-orange-500',
    'go': 'text-cyan-600',
    'rust': 'text-orange-600',
    'html': 'text-orange-500',
    'css': 'text-blue-500',
    'scss': 'text-pink-500',
    'tailwind': 'text-cyan-500',
    'tailwindcss': 'text-cyan-500',
    'bootstrap': 'text-purple-600',
    'mongodb': 'text-green-500',
    'postgresql': 'text-blue-700',
    'mysql': 'text-blue-500',
    'redis': 'text-red-600',
    'docker': 'text-blue-600',
    'kubernetes': 'text-blue-500',
    'aws': 'text-orange-500',
    'amazonaws': 'text-orange-500',
    'gcp': 'text-blue-500',
    'googlecloud': 'text-blue-500',
    'vercel': 'text-gray-900 dark:text-white',
    'netlify': 'text-cyan-500',
    'heroku': 'text-purple-600',
    'git': 'text-orange-600',
    'github': 'text-gray-900 dark:text-white',
    'graphql': 'text-pink-500',
    'webpack': 'text-blue-500',
    'vite': 'text-purple-500',
    'jest': 'text-red-500',
    'cypress': 'text-cyan-600',
    'storybook': 'text-pink-500',
    'figma': 'text-purple-500',
    'vscode': 'text-blue-500',
    'linux': 'text-gray-700 dark:text-gray-300',
    'windows': 'text-blue-500',
    'apple': 'text-gray-800 dark:text-gray-200',
    'android': 'text-green-600',
    'flutter': 'text-blue-400',
    'swift': 'text-orange-600',
    'kotlin': 'text-purple-600',
    'ruby': 'text-red-600',
    'php': 'text-purple-600',
    'laravel': 'text-red-600',
    'django': 'text-green-600',
    'flask': 'text-gray-800 dark:text-gray-200',
    'express': 'text-gray-800 dark:text-gray-200',
    'nestjs': 'text-red-600',
    'angular': 'text-red-600',
    'vue': 'text-green-500',
    'vuejs': 'text-green-500',
    'svelte': 'text-orange-600',
    'solidity': 'text-gray-800 dark:text-gray-200',
    'ethereum': 'text-gray-800 dark:text-gray-200',
    'tensorflow': 'text-orange-500',
    'pytorch': 'text-red-600',
    'jupyter': 'text-orange-600',
    'prisma': 'text-gray-800 dark:text-gray-200',
    'supabase': 'text-green-600',
    'firebase': 'text-yellow-500',
  };
  
  const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  return colorMap[normalizedTech] || 'text-gray-500';
};

export function TechStackIcons({ language, topics, className = '' }: TechStackIconsProps) {
  const techStack = new Set<string>();
  
  // Add primary language
  if (language) {
    techStack.add(language);
  }
  
  // Add relevant topics that match known technologies
  topics.forEach(topic => {
    const icon = getIconForTech(topic);
    if (icon) {
      techStack.add(topic);
    }
  });
  
  const techArray = Array.from(techStack).slice(0, 6); // Limit to 6 icons
  
  if (techArray.length === 0) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {techArray.map((tech, index) => {
        const IconComponent = getIconForTech(tech);
        if (!IconComponent) return null;
        
        return (
          <div
            key={`${tech}-${index}`}
            className={`relative group`}
            title={tech}
          >
            <IconComponent 
              className={`w-5 h-5 ${getTechColor(tech)} transition-transform group-hover:scale-110`}
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {tech}
            </div>
          </div>
        );
      })}
    </div>
  );
}
