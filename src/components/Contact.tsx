'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'validation-error';

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'ebenezer.k.b.essel@gmail.com',
    href: 'mailto:ebenezer.k.b.essel@gmail.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  },
  {
    label: 'GitHub',
    value: 'github.com/Rinneagan',
    href: 'https://github.com/Rinneagan',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  }
];

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Client-side payload boundary checks
    if (form.name.length > 100) {
      setStatus('validation-error');
      setErrorMsg('Name must be under 100 characters.');
      return;
    }
    if (form.email.length > 150) {
      setStatus('validation-error');
      setErrorMsg('Email must be under 150 characters.');
      return;
    }
    if (form.message.length > 5000) {
      setStatus('validation-error');
      setErrorMsg('Message must be under 5000 characters.');
      return;
    }

    // 2. Client-side email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus('validation-error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '', website: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.error || 'Submission failed.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('A network error occurred. Please try again.');
    }
  };

  return (
    <section id="contact" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Get in touch</div>
          <h2 className="section-title">Contact</h2>
        </motion.div>

        <motion.div
          className="contact-layout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <p className="contact-intro">
              Have a project in mind, want to collaborate, or just want to say hi? 
              Drop me a line directly through the form, or reach out via email.
            </p>
            <div className="contact-links">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-link"
                >
                  <span className="contact-link-icon">{link.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{link.label}</div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 500 }}>{link.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {/* Honeypot field (hidden from users, bot trap) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="form-input"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="What's on your mind?"
                className="form-textarea"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              {status === 'success' && (
                <p className="form-msg ok">Message sent — I'll be in touch soon.</p>
              )}
              {(status === 'error' || status === 'validation-error') && (
                <p className="form-msg err">{errorMsg || 'Something went wrong. Please try again.'}</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
