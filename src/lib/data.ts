export const resumeUrl =
  "https://drive.google.com/file/d/1DkULK-TCAs1nEKtQ87jBBHYCzab-F1BZ/view";

export const site = {
  name: "Udochukwu Onuegbu",
  short: "Udochukwu",
  email: "onuegbuudochukwu6@gmail.com",
  phone: "09035854102",
  location: "Ikeja, Lagos, Nigeria",
  linkedin: "https://linkedin.com/in/udochukwu-onuegbu-672096277",
  github: "https://github.com/OnuegbuUdochukwu",
  tagline: "Backend Engineer",
  subtitle: "Final year @ Covenant University · 4.89 GPA · 1,400+ contributions.",
  blurb: "I write clean, maintainable code. I focus on what happens behind the scenes - server logic, data structures, and the systems that carry weight without making noise. I prefer logic over design.",
  lastUpdated: "May 2026",
} as const;

export const now = {
  date: "May 2026",
  lines: [
    "Finishing my final year at Covenant University (graduating 2026).",
    "Building an AI-focused final year project.",
    "Deepening my Java & Spring Boot skills with production-grade APIs.",
    "Maintaining a 232-day GitHub contribution streak.",
    "Open to backend engineering roles - remote.",
  ],
} as const;

export const education = {
  school: "Covenant University",
  degree: "Bachelor of Computer Science",
  location: "Ota, Ogun State",
  period: "Sep 2022 - Present",
  gpa: "4.89 / 5.00",
  details: [
    "Member, Nigerian Association of Computing Students (NACOS)",
    "Coursework: Structured Programming, Database Management, Operating Systems",
  ],
} as const;

export const experience = [
  {
    company: "Quidax",
    role: "Backend Developer Intern",
    period: "Mar 2025 - Sep 2025",
    type: "Internship · Hybrid",
    description: "Built and integrated REST APIs for cryptocurrency platforms using Java and Spring Boot. Collaborated on designing secure data flow pipelines and gained hands-on experience with production backend systems.",
    highlights: [
      "Built 7+ Spring Boot microservices including crypto converter, market depth visualizer, and trade feed APIs",
      "Integrated Quidax REST API for real-time price data, wallet balances, and order management",
      "Wrote authenticated API integrations handling secure key storage and request signing",
    ],
    tags: ["Java", "Spring Boot", "REST APIs", "Cryptocurrency"],
    githubRepos: [
      "Cryptocurrency-Price-Ticker",
      "simple-crypto-converter",
      "market-depth-visualizer",
      "Quidax-public-trades-feed",
    ],
  },
  {
    company: "Chequebase",
    role: "Backend Intern",
    period: "2024",
    type: "Internship",
    description: "Worked with the backend team to integrate and optimize APIs ensuring seamless system communication. Conducted usability testing and contributed to improving user interfaces.",
    highlights: [
      "Collaborated on API integration and optimization for cross-system communication",
      "Conducted usability testing to improve UI/UX for end users",
      "Debugged real-world backend issues in a sprint-based environment",
    ],
    tags: ["API Development", "Backend", "Testing"],
    githubRepos: [],
  },
  {
    company: "Cowrywise",
    role: "CowryWise Ambassador",
    period: "Nov 2025 - Dec 2025",
    type: "Ambassador",
    description: "Represented Cowrywise on campus, promoting financial literacy and the platform's savings/investment products to students.",
    highlights: [
      "Promoted financial literacy and investment awareness among university students",
    ],
    tags: ["Fintech", "Community"],
    githubRepos: [],
  },
] as const;

export const certifications = [
  { name: "Responsive Web Design", issuer: "freeCodeCamp", date: "Dec 2023" },
  { name: "CS50 Introduction to Programming with Python", issuer: "Harvard / CS50", date: "2024" },
  { name: "Discover the Art of Prompting", issuer: "Google", date: "Sep 2025" },
  { name: "Start Writing Prompts like a Pro", issuer: "Google", date: "Sep 2025" },
] as const;

