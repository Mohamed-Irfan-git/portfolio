// server.js — run with: node server.js
// Reads GITHUB_TOKEN from .env.local and proxies GitHub API requests

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// ── Load .env.local ──────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.warn("⚠  .env.local not found — GITHUB_TOKEN will be undefined");
    return;
  }
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = val;
  }
}

loadEnv();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PORT = process.env.PORT || 3001;

if (!GITHUB_TOKEN) {
  console.error("❌  GITHUB_TOKEN is missing. Add it to .env.local:\n   GITHUB_TOKEN=ghp_yourtoken");
  process.exit(1);
}

// ── GitHub fetch helper ───────────────────────────────────────────
function githubFetch(apiPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: apiPath,
      method: "GET",
      headers: {
        "User-Agent": "portfolio-proxy/1.0",
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          reject(new Error("Invalid JSON from GitHub"));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// ── Static file server ────────────────────────────────────────────
const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".json": "application/json",
  ".webp": "image/webp",
};

function serveStatic(req, res) {
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

// ── HTTP server ───────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS — allow browser requests from any local origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── API: /api/github  — returns all public repos ──────────────
  if (req.url === "/api/github" || req.url === "/api/github/") {
    try {
      const GH_USER = process.env.GITHUB_USER || "Mohamed-Irfan-git";
      const { status, body } = await githubFetch(
        `/users/${GH_USER}/repos?per_page=100&sort=updated`
      );

      if (status !== 200) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: body.message || "GitHub error" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: err.message }));
    }
    return;
  }

  // ── Static files (index.html, portfolio.png, etc.) ────────────
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`✅  Portfolio running at http://localhost:${PORT}`);
  console.log(`🔑  GitHub token loaded: ${GITHUB_TOKEN.slice(0, 8)}...`);
});