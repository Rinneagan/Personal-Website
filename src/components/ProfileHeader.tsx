'use client';

import { GitHubUser } from '@/lib/github';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Users, User, GitFork } from 'lucide-react';

interface ProfileHeaderProps {
  user: GitHubUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-card rounded-lg border">
      <Avatar className="w-24 h-24 md:w-32 md:h-32">
        <AvatarImage src={user.avatar_url} alt={user.login} />
        <AvatarFallback className="text-2xl">
          {user.login.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">
            {user.name || user.login}
          </h1>
          <Badge variant="secondary" className="w-fit">
            @{user.login}
          </Badge>
        </div>
        
        {user.bio && (
          <p className="text-muted-foreground mb-4 max-w-2xl">
            {user.bio}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 justify-center md:justify-start">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-medium">{user.followers}</span>
            <span>followers</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">{user.following}</span>
            <span>following</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span className="font-medium">{user.public_repos}</span>
            <span>repositories</span>
          </div>
        </div>
        
        <Button asChild size="sm">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
