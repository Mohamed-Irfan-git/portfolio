import snapshot from './repositories.json';
export const snapshotDate = snapshot.capturedOn;
const preferred = ['tableFlow', 'Rag-System', 'help_desk', 'Nexora', 'Competitive_Programming', 'offline_file_shering_app', 'waste-management-system', 'SkillBridge'];
export function normalizeProjects(repositories) {
  return repositories.filter(r => r.owner?.login?.toLowerCase() === 'mohamed-irfan-git' && !r.fork && !r.disabled).sort((a,b) => {
    const ai = preferred.indexOf(a.name), bi = preferred.indexOf(b.name);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  }).map(r => {
    let live = null;
    try { const u = new URL(r.homepage); if (['https:', 'http:'].includes(u.protocol)) live = u.href; } catch { /* optional homepage */ }
    return { name: r.name, description: r.description || 'Explore the source code and development history in this public repository.', language: r.language || 'Source code', technologies: [...new Set([r.language, ...(r.topics || [])].filter(Boolean))], url: `https://github.com/Mohamed-Irfan-git/${encodeURIComponent(r.name)}`, live };
  });
}
export const savedProjects = normalizeProjects(snapshot.repositories);
