import { useEffect, useRef, useState } from 'react';

const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();

export default function ContactForm({ email, onSent }) {
  const terminalRef = useRef(null);
  const [typingStarted, setTypingStarted] = useState(false);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });

  useEffect(() => {
    const element = terminalRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setTypingStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTypingStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!endpoint) {
      setStatus({ kind: 'unconfigured', message: 'Form delivery is not configured yet.' });
      return;
    }

    const form = event.currentTarget;
    setStatus({ kind: 'sending', message: 'Sending your message…' });
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let message = 'Your message could not be sent. Please try again or email me directly.';
        try {
          const result = await response.json();
          const errors = result.errors?.map(error => error.message).filter(Boolean);
          if (errors?.length) message = errors.join(' ');
        } catch {
          // Keep the clear fallback message if the provider did not return JSON.
        }
        setStatus({ kind: 'error', message });
        return;
      }

      form.reset();
      setStatus({ kind: 'success', message: 'Message sent. Thanks for reaching out.' });
      onSent?.();
    } catch {
      setStatus({ kind: 'error', message: 'Connection failed. Please try again or email me directly.' });
    }
  }

  const statusMessage = status.message || (!endpoint
    ? <>Add <code>VITE_FORMSPREE_ENDPOINT</code> to <code>.env.local</code> to enable delivery. You can <a href={`mailto:${email}`}>email me directly</a> for now.</>
    : 'Your message will be sent securely through Formspree.');

  return (
    <div className={`contact-workbench${typingStarted ? ' is-active' : ''}`}>
      <div className="contact-terminal" ref={terminalRef} aria-label="Terminal prompt: say hello">
        <div className="contact-terminal-bar"><span/><span/><span/> <small>MIM IRFAN / SIGNAL</small></div>
        <p className="contact-terminal-label">CONNECTION OPEN</p>
        <p className="contact-terminal-command"><span>&gt; say hello</span><i>_</i></p>
        <p className="contact-terminal-caption">A direct line to the developer.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-heading">
          <span className="eyebrow">SEND A MESSAGE</span>
          <p>Have an idea, an opportunity, or a problem worth solving?</p>
        </div>
        <label className="contact-field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" maxLength="120" required/>
        </label>
        <label className="contact-field">
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" maxLength="254" required/>
        </label>
        <label className="contact-field">
          <span>Message</span>
          <textarea name="message" rows="4" maxLength="5000" required/>
        </label>
        <input type="hidden" name="_subject" value="New portfolio contact message"/>
        <div className="contact-form-footer">
          <p className={`contact-form-status is-${status.kind}`} role="status" aria-live="polite">{statusMessage}</p>
          <button className="button primary contact-submit" type="submit" disabled={!endpoint || status.kind === 'sending'}>
            {status.kind === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </div>
  );
}
