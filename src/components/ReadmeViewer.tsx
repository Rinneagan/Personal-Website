'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { getReadmeForRepo, parseMarkdown, ReadmeContent } from '@/lib/readme';
import { GitHubRepo } from '@/lib/github';

interface ReadmeViewerProps {
  repo: GitHubRepo;
}

export function ReadmeViewer({ repo }: ReadmeViewerProps) {
  const [readme, setReadme] = useState<ReadmeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReadme() {
      try {
        setLoading(true);
        setError(null);
        const readmeData = await getReadmeForRepo(repo);
        setReadme(readmeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load README');
      } finally {
        setLoading(false);
      }
    }

    if (repo) {
      loadReadme();
    }
  }, [repo]);

  const downloadReadme = () => {
    if (readme) {
      const blob = new Blob([readme.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repo.name}-README.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 animate-pulse" />
          <span className="text-muted-foreground">Loading README...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load README</h3>
        <p className="text-muted-foreground text-center mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!readme) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* README Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-semibold">README.md</h3>
          {readme.isGenerated && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Generated
            </Badge>
          )}
          {!readme.isGenerated && (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Original
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadReadme}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://github.com/${repo.owner.login}/${repo.name}/blob/main/README.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* README Status Message */}
      {readme.isGenerated && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Auto-Generated README
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                This repository doesn't have a README file. We've generated a comprehensive one based on the repository information. 
                Consider adding a custom README to better describe your project.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* README Content */}
      <div className="h-[60vh] w-full border rounded-lg overflow-y-auto">
        <div className="p-6">
          <div 
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: parseMarkdown(readme.content) 
            }}
          />
        </div>
      </div>

      {/* README Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
        <div>
          {readme.exists ? (
            <span>Original README from repository</span>
          ) : (
            <span>Auto-generated comprehensive README</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{readme.content.length} characters</span>
          <span>{readme.content.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}
