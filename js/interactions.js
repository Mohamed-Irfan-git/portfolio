import { portfolioData } from "./portfolio-data.js";

const select = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];

function renderSkillClusters() {
  const root = select("#skill-ecosystem");
  if (!root) return;
  portfolioData.skillGroups.forEach((group, index) => {
    const section = document.createElement("section");
    section.className = "skill-cluster";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cluster-button";
    button.setAttribute("aria-expanded", String(index === 0));
    button.setAttribute("aria-controls", `skill-details-${group.id}`);
    const number = Object.assign(document.createElement("span"), {
      className: "cluster-number",
      textContent: String(index + 1).padStart(2, "0"),
    });
    const title = Object.assign(document.createElement("span"), {
      className: "cluster-title",
      textContent: group.title,
    });
    const indicator = Object.assign(document.createElement("span"), {
      className: "cluster-indicator",
      textContent: index === 0 ? "−" : "+",
    });
    indicator.setAttribute("aria-hidden", "true");
    button.append(number, title, indicator);
    const skills = document.createElement("div");
    skills.className = "cluster-skills";
    skills.id = `skill-details-${group.id}`;
    skills.hidden = index !== 0;
    group.skills.forEach((skill) =>
      skills.append(
        Object.assign(document.createElement("span"), {
          className: "skill-chip",
          textContent: skill,
        }),
      ),
    );
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      skills.hidden = !expanded;
      indicator.textContent = expanded ? "−" : "+";
    });
    section.append(button, skills);
    root.append(section);
  });
}

function renderArchitectureDiagram() {
  const root = select("#architecture-diagram");
  const caption = select("#architecture-caption");
  if (!root || !caption) return;
  portfolioData.architecture.forEach((node, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "architecture-node";
    button.setAttribute("aria-pressed", "false");
    button.append(
      Object.assign(document.createElement("span"), {
        textContent: String(index + 1).padStart(2, "0"),
      }),
      document.createTextNode(node.label),
    );
    button.addEventListener("click", () => {
      root
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      caption.textContent = node.description;
    });
    root.append(button);
  });
}

function renderProjects(projects = null, state = "loading") {
  const selector = select("#project-selector");
  const title = select("#projects-title");
  const description = select("#project-description");
  const tags = select("#project-technologies");
  const count = select("#project-count");
  const progress = select("#project-progress");
  const art = select("#project-art");
  const configuredLinks = select("#project-configured-links");
  const visual = select(".project-visual");
  const status = select("#project-status");
  if (!selector || !title || !description || !tags || !art) return;

  const availableProjects = Array.isArray(projects) ? projects : [];
  let currentIndex = 0;
  selector.replaceChildren();
  selector.setAttribute("aria-busy", String(state === "loading"));

  const setStatus = (message, linkLabel = "", href = "") => {
    if (!status) return;
    status.replaceChildren(document.createTextNode(message));
    if (linkLabel && href) {
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${linkLabel} ↗`;
      status.append(" ", link);
    }
  };

  function showProject(index) {
    if (!availableProjects.length) return;
    currentIndex =
      (index + availableProjects.length) % availableProjects.length;
    const project = availableProjects[currentIndex];
    title.textContent = project.title;
    description.textContent = project.description;
    count.replaceChildren(
      document.createTextNode(String(currentIndex + 1).padStart(2, "0") + " "),
      Object.assign(document.createElement("span"), { textContent: "/" }),
      document.createTextNode(
        " " + String(availableProjects.length).padStart(2, "0"),
      ),
    );
    tags.replaceChildren();
    project.technologies.forEach((technology) => {
      const tag = document.createElement("li");
      tag.textContent = technology;
      tags.append(tag);
    });
    configuredLinks?.replaceChildren();
    [
      { label: "Repository", href: project.repositoryUrl },
      { label: "Live demo", href: project.liveUrl },
    ]
      .filter((item) => item.href)
      .forEach((item) => {
        const link = document.createElement("a");
        link.className = "text-link";
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `${item.label} ↗`;
        configuredLinks?.append(link);
      });
    [...selector.children].forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === currentIndex));
    });
    if (visual) visual.classList.add("is-switching");
    art.onload = () => visual?.classList.remove("is-switching");
    art.onerror = () => {
      visual?.classList.remove("is-switching");
      visual?.classList.add("art-unavailable");
    };
    visual?.classList.remove("art-unavailable");
    art.src = project.art;
    if (art.complete) visual?.classList.remove("is-switching");
    progress?.style.setProperty(
      "width",
      `${((currentIndex + 1) / availableProjects.length) * 100}%`,
    );
  }

  availableProjects.forEach((project, index) => {
    const button = document.createElement("button");
    button.className = "project-choice";
    button.type = "button";
    button.dataset.project = String(index);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Show ${project.title}`);
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "project-choice-title";
    label.textContent = project.title;
    button.append(number, label);
    button.addEventListener("click", () => showProject(index));
    selector.append(button);
  });

  const previous = select("#project-prev");
  const next = select("#project-next");
  if (previous) previous.disabled = !availableProjects.length;
  if (next) next.disabled = !availableProjects.length;
  if (previous) previous.onclick = () => showProject(currentIndex - 1);
  if (next) next.onclick = () => showProject(currentIndex + 1);
  selector.onkeydown = (event) => {
    if (event.key === "ArrowRight" && availableProjects.length) {
      event.preventDefault();
      showProject(currentIndex + 1);
      selector.children[currentIndex]?.focus();
    }
    if (event.key === "ArrowLeft" && availableProjects.length) {
      event.preventDefault();
      showProject(currentIndex - 1);
      selector.children[currentIndex]?.focus();
    }
  };

  if (availableProjects.length) {
    setStatus(
      state.startsWith("snapshot:")
        ? `Showing ${availableProjects.length} public repositories saved on ${state.split(":")[1]}. Live GitHub is temporarily unavailable.`
        : `${availableProjects.length} public ${availableProjects.length === 1 ? "repository" : "repositories"} from GitHub.`,
    );
    showProject(0);
  } else {
    count.replaceChildren(
      document.createTextNode("-- "),
      Object.assign(document.createElement("span"), { textContent: "/" }),
      document.createTextNode(" --"),
    );
    tags.replaceChildren();
    configuredLinks?.replaceChildren();
    progress?.style.setProperty("width", "0%");
    if (state === "error") {
      title.textContent = "Explore the source.";
      description.textContent =
        "My projects and experiments live on GitHub. The live feed is taking a break — you can still explore every repository directly.";
      setStatus(
        "See the public repositories on GitHub instead:",
        "Open GitHub profile",
        portfolioData.contact.github,
      );
    } else if (state === "empty") {
      title.textContent = "No public projects yet";
      description.textContent =
        "No public repositories were returned for this GitHub account.";
      setStatus(
        "Browse the GitHub profile for the latest updates:",
        "Open GitHub profile",
        portfolioData.contact.github,
      );
    } else {
      title.textContent = "Loading repositories";
      description.textContent =
        "Fetching the latest public projects from GitHub.";
      setStatus("Connecting to GitHub…");
    }
  }
}

