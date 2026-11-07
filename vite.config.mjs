import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import leetcode from './api/leetcode.js';
import github from './api/github.js';
function portfolioApi() {
  const middleware = (server) => { server.middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0];
    const handler = path === '/api/leetcode' ? leetcode : path === '/api/github' ? github : null;
    if (!handler) return next();
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (body) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); return res; };
    handler(req, res).catch(() => res.status(502).json({ message: 'Service unavailable' }));
  }); };
  return { name: 'portfolio-api', configureServer: middleware, configurePreviewServer: middleware };
}
export default defineConfig({ plugins: [react(), portfolioApi()], build: { rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules/three/') || id.includes('@react-three') || id.includes('three-stdlib')) return 'three-scene'; } } } } });
