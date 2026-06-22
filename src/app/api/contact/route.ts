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

    // 6. SMTP/Gmail Transport Execution
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
    const host = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : undefined);
    const port = Number(process.env.SMTP_PORT) || 587;
    const to = process.env.CONTACT_EMAIL || 'ebnezer.dev@gmail.com';

    if (user && pass && (host || user.endsWith('@gmail.com'))) {
      const mailConfig: any = {
        auth: { user, pass },
      };

      if (user.endsWith('@gmail.com') && !process.env.SMTP_HOST) {
        mailConfig.service = 'gmail';
      } else {
        mailConfig.host = host;
        mailConfig.port = port;
        mailConfig.secure = port === 465;
      }

      const transporter = nodemailer.createTransport(mailConfig);

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
      
      console.log('Email sent successfully.');
    } else {
      console.warn('Mail transporter not fully configured. Defaulting to safe logging.');
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Mail delivery is not configured on this server.' }, { status: 503 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ 
      error: 'Server error', 
      details: err?.message || String(err) 
    }, { status: 500 });
  }
}
