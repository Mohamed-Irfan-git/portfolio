import { useEffect, useRef } from 'react';
export default function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!project) return;
    const element = dialog.current;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [project]);
  if (!project) return null;
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="dialog-inner"><button className="close-button" onClick={onClose} aria-label="Close project">×</button><span className="eyebrow">PROJECT FILE / {project.language}</span><div className="dialog-code" aria-hidden="true">{'{'}<span>{project.name.slice(0,2).toUpperCase()}</span>{'}'}</div><h2 id="project-dialog-title">{project.name.replaceAll('_', ' ')}</h2><p>{project.description}</p><div className="tags">{project.technologies.map(t=><span key={t}>{t}</span>)}</div><div className="actions"><a className="button primary" href={project.url} target="_blank" rel="noreferrer">View source <span>↗</span></a>{project.live && <a className="button secondary" href={project.live} target="_blank" rel="noreferrer">Live project ↗</a>}</div><p className="fine-print">Project information from the public GitHub repository. The gallery visual is an illustration, not an application screenshot.</p></div>
  </dialog>;
}