function renderContactLinks() {
  const root = select("#contact-links");
  if (!root) return;
  const links = [
    {
      label: "Email",
      value: portfolioData.contact.email,
      href: `mailto:${portfolioData.contact.email}`,
    },
    {
      label: "GitHub",
      value: portfolioData.contact.githubLabel,
      href: portfolioData.contact.github,
    },
    {
      label: "LinkedIn",
      value: portfolioData.contact.linkedinLabel,
      href: portfolioData.contact.linkedin,
    },
  ];
  links.forEach((item) => {
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = item.href;
    if (!item.href.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    const label = document.createElement("span");
    label.className = "contact-link-label";
    label.textContent = item.label;
    const value = document.createElement("span");
    value.className = "contact-link-value";
    value.textContent = item.value;
    link.append(label, value);
    root.append(link);
  });
}

function renderAboutInterests() {
  const root = select("#interest-list");
  if (!root) return;
  portfolioData.aboutInterests.forEach((interest) => {
    const item = document.createElement("li");
    item.textContent = interest;
    root.append(item);
  });
}

function setupNavigation() {
  const toggle = select(".nav-toggle");
  const nav = select("#primary-nav");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
}

function setupMagneticButtons() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  selectAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.06;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

export function initializeInteractions() {
  const nameParts = portfolioData.identity.name.trim().split(/\s+/);
  const firstName = document.querySelector("[data-identity-first]");
  const lastName = document.querySelector("[data-identity-last]");
  if (firstName)
    firstName.textContent = nameParts[0] || portfolioData.identity.name;
  if (lastName) lastName.textContent = nameParts.slice(1).join(" ");
  document.querySelectorAll("[data-identity]").forEach((element) => {
    const value = portfolioData.identity[element.dataset.identity];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-identity-inline]").forEach((element) => {
    element.textContent = portfolioData.identity.name;
  });
  document.title = portfolioData.identity.siteTitle;
  const githubBrowseLink = document.querySelector("#github-browse-link");
  if (githubBrowseLink) githubBrowseLink.href = portfolioData.contact.github;
  renderSkillClusters();
  renderArchitectureDiagram();
  renderProjects(null, "loading");
  renderAboutInterests();
  renderContactLinks();
  setupNavigation();
  setupMagneticButtons();
  const year = select("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
  return renderProjects;
}
