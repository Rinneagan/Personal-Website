// Real contact form API endpoint
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

// Email configuration
const emailConfig = {
  service: 'gmail', // or 'sendgrid', 'mailgun', etc.
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail app password
  },
};

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth,
});

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

    // Send email notification
    await sendEmailNotification(newMessage);

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

async function sendEmailNotification(message: ContactMessage) {
  try {
    const mailOptions = {
      from: `"${message.name}" <${emailConfig.auth.user}>`,
      to: emailConfig.auth.user, // Send to your Gmail
      subject: `New Contact Form Submission: ${message.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #ccc; padding: 10px; margin: 10px 0;">
          ${message.message.replace(/\n/g, '<br>')}
        </blockquote>
        <hr>
        <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
        <p><em>This is an automated message from your portfolio contact form.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent to:', emailConfig.auth.user);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}
