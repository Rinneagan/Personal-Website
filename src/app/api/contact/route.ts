// Real contact form API endpoint
import { NextRequest, NextResponse } from 'next/server';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'read' | 'replied';
}

// In-memory storage for demo (replace with database in production)
const contactMessages: ContactMessage[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    messages: contactMessages,
    count: contactMessages.length 
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Add message to storage
    contactMessages.push(newMessage);

    // In production, you would:
    // 1. Save to database
    // 2. Send notification email
    // 3. Send auto-responder to sender

    console.log('New contact message received:', newMessage);

    return NextResponse.json({ 
      success: true,
      message: 'Message received successfully',
      messageId: newMessage.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
