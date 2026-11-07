import { initializeInteractions } from "./interactions.js";
import { loadGitHubProjects } from "./github-projects.js";
import { initializePortfolioBot } from "./portfolio-bot.js";
import { initializeScrollExperience } from "./scroll-experience.js";
import { loadLeetCodePerformance } from "./leetcode-performance.js";

const renderProjects = initializeInteractions();
initializePortfolioBot();
initializeScrollExperience();

loadGitHubProjects()
  .then((projects) =>
    renderProjects(
      projects,
      projects.length ? projects.source || "ready" : "empty",
    ),
  )
  .catch(() => renderProjects(null, "error"));

loadLeetCodePerformance();
