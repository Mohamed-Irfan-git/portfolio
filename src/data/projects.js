import snapshot from './repositories.json';
export const snapshotDate = snapshot.capturedOn;
const preferred = ['tableFlow', 'Rag-System', 'help_desk', 'Nexora'];
export function normalizeProjects(repositories) {
  return repositories.filter(r => r.owner?.login?.toLowerCase() === 'mohamed-irfan-git' && !r.fork && !r.disabled).sort((a,b) => {
    const ai = preferred.indexOf(a.name), bi = preferred.indexOf(b.name);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  }).map(r => {
    let live = null;
    try { const u = new URL(r.homepage); if (['https:', 'http:'].includes(u.protocol)) live = u.href; } catch { /* optional homepage */ }
    const github = `https://github.com/Mohamed-Irfan-git/${encodeURIComponent(r.name)}`;
    const tech = [...new Set([r.language, ...(r.topics || [])].filter(Boolean))];
    return { name: r.name, title: r.name.replaceAll('_', ' '), description: r.description || null, language: r.language || null, tech, technologies: tech, github, url: github, live };
  });
}

const present = value => Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim().length > 0 : value != null;
export function hasProjectCaseStudy(project) {
  return ['problem', 'approach', 'result', 'learned'].some(field => present(project?.[field])) || (project?.features?.length ?? 0) > 0;
}

function missingFields(project) {
  const missing = [];
  if (!present(project.outcome)) missing.push('outcome');
  if (!['completed', 'in-progress', 'prototype'].includes(project.status)) missing.push('status');
  if (!project.tech?.length) missing.push('tech');
  if (!project.preview?.type) missing.push('preview.type');
  if (!present(project.preview?.src)) missing.push('preview.src');
  if (!project.features?.length) missing.push('features');
  for (const field of ['problem', 'approach', 'result', 'learned']) if (!present(project[field])) missing.push(field);
  if (typeof project.featured !== 'boolean') missing.push('featured');
  if (!present(project.github)) missing.push('github');
  if (!present(project.live)) missing.push('live');
  return missing;
}

export function mergeProjectData(feedProjects, manualProjects = [], { includeAllFeed = false } = {}) {
  const feedByName = new Map(feedProjects.map(project => [project.name, project]));
  const manualByName = new Map(manualProjects.map(project => [project.name, project]));
  // Curated HTML cards stay limited; the optional full list feeds the 3D gallery.
  const names = includeAllFeed || !manualProjects.length
    ? [...feedByName.keys(), ...[...manualByName.keys()].filter(name => !feedByName.has(name))]
    : [...manualByName.keys()];

  return names.map((name, order) => {
    const feed = feedByName.get(name) || {};
    const manual = manualByName.get(name) || {};
    const tech = [...new Set([...(feed.tech || feed.technologies || []), ...(manual.tech || [])].filter(Boolean))];
    const github = manual.github || feed.github || feed.url || null;
    const project = {
      ...feed,
      ...manual,
      name,
      title: manual.title || feed.title || name.replaceAll('_', ' '),
      description: manual.description ?? feed.description ?? null,
      outcome: manual.outcome ?? null,
      status: manual.status ?? null,
      tech,
      technologies: tech,
      preview: manual.preview ?? null,
      features: manual.features || [],
      problem: manual.problem ?? null,
      approach: manual.approach ?? null,
      result: manual.result ?? null,
      learned: manual.learned ?? null,
      featured: typeof manual.featured === 'boolean' ? manual.featured : false,
      github,
      url: feed.url || github,
      live: manual.live || feed.live || null,
      todo: [],
    };
    project.todo = missingFields(project);
    return { project, order };
  }).sort((a, b) => Number(b.project.featured) - Number(a.project.featured) || a.order - b.order).map(entry => entry.project);
}

export const savedProjects = normalizeProjects(snapshot.repositories);
