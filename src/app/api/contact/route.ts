import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message, website } = await req.json();

    // 1. Bot detection (honeypot check)
    if (website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // 2. Structural checks
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 3. Payload size caps (buffer overflow prevention)
    if (name.length > 100 || email.length > 150 || message.length > 5000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 400 });
    }

    // 4. Regex email syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 5. Input sanitization (strip HTML tag anchors to block injection)
    const cleanName = name.replace(/[<>]/g, '');
    const cleanEmail = email.replace(/[<>]/g, '');
    const cleanMessage = message.replace(/[<>]/g, '');

    console.log('Valid contact submission received:', {
      name: cleanName,
      email: cleanEmail,
      timestamp: new Date().toISOString(),
    });

    // 6. SMTP Transport Execution
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || 'ebnezer.dev@gmail.com';

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"${cleanName}" <${user}>`,
        replyTo: cleanEmail,
        to,
        subject: `New Portfolio Message from ${cleanName}`,
        text: cleanMessage,
        html: `<p><strong>Name:</strong> ${cleanName}</p>
               <p><strong>Email:</strong> ${cleanEmail}</p>
               <p><strong>Message:</strong></p>
               <p>${cleanMessage.replace(/\n/g, '<br>')}</p>`,
      });
      
      console.log('Email sent successfully through SMTP.');
    } else {
      console.log('SMTP not fully configured. Defaulting to safe logging.');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
