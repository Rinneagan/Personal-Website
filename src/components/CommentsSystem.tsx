'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Flag, 
  Reply, 
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  projectId: string;
}

interface CommentsSystemProps {
  projectId: string;
  projectName: string;
  className?: string;
}

export function CommentsSystem({ projectId, projectName, className = '' }: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Fetch real comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?projectId=${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [projectId, projectName]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          projectName,
          author: 'Guest User',
          content: newComment.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          projectName,
          author: 'Guest User',
          content: replyContent.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh comments to get the new reply
        const commentsResponse = await fetch(`/api/comments?projectId=${projectId}`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }
        setReplyContent('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleLike = async (commentId: string, isReply: boolean = false) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          action: 'like'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the specific comment with new like count
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return data.comment;
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId ? data.comment : reply
              )
            };
          }
          return comment;
        }));

        // Show feedback if user already liked
        if (data.alreadyLiked) {
          // You could show a toast or notification here
          console.log('You already liked this comment');
        }
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default:
        return 0;
    }
  });

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-8 border-l-2 border-border pl-4' : ''}`}
    >
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback>
            {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(comment.timestamp)}
            </span>
            {comment.likes > 5 && (
              <Badge variant="secondary" className="text-xs">
                🔥 Popular
              </Badge>
            )}
          </div>
          
          <div className="text-sm mb-3 leading-relaxed">
            {comment.content}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(comment.id, isReply)}
              className="h-8 px-2 text-xs"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {comment.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              {comment.dislikes}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="h-8 px-2 text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              <Flag className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Reply Input */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <div className="flex gap-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => (
                <CommentComponent key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Comments & Discussion</span>
            <Badge variant="secondary">{comments.length}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border rounded px-2 py-1 bg-background"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Popular</option>
            </select>
            
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Comment Input */}
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this project..."
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Be respectful and constructive in your comments.
            </div>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isLoading}
              className="w-full md:w-auto"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {sortedComments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {sortedComments.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment Guidelines */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">💬 Comment Guidelines</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be respectful and constructive</li>
            <li>• Stay on topic and relevant to the project</li>
            <li>• Provide helpful feedback and suggestions</li>
            <li>• Report inappropriate content using the flag button</li>
            <li>• Engage in meaningful discussions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
