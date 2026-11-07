import { portfolioData } from "./portfolio-data.js";

const githubUsername = "Mohamed-Irfan-git";
const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos?per_page=100&type=owner&sort=updated`;
const conceptualArtwork = "./assets/images/connected-systems.webp";

function isAiProject(repository) {
  const metadata = [
    repository.name,
    repository.description,
    ...(repository.topics ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return /\bai\b|artificial.?intelligence|machine.?learning|\bllm\b|\brag\b|neural|computer.?vision/.test(
    metadata,
  );
}

function toPortfolioProject(repository) {
  const technologies = [
    ...new Set(
      [
        ...(Array.isArray(repository.topics) ? repository.topics : []),
        repository.language,
      ].filter((value) => typeof value === "string" && value.trim()),
    ),
  ];

  let homepage = null;
  try {
    const url = new URL(repository.homepage);
    if (url.protocol === "https:" || url.protocol === "http:")
      homepage = url.href;
  } catch {
    // GitHub allows arbitrary homepage text; only render valid web links.
  }

  return {
    title: repository.name,
    description:
      repository.description ||
      "No description has been added to this GitHub repository.",
    technologies,
    art: conceptualArtwork,
    repositoryUrl: repository.html_url,
    liveUrl: homepage,
  };
}

export async function loadGitHubProjects() {
  let repositories = null;
  let lastError = new Error("GitHub is unavailable");
  for (const endpoint of ["/api/github", githubApiUrl]) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6500);
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        lastError = new Error(`GitHub returned ${response.status}`);
        continue;
      }
      const payload = await response.json();
      if (Array.isArray(payload)) {
        repositories = payload;
        break;
      }
      lastError = new Error("GitHub returned an unexpected response");
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
    }
  }
  let source = "live";
  if (!repositories) {
    try {
      const response = await fetch("./assets/data/public-repositories.json");
      if (!response.ok) throw lastError;
      const snapshot = await response.json();
      if (!Array.isArray(snapshot.repositories)) throw lastError;
      repositories = snapshot.repositories;
      source = `snapshot:${snapshot.capturedOn}`;
    } catch {
      throw lastError;
    }
  }

  const featuredNames = [
    "tableFlow",
    "Rag-System",
    "help_desk",
    "Nexora",
    "Competitive_Programming",
    "offline_file_shering_app",
    "waste-management-system",
    "SkillBridge",
  ];
  const projects = repositories
    .filter(
      (repository) =>
        repository.owner?.login?.toLowerCase() === githubUsername.toLowerCase(),
    )
    .filter((repository) => !repository.fork && !repository.disabled)
    .sort((a, b) => {
      const aIndex = featuredNames.indexOf(a.name);
      const bIndex = featuredNames.indexOf(b.name);
      if (aIndex >= 0 || bIndex >= 0)
        return (
          (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex)
        );
      return (
        Number(isAiProject(b)) - Number(isAiProject(a)) ||
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    })
    .map(toPortfolioProject);
  projects.source = source;
  return projects;
}

export const githubProfileUrl = portfolioData.contact.github;
