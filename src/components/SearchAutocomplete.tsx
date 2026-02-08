'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { GitHubRepo } from '@/lib/github';
import { Search, Code, Calendar, Star, GitFork } from 'lucide-react';

interface SearchAutocompleteProps {
  repos: GitHubRepo[];
  onSearch: (query: string) => void;
  onRepoSelect?: (repo: GitHubRepo) => void;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({ 
  repos, 
  onSearch, 
  onRepoSelect, 
  placeholder = "Search repositories...",
  className = ''
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredRepos([]);
      return;
    }

    const filtered = repos.filter(repo => 
      repo.name.toLowerCase().includes(query.toLowerCase()) ||
      repo.description?.toLowerCase().includes(query.toLowerCase()) ||
      repo.language?.toLowerCase().includes(query.toLowerCase()) ||
      repo.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8); // Limit to 8 results

    setFilteredRepos(filtered);
  }, [query, repos]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch(value);
    setIsOpen(true);
  };

  const handleRepoClick = (repo: GitHubRepo) => {
    setQuery(repo.name);
    onSearch(repo.name);
    setIsOpen(false);
    onRepoSelect?.(repo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.trim() !== '' || filteredRepos.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-input rounded-md shadow-lg max-h-80 overflow-hidden"
          >
            <Command className="w-full">
              <CommandList className="max-h-80">
                {filteredRepos.length === 0 ? (
                  <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                    No repositories found.
                  </CommandEmpty>
                ) : (
                  <CommandGroup heading="Repositories">
                    {filteredRepos.map((repo) => (
                      <CommandItem
                        key={repo.id}
                        onSelect={() => handleRepoClick(repo)}
                        className="p-3 cursor-pointer hover:bg-accent"
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="flex-shrink-0">
                            <Code className="w-4 h-4 text-muted-foreground mt-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">{repo.name}</span>
                              {repo.language && (
                                <Badge variant="secondary" className="text-xs">
                                  {repo.language}
                                </Badge>
                              )}
                            </div>
                            
                            {repo.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {repo.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(repo.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="w-3 h-3" />
                                <span>{repo.forks_count}</span>
                              </div>
                            </div>

                            {repo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {repo.topics.slice(0, 3).map((topic) => (
                                  <Badge key={topic} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                                {repo.topics.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{repo.topics.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Popular search suggestions component
export function SearchSuggestions({ 
  repos, 
  onSuggestionClick 
}: { 
  repos: GitHubRepo[];
  onSuggestionClick: (suggestion: string) => void;
}) {
  const languages = Array.from(
    new Set(repos.map(repo => repo.language).filter(Boolean))
  ).sort();

  const popularTopics = Array.from(
    new Set(repos.flatMap(repo => repo.topics))
  ).slice(0, 10);

  return (
    <div className="space-y-4">
      {languages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Popular Languages</h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <Badge
                key={language}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onSuggestionClick(language || '')}
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {popularTopics.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Popular Topics</h4>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onSuggestionClick(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
