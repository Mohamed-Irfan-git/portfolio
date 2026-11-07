import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const require = createRequire(import.meta.url);
const leetcodeHandler = require('./api/leetcode.js');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, body, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders });
  res.end(JSON.stringify(body));
}

async function proxyLeetCode(res) {
  let status = 200;
  let body = null;
  const headers = {};
  let finished = false;
  const apiResponse = {
    setHeader(name, value) { headers[name] = value; return this; },
    status(code) { status = code; return this; },
    json(payload) {
      if (finished) return this;
      finished = true;
      body = payload;
      sendJson(res, status, body, headers);
      return this;
    },
  };
  try {
    await leetcodeHandler({ method: 'GET' }, apiResponse);
  } catch {
    if (!finished) sendJson(res, 502, { message: 'LeetCode stats are temporarily unavailable.' });
  }
}

async function proxyGitHub(res) {
  try {
    const response = await fetch('https://api.github.com/users/Mohamed-Irfan-git/repos?per_page=100&type=owner&sort=updated', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(9000),
    });
    res.writeHead(response.status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(await response.text());
  } catch {
    sendJson(res, 502, { message: 'GitHub is temporarily unavailable.' });
  }
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
  if (pathname === '/api/leetcode') return proxyLeetCode(res);
  if (pathname === '/api/github') return proxyGitHub(res);

  let relative;
  try {
    relative = decodeURIComponent(pathname === '/' ? 'index.html' : pathname.slice(1));
  } catch {
    res.writeHead(400);
    res.end('Bad path');
    return;
  }

  if (relative.split(/[\\/]/).some((part) => part.startsWith('.')) || /^(api|lib)(?:[\\/]|$)/.test(relative)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const filePath = resolve(root, relative);
  if (!filePath.startsWith(root + sep)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    const contents = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

const port = Number(process.env.PORT || 8000);
server.listen(port, '127.0.0.1', () => {
  console.log(`Portfolio preview: http://localhost:${port}`);
});
