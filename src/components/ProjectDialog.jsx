import { useEffect, useRef } from 'react';

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export default function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    if (!project || !dialog.current) return undefined;
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => closeButton.current?.focus());

    function trapFocus(event) {
      if (event.key !== 'Tab') return;
      const focusable = [...element.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter(node => node.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !element.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !element.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    element.addEventListener('keydown', trapFocus);
    return () => {
      cancelAnimationFrame(focusFrame);
      element.removeEventListener('keydown', trapFocus);
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [project]);

  if (!project) return null;
  const titleId = `case-study-title-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <dialog ref={dialog} className="project-dialog" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <article className="case-study-content">
      <header className="case-study-header"><span className="eyebrow">PROJECT / CASE STUDY</span><button ref={closeButton} type="button" className="case-study-close" onClick={onClose} aria-label="Close case study">×</button></header>
      <h2 id={titleId}>{project.title}</h2>
      {hasText(project.outcome) && <p className="case-study-outcome">{project.outcome}</p>}
      {project.status && <span className={`project-status status-${project.status}`}>{project.status.replace('-', ' ')}</span>}
      <div className="case-study-sections">
        {hasText(project.problem) && <section><h3>Problem</h3><p>{project.problem}</p></section>}
        {hasText(project.approach) && <section><h3>Approach</h3><p>{project.approach}</p></section>}
        {hasText(project.result) && <section><h3>Result</h3><p>{project.result}</p></section>}
        {hasText(project.learned) && <section><h3>Learned</h3><p>{project.learned}</p></section>}
        {project.features?.length > 0 && <section><h3>Features</h3><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}
      </div>
      {project.tech?.length > 0 && <section className="case-study-tech"><h3>Tech</h3><ul className="project-tech">{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></section>}
      {(project.github || project.live) && <nav className="case-study-links" aria-label={`${project.title} project links`}>
        {project.github && <a className="project-action" href={project.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
        {project.live && <a className="project-action is-live" href={project.live} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
      </nav>}
    </article>
  </dialog>;
}
