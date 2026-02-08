'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubRepo } from '@/lib/github';
import { Sparkles, X } from 'lucide-react';

interface UpdateNotificationProps {
  newRepos: GitHubRepo[];
  onDismiss: () => void;
  onRefresh: () => void;
}

export function UpdateNotification({ newRepos, onDismiss, onRefresh }: UpdateNotificationProps) {
  if (newRepos.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-background border border-border rounded-lg shadow-lg p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20">
                <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">New Projects Detected!</h4>
                <p className="text-xs text-muted-foreground">
                  {newRepos.length} new {newRepos.length === 1 ? 'project' : 'projects'} found
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {newRepos.slice(0, 3).map((repo) => (
              <div key={repo.id} className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-xs">
                  {repo.language || 'Unknown'}
                </Badge>
                <span className="font-medium truncate">{repo.name}</span>
                <span className="text-muted-foreground">
                  {new Date(repo.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {newRepos.length > 3 && (
              <p className="text-xs text-muted-foreground">
                ...and {newRepos.length - 3} more
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" onClick={onRefresh} className="flex-1">
              Refresh Now
            </Button>
            <Button size="sm" variant="outline" onClick={onDismiss}>
              Later
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
