const projectRecord = (name, featured = false) => ({
  name, outcome: null, status: null, tech: [], preview: null, features: [],
  problem: null, approach: null, result: null, learned: null,
  featured, github: null, live: null,
});

export const portfolioData = {
  identity: {
    name: "Mohamed Irfan",
    brand: "Mohamed Irfan",
    siteTitle: "Mohamed Irfan — AI, Cloud & Microservices",
    title: "AI, Cloud & Microservices Developer",
    tagline: "Engineering what’s next.",
    heroDescription:
      "I build intelligent applications and connected systems — from AI integrations to cloud-ready microservices.",
    education: "BICT undergraduate · University of Ruhuna, Sri Lanka",
    currentFocus:
      "AI engineering, cloud development, microservices, and competitive programming",
  },
  aboutInterests: [
    "Java and Spring Boot",
    "Applied AI projects",
    "RESTful APIs",
    "Microservices architecture",
    "PostgreSQL and databases",
    "Docker and deployment",
    "Full-stack web development",
    "Creative problem-solving",
  ],
  contact: {
    email: "irfanmt29@gmail.com",
    github: "https://github.com/Mohamed-Irfan-git",
    githubLabel: "Mohamed-Irfan-git",
    linkedin: "https://www.linkedin.com/in/mohamed-irfan-293882325",
    linkedinLabel: "/in/mohamed-irfan-293882325",
    leetcode: "https://leetcode.com/u/Mhd_irfan369/",
  },
  leetcodeFallback: {
    totalSolved: 324,
    difficulties: [
      { name: "Easy", solved: 101 },
      { name: "Medium", solved: 189 },
      { name: "Hard", solved: 34 },
    ],
    profileRanking: 464261,
    contestRating: 1514,
    contestsAttended: 5,
  },
  projects: [
    // Curated foreground cards; the background gallery uses the full repository feed.
    { ...projectRecord("tableFlow", true), live: "https://table-flow-delta.vercel.app/" },
    projectRecord("Rag-System"),
    projectRecord("help_desk"),
    projectRecord("Nexora"),
  ],
  skillGroups: [
    {
      id: "problem-solving",
      title: "Competitive Programming",
      tagline: "Solve problems through algorithms and data structures.",
      visual: "ring",
      items: [
        { name: "Algorithms", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Data Structures", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Java", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "C++", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "backend",
      title: "Backend & Microservices",
      tagline: "Build connected systems with Java and Spring Boot.",
      visual: "flow",
      items: [
        { name: "Java", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Spring Boot", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Spring Security", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Hibernate", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "REST APIs", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "frontend",
      title: "Frontend Engineering",
      tagline: "Build full-stack web experiences with React.",
      visual: "ui",
      items: [
        { name: "JavaScript", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "HTML", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "CSS", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "React", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "databases",
      title: "Databases",
      tagline: "Work with PostgreSQL and other database tools.",
      visual: "tables",
      items: [
        { name: "PostgreSQL", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "MySQL", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "MongoDB", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Supabase", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "devops",
      title: "Cloud & Infrastructure",
      tagline: "Explore cloud development and Docker deployment.",
      visual: "layers",
      items: [
        { name: "Docker", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Git", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "GitHub", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Linux", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      tagline: "Think about service communication and data flow.",
      visual: "arch",
      items: [
        { name: "Microservices", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "API Gateway", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Service Discovery", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Kafka", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Event-Driven Architecture", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
    {
      id: "ai",
      title: "AI Engineering",
      tagline: "Build intelligent applications with AI integrations.",
      visual: "graph",
      items: [
        { name: "AI integrations", level: null, usedIn: [], todo: ["level", "usedIn"] },
        { name: "Applied AI projects", level: null, usedIn: [], todo: ["level", "usedIn"] },
      ],
    },
  ],
  architecture: [
    {
      id: "client",
      label: "Client",
      lines: ["Client"],
      description: "A client sends a request into the system.",
    },
    {
      id: "gateway",
      label: "API Gateway",
      lines: ["API", "Gateway"],
      description:
        "The API Gateway provides a single entry point and routes the request.",
    },
    {
      id: "auth",
      label: "Authentication",
      lines: ["Authentication"],
      description:
        "Authentication checks identity and access before protected work continues.",
    },
    {
      id: "discovery",
      label: "Service Discovery",
      lines: ["Service", "Discovery"],
      description:
        "Service discovery helps locate an available service instance.",
    },
    {
      id: "orders",
      label: "Orders Service",
      lines: ["Orders", "Service"],
      description: "A service handles the request within its own boundary.",
    },
    {
      id: "events",
      label: "Event Bus",
      lines: ["Event Bus"],
      description:
        "The event bus carries a domain event to interested consumers.",
    },
    {
      id: "notifications",
      label: "Notification Service",
      lines: ["Notification", "Service"],
      description:
        "A separate consumer can react to the event, such as by sending a notification.",
    },
    {
      id: "postgres",
      label: "PostgreSQL",
      lines: ["PostgreSQL"],
      description: "A database persists the data owned by its service.",
    },
  ],
  assistant: {
    greeting: "Hey, I'm DEEP. Want to explore Irfan's work?",
    suggestions: [
      "Who is Irfan?",
      "What technologies does he use?",
      "Show me his best projects.",
      "Does he work on AI projects?",
      "How is his LeetCode performance?",
      "How can I contact him?",
      "What is he currently learning?",
    ],
  },
};
