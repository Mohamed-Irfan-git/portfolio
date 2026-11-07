import { portfolioData } from "./portfolio-data.js";

const select = (selector, root = document) => root.querySelector(selector);

function classifyQuestion(question) {
  const value = question.toLowerCase();
  if (
    /leetcode|competitive|contest|solved problems|coding challenges/.test(value)
  )
    return "leetcode";
  if (/artificial.?intelligence|\bai\b|machine.?learning|\bllm\b/.test(value))
    return "ai";
  if (/who|about|background|study|education|university|irfan/.test(value))
    return "about";
  if (/spring.?boot|java|backend|microservice|cloud/.test(value))
    return "backend";
  if (/technolog|skill|stack|tool|database|front.?end|devops/.test(value))
    return "skills";
  if (/project|work|built|show|best/.test(value)) return "projects";
  if (/contact|email|linkedin|github|reach|connect/.test(value))
    return "contact";
  if (/learn|learning|focus|currently|next/.test(value)) return "learning";
  return "help";
}

function answerFor(category) {
  const { identity, contact, skillGroups } = portfolioData;
  const allSkills = skillGroups.flatMap((group) => group.skills);
  const answers = {
    about: {
      text: `${identity.name} is an AI, cloud, and microservices developer and competitive programmer. He is a ${identity.education} and is drawn to reliable backends, thoughtful system design, and creative problem-solving.`,
      link: { label: "Meet Irfan", href: "#about" },
    },
    ai: {
      text: `Irfan works across software engineering and AI engineering. His public repositories appear in the project gallery, with AI-related repos prioritized when their GitHub names, descriptions, or topics identify them.`,
      link: { label: "Explore his GitHub projects", href: "#projects" },
    },
    leetcode: {
      text: "The LeetCode section shows live solved-problem counts, difficulty breakdown, profile rank, and contest performance from Irfan’s public profile.",
      link: { label: "Explore his LeetCode performance", href: "#leetcode" },
    },
    backend: {
      text: `Yes. Java and Spring Boot are central to Irfan’s backend focus, alongside Spring Security, Hibernate, REST APIs, and microservices architecture.`,
      link: { label: "Explore the toolkit", href: "#skills" },
    },
    skills: {
      text: `His toolkit includes ${allSkills.join(", ")}. The portfolio groups them by the systems they support rather than assigning made-up proficiency scores.`,
      link: { label: "Explore all skill groups", href: "#skills" },
    },
    projects: {
      text: "The project gallery loads Irfan’s public GitHub repositories live. Open a repository to see its description, language, topics, and source code.",
      link: { label: "Go to the project gallery", href: "#projects" },
    },
    contact: {
      text: `You can reach Irfan at ${contact.email}, or open his GitHub and LinkedIn from the contact section.`,
      link: { label: "Open contact details", href: "#contact" },
    },
    learning: {
      text: `The areas highlighted in Irfan’s portfolio are ${identity.currentFocus}.`,
      link: { label: "Explore his engineering approach", href: "#philosophy" },
    },
    help: {
      text: "I can help with Irfan’s background, technologies, GitHub projects, LeetCode performance, AI engineering, current focus, or contact details. Try one of the suggested questions below.",
      link: null,
    },
  };
  return answers[category];
}

export function initializePortfolioBot() {
  const widget = select("#guide-widget");
  const panel = select("#guide-panel");
  const toggle = select("#guide-toggle");
  const close = select(".guide-close");
  const messages = select("#guide-messages");
  const suggestions = select("#guide-suggestions");
  const form = select("#guide-form");
  const input = select("#guide-input");
  if (
    !widget ||
    !panel ||
    !toggle ||
    !messages ||
    !suggestions ||
    !form ||
    !input
  )
    return;

  messages.replaceChildren();
  appendMessage("deep", portfolioData.assistant.greeting);

  const setOpen = (open, focus = false, returnFocus = false) => {
    widget.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close DEEP portfolio guide" : "Open DEEP portfolio guide",
    );
    panel.setAttribute("aria-hidden", String(!open));
    panel.inert = !open;
    if (open && focus) window.setTimeout(() => input.focus(), 210);
    if (!open && returnFocus) toggle.focus();
  };

  function appendMessage(kind, text, link) {
    const message = document.createElement("div");
    message.className = `message message-${kind}`;
    const paragraph = document.createElement("p");
    paragraph.className = "message-text";
    paragraph.textContent = text;
    message.append(paragraph);
    if (link) {
      const action = document.createElement("a");
      action.className = "message-action";
      action.href = link.href;
      action.textContent = `${link.label} →`;
      action.addEventListener("click", () => setOpen(false));
      message.append(action);
    }
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function ask(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    appendMessage("user", cleanQuestion);
    const response = answerFor(classifyQuestion(cleanQuestion));
    window.setTimeout(
      () => appendMessage("deep", response.text, response.link),
      180,
    );
    input.value = "";
  }

  portfolioData.assistant.suggestions.slice(0, 5).forEach((question) => {
    const button = document.createElement("button");
    button.className = "suggestion-button";
    button.type = "button";
    button.textContent = question;
    button.addEventListener("click", () => ask(question));
    suggestions.append(button);
  });

  toggle.addEventListener("click", () =>
    setOpen(!widget.classList.contains("is-open"), true),
  );
  close?.addEventListener("click", () => setOpen(false, false, true));
  select("[data-open-guide]")?.addEventListener("click", () =>
    setOpen(true, true),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("is-open"))
      setOpen(false, false, true);
  });
  document.addEventListener("pointerdown", (event) => {
    if (
      widget.classList.contains("is-open") &&
      !widget.contains(event.target) &&
      !event.target.closest("[data-open-guide]")
    )
      setOpen(false);
  });
}
