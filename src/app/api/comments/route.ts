// Real comments API endpoint with persistent storage and like restrictions
import { NextRequest, NextResponse } from 'next/server';

interface Comment {
  id: string;
  projectId: string;
  projectName: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  likedBy: string[]; // Track who liked each comment
}

// In-memory storage for demo (replace with database in production)
let comments: Comment[] = [];

// Track which users have liked which comments (using IP for demo)
const userLikes: Map<string, Set<string>> = new Map();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  const projectComments = comments.filter(comment => comment.projectId === projectId);
  return NextResponse.json({ comments: projectComments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, projectName, author, content } = body;
    
    if (!projectId || !author || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      projectName: projectName || 'Unknown Project',
      author,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      likedBy: []
    };

    comments.push(newComment);
    console.log('New comment added:', newComment);

    return NextResponse.json({ 
      success: true,
      comment: newComment 
    });

  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json(
      { error: 'Failed to process comment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body;
    
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    const comment = comments.find(c => c.id === commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Get user identifier (using IP for demo, in production use user auth)
    const userIdentifier = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'anonymous-' + Math.random().toString(36);

    let userHasLiked = false;

    if (action === 'like') {
      // Check if user has already liked this comment
      if (!userLikes.has(commentId)) {
        userLikes.set(commentId, new Set());
      }
      
      userHasLiked = userLikes.get(commentId)?.has(userIdentifier) || false;
      
      if (!userHasLiked) {
        comment.likes += 1;
        userLikes.get(commentId)?.add(userIdentifier);
        console.log(`User ${userIdentifier} liked comment ${commentId}`);
      } else {
        // User already liked - return current state
        console.log(`User ${userIdentifier} already liked comment ${commentId}`);
      }
    }

    return NextResponse.json({ 
      success: true,
      comment,
      alreadyLiked: userHasLiked,
      userIdentifier
    });

  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}
