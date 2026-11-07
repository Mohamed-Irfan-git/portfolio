import { useRef } from 'react';
import { hasProjectCaseStudy } from '../data/projects';
import { useMedia } from '../hooks/useMedia';

export default function ProjectCard({ project, number, onCaseStudy }) {
  const card = useRef(null);
  const mobile = useMedia('(max-width: 767px)');
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  const finePointer = useMedia('(hover: hover) and (pointer: fine)');
  const canTilt = !mobile && !reducedMotion && finePointer;
  const titleId = `project-title-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const summary = project.outcome || project.description;

  function setTilt(x, y) {
    if (!canTilt || !card.current) return;
    card.current.style.setProperty('--project-tilt-x', `${x}deg`);
    card.current.style.setProperty('--project-tilt-y', `${y}deg`);
  }
  function handlePointerMove(event) {
    if (!canTilt || !card.current) return;
    const bounds = card.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    setTilt(Math.max(-4, Math.min(4, -y * 8)), Math.max(-4, Math.min(4, x * 8)));
  }

  return <article ref={card} className={`project-card${project.featured ? ' is-featured' : ''}`} aria-labelledby={titleId}
    onPointerMove={handlePointerMove} onPointerLeave={() => setTilt(0, 0)}
    onFocusCapture={() => { if (canTilt) setTilt(1.5, -1.5); }} onBlurCapture={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setTilt(0, 0);
    }}>
    <span className="project-number">PROJECT / {String(number).padStart(2, '0')}</span>
    <div className="project-card-content">
      <div className="project-card-heading"><h3 id={titleId}>{project.title}</h3>{project.status && <span className={`project-status status-${project.status}`}>{project.status.replace('-', ' ')}</span>}</div>
      {summary && <p className={`project-summary${project.outcome ? ' is-outcome' : ''}`}>{summary}</p>}
      {project.tech?.length > 0 && <ul className="project-tech" aria-label={`${project.title} technologies`}>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>}
      <div className="project-actions">
        {hasProjectCaseStudy(project) && <button type="button" className="project-action is-case-study" onClick={() => onCaseStudy(project)}>Case study <span aria-hidden="true">↗</span></button>}
        {project.github && <a className="project-action" href={project.github} target="_blank" rel="noreferrer" aria-label={`GitHub repository for ${project.title}`}>GitHub <span aria-hidden="true">↗</span></a>}
        {project.live && <a className="project-action is-live" href={project.live} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
      </div>
    </div>
  </article>;
}
