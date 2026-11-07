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
  },
  skillGroups: [
    {
      id: "problem-solving",
      title: "Competitive Programming",
      mark: "CP",
      skills: ["Algorithms", "Data Structures", "Java", "C++"],
    },
    {
      id: "backend",
      title: "Backend & Microservices",
      mark: "API",
      skills: [
        "Java",
        "Spring Boot",
        "Spring Security",
        "Hibernate",
        "REST APIs",
      ],
    },
    {
      id: "frontend",
      title: "Frontend Engineering",
      mark: "UI",
      skills: ["JavaScript", "HTML", "CSS", "React"],
    },
    {
      id: "databases",
      title: "Databases",
      mark: "DB",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
    },
    {
      id: "devops",
      title: "Cloud & Infrastructure",
      mark: "OPS",
      skills: ["Docker", "Git", "GitHub", "Linux"],
    },
    {
      id: "architecture",
      title: "Architecture",
      mark: "SYS",
      skills: [
        "Microservices",
        "API Gateway",
        "Service Discovery",
        "Kafka",
        "Event-Driven Architecture",
      ],
    },
    {
      id: "ai",
      title: "AI Engineering",
      mark: "AI",
      skills: ["AI integrations", "Applied AI projects"],
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