export interface Project {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  language: string;
  languages?: { name: string; percentage: number }[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: "Active" | "Archived" | "Learning Project";
  category: "Backend" | "Full Stack" | "AI/ML" | "Tooling" | "Mobile";
  why: string;
  architectureNote?: string;
  learnings?: string[];
}

export const projects: Project[] = [
  {
    slug: "telegram-complaint-system",
    name: "Telegram Complaint System",
    description: "A communication platform for managing complaints directly through Telegram, enabling faster response rates.",
    language: "Python",
    languages: [
      { name: "Python", percentage: 75.1 },
      { name: "PLpgSQL", percentage: 12 },
      { name: "HTML", percentage: 8 },
      { name: "HCL", percentage: 4.9 },
    ],
    tags: ["Python", "PostgreSQL", "Docker", "Telegram API"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/telegram-complaint-system",
    status: "Active",
    category: "Full Stack",
    why: "Solves a real communication bottleneck - complaint management - using a channel everyone already has open.",
    architectureNote: "Chose PostgreSQL with PL/pgSQL over an ORM because complaint queries required recursive CTEs for escalation chains. Telegram served as the interface layer - no frontend framework needed, just bot commands and inline keyboards.",
    learnings: ["PostgreSQL with PL/pgSQL for stored procedures", "Docker containerization for deployment", "Python async patterns for bot interactions"],
  },
  {
    slug: "cryptocurrency-price-ticker",
    name: "Cryptocurrency Price Ticker",
    description: "Real-time cryptocurrency price tracking platform powered entirely by Java, integrating with Quidax APIs.",
    language: "Java",
    tags: ["Java", "Spring Boot", "Quidax API", "Real-time"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/Cryptocurrency-Price-Ticker",
    status: "Archived",
    category: "Backend",
    why: "100% Java - proof that backend-first thinking can still deliver user-facing value.",
    architectureNote: "Pure Java application with no frontend framework - the entire rendering pipeline runs through a Spring Boot MVC controller serving Thymeleaf templates. Real-time price updates are polled from Quidax's REST API at configurable intervals rather than WebSocket, prioritising simplicity over instant push.",
  },
  {
    slug: "dynamic-portfolio",
    name: "Dynamic Portfolio",
    description: "Multi-language portfolio showcasing projects with a Java backend, TypeScript interactivity, and Python scripting.",
    language: "Java",
    languages: [
      { name: "Java", percentage: 42.7 },
      { name: "TypeScript", percentage: 29 },
      { name: "Python", percentage: 23.2 },
      { name: "JavaScript", percentage: 3 },
      { name: "CSS", percentage: 2.1 },
    ],
    tags: ["Java", "TypeScript", "Python", "Full Stack"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/Dynamic_Portfolio",
    status: "Archived",
    category: "Full Stack",
    why: "Deliberate multi-language architecture - each layer solved in the right language for the job.",
  },
  {
    slug: "water-cooler-network",
    name: "Water Cooler Network",
    description: "Digital networking platform for remote and hybrid workers - instant coffee chat matching, topic lounges, and corporate spaces.",
    language: "Java",
    tags: ["Java", "Spring Boot", "Social", "Real-time"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/water-cooler-network",
    status: "Learning Project",
    category: "Backend",
    why: "Product thinking meets backend engineering - addresses the loneliness of remote work with real-time matching.",
    architectureNote: "Designed around topic-based matchmaking - each lounge acts as a discrete context boundary. Coffee chat matching uses a round-robin queue with preference weighting rather than naive random assignment, minimising wait times while maximising relevance.",
  },
  {
    slug: "splitsnap",
    name: "SplitSnap",
    description: "Mobile expense-splitting app built with TypeScript - split bills, track IOUs, settle debts.",
    language: "TypeScript",
    tags: ["TypeScript", "Mobile", "Expense Tracking"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/SplitSnap---Mobile-Expense-Splitting-App",
    status: "Learning Project",
    category: "Mobile",
    why: "Everyone has split bills before. Building the backend logic for fair division is harder than it looks.",
    architectureNote: "The splitting engine accounts for unequal contributions, partial payments, and rounding edge cases - a surprising amount of state logic for what appears to be a simple calculator. Each expense is modelled as a directed acyclic graph of debts, then settled using minimum-transaction resolution.",
  },
  {
    slug: "facial-emotion-detection",
    name: "Facial Emotion Detection",
    description: "Real-time facial emotion detection using a Convolutional Neural Network classifying 7 emotion categories.",
    language: "Python",
    tags: ["Python", "CNN", "Deep Learning", "Computer Vision"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/ONUEGBU--22CG031937",
    status: "Archived",
    category: "AI/ML",
    why: "Stepping into AI/ML territory - a CNN from scratch for real-time emotion classification.",
    architectureNote: "Built a CNN from scratch using TensorFlow - three convolutional layers with batch normalisation and dropout to prevent overfitting on the FER2013 dataset. The real-time pipeline uses OpenCV for face detection and frame buffering to smooth predictions across consecutive frames rather than classifying each frame independently.",
  },
  {
    slug: "intelligent-career-optimizer",
    name: "Intelligent Career Optimizer",
    description: "Analyzes resumes against job market data, identifies missing skills, and computes the shortest path to a target role.",
    language: "Python",
    tags: ["Python", "Graph Algorithms", "ML", "Career Tech"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/intelligent-career-optimizer",
    status: "Learning Project",
    category: "AI/ML",
    why: "Combines graph algorithms with ML - the kind of ambitious, systems-level thinking that defines great engineers.",
    architectureNote: "Represents career progression as a weighted directed graph where nodes are skills and edges are learning paths. Dijkstra's algorithm computes the shortest path from current to target skill set, while a lightweight ML layer scores paths by cost and time-to-complete. The resume parser uses spaCy for entity extraction.",
  },
  {
    slug: "fundly",
    name: "Fundly",
    description: "A fundraising platform built with JavaScript.",
    language: "JavaScript",
    tags: ["JavaScript", "Full Stack"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/Fundly",
    status: "Archived",
    category: "Full Stack",
    why: "First project with a real star on GitHub - early signal of community interest.",
  },
  {
    slug: "afterclass",
    name: "AfterClass",
    description: "TypeScript-based application for post-class collaboration.",
    language: "TypeScript",
    tags: ["TypeScript", "Education"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/AfterClass",
    status: "Learning Project",
    category: "Full Stack",
    why: "Solving a problem every student knows - staying connected after the lecture ends.",
  },
  {
    slug: "pathfinder",
    name: "Pathfinder",
    description: "Visualizing search algorithms - BFS, DFS, Dijkstra, A*.",
    language: "Python",
    tags: ["Python", "Algorithms", "Visualization"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/pathfinder",
    status: "Learning Project",
    category: "Tooling",
    why: "Algorithm visualizers reveal how you think about code. This one shows a fascination with search and optimization.",
    architectureNote: "Implements four search algorithms (BFS, DFS, Dijkstra, A*) behind a unified interface - each algorithm plugs into the same visualiser via a strategy pattern. The grid representation uses a 2D array of nodes, each tracking parent pointers for path reconstruction after the search completes.",
  },
  {
    slug: "telegram-trade-bot",
    name: "Telegram Trade Bot",
    description: "Trading bot for Telegram that executes trades via Flattrade APIs directly in chat.",
    language: "Python",
    tags: ["Python", "Trading", "Telegram API", "Automation"],
    status: "Learning Project",
    category: "Backend",
    why: "Automation meets finance - executing real trades from a chat interface.",
  },
  {
    slug: "christmas-list",
    name: "ChristmasList",
    description: "Modern holiday registry that lets friends and family purchase units of high-value items rather than crowdfunding.",
    language: "JavaScript",
    tags: ["JavaScript", "Web App", "Social"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/christmasList",
    status: "Archived",
    category: "Full Stack",
    why: "Creative rethinking of a tired concept (gift registries) with unit-based purchasing - product innovation.",
  },
  {
    slug: "tribe-canvas",
    name: "Tribe Canvas",
    description: "An online marketplace for Nigerian artworks.",
    language: "JavaScript",
    tags: ["JavaScript", "Marketplace", "Art"],
    githubUrl: "https://github.com/OnuegbuUdochukwu/tribe-canvas",
    status: "Archived",
    category: "Full Stack",
    why: "Supporting Nigerian artists through tech - a project with cultural purpose.",
  },
] as const;

export type ProjectCategory = Project["category"];

export const usesCategories = [
  {
    title: "Editor & Terminal",
    items: [
      { label: "Editor", value: "VS Code - with JetBrains Mono, minimal theme" },
      { label: "Terminal", value: "iTerm2 + zsh + Oh My Zsh" },
      { label: "Font", value: "JetBrains Mono for code, DM Sans everywhere else" },
    ],
  },
  {
    title: "Languages",
    items: [
      { label: "Primary", value: "Java, Python, TypeScript" },
      { label: "Secondary", value: "JavaScript, C, C++, SQL" },
      { label: "Learning", value: "Go, Rust" },
    ],
  },
  {
    title: "Frameworks & Tools",
    items: [
      { label: "Backend", value: "Spring Boot, Flask, Express" },
      { label: "Frontend", value: "React, Next.js, Tailwind CSS" },
      { label: "Databases", value: "PostgreSQL, SQLite" },
      { label: "DevOps", value: "Docker, Git, HCL" },
    ],
  },
  {
    title: "Hardware",
    items: [
      { label: "Laptop", value: "HP - dependable, does the job" },
      { label: "Monitor", value: "24\" external - because one screen is never enough" },
    ],
  },
  {
    title: "Music While Coding",
    items: [
      { label: "Genre", value: "Lo-fi, ambient, or deep focus instrumentals" },
      { label: "Vibe", value: "Something rhythmic but wordless - keeps the flow state intact" },
    ],
  },
] as const;

export const languageColors: Record<string, string> = {
  Java: "#b07219",
  Python: "#3572A5",
  TypeScript: "#31c665",
  JavaScript: "#F7DF1E",
  "HTML": "#E34F26",
  CSS: "#563D7C",
  HCL: "#006BB6",
  PLpgSQL: "#353391",
  Docker: "#0db7ed",
  Shell: "#89E051",
};

export const quotes = [
  `"I'd rather debug complex backend logic for hours than try to center a div for 10 minutes."`,
  `"Working code is the floor, not the ceiling."`,
  `"You know you're an engineer when a minor inconvenience becomes a system architecture diagram in your head."`,
  `"You can't do everything at once, but you can do everything in sequence."`,
  `"Frontend captures the attention, but Backend carries the weight."`,
] as const;
