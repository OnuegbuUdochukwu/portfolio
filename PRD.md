# PRD: Portfolio Website — Udochukwu Onuegbu

## 1. Overview & Purpose

A personal portfolio website for **Udochukwu Enyioma Onuegbu** — a final-year Computer Science student at Covenant University (GPA 4.89/5.00), backend engineer, and self-branded **"LockedIn 2026"** developer.

The site must feel unmistakably *him*: someone who values substance over flash, shows up every single day, and finds beauty in the invisible weight that backend systems carry. Not a generic dev portfolio. A window into how he thinks.

---

## 2. Design Philosophy

### 2.1 Visual Direction: Minimal & Clean

- **Whitespace** as the primary layout tool — generous, uncluttered
- **Monochromatic base** (charcoal, off-white, warm grey) with **one accent color**: a muted green or deep teal (evoking the GitHub contribution graph — meaningful to his story)
- **Typography-first** design. No hero illustrations. No stock avatars. Words do the work.
- **Subtle motion** — micro-interactions, scroll-triggered reveals, no gratuitous animation

### 2.2 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display/Headlines | **Instrument Serif** or **EB Garamond** | 400 | Warm, human, slightly traditional — contrasts the technical content |
| Body | **Inter** or **DM Sans** | 400 / 500 | Clean, legible, workhorse sans-serif |
| Code / Tech labels | **JetBrains Mono** | 400 | For inline code, tech stack badges, terminal quotes |
| Accent / Pull quotes | *Italic serif* | — | For LinkedIn-post-style thought fragments |

### 2.3 Color Palette

```
--black:       #1A1A1A
--white:       #FAFAF8
--grey-100:    #F0EFED
--grey-300:    #D1D0CE
--grey-500:    #7C7B79
--accent:      #2D6A4F  (deep green — streak/contribution graph color)
--accent-muted:#95B8A0
--highlight:   #D8F3DC  (light green tint for subtle backgrounds)
```

### 2.4 Tone of Voice

- Direct, minimal, no filler
- Occasional pull-quote fragments from his LinkedIn posts (italic serif)
- Section headers should feel like thoughts, not labels
- No "Welcome to my portfolio" — start with substance

---

## 3. Site Structure & Pages

### 3.1 Navigation

Sticky top nav, minimal:
- Logo/name (left) — text only, no logo mark
- Links (right): **Home · Now · Work · Projects · Uses · Photos** (6 items max)
- Theme toggle (optional — dark/light mode is not a priority unless needed)
- Mobile: hamburger with slide-in overlay

No mega menus. No dropdowns. No social icons in nav — reserved for footer.

---

### 3.2 Home Page (Index)

**Purpose:** Establish who he is in under 3 seconds. Not a "hero section." A statement.

**Layout:**

```
┌─────────────────────────────────────┐
│  [small muted label: Udochukwu Onuegbu]  │
│                                       │
│  Backend & AI Engineer in Training.   │
│  Final year @ Covenant University.    │
│  4.89 GPA. 1,400+ contributions.      │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ "I'd rather debug complex       │ │
│  │  backend logic for hours than   │ │
│  │  try to center a div            │ │
│  │  for 10 minutes."               │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [Now] [Work] [Projects]              │
│                                       │
│  ——— scroll ———                       │
└─────────────────────────────────────┘
```

- Full-viewport first screen
- Serif display name
- Pull quote in italic serif with subtle left border or bracketed styling
- Quick links to core sections
- No profile photo (let the work and words speak)

**Below the fold (passport-size):**
- GitHub contribution graph (rendered inline as an SVG grid — his streak is central to his identity)
- Live stat line: "1,428 contributions in the last year · 232-day streak"

---

### 3.3 Now Page (aka "Currently")

**Purpose:** Borrowed from the nownownow.com movement. What he's focused on right now. This is the page that makes the site feel alive.

**Content:**

```
Now

[Month Year] — Lagos, Nigeria

Currently:
- Finishing my final year at Covenant University (graduating 2026)
- Building [final-year-alpha] — an AI-related final year project
- Deepening my Java & Spring Boot skills
- Maintaining my GitHub streak (currently 232 days)
- Open to backend engineering roles (Germany / remote)

Reading:
- [linked resources if available]

Listening to:
- [inline music embed or text update]

Last updated: May 2026
```

This page should feel like a status update. A datestamp at the bottom. The tone is direct, almost like a README.

---

### 3.4 Work Page (Timeline / Experience)

**Purpose:** Career narrative — not just a list of jobs. Shows progression from intern to engineer.

**Visual approach:** Vertical timeline with connecting line. Each entry is a card that reveals on scroll.

**Data sources merged:**

| Entry | Source |
|-------|--------|
| Quidax — Backend Intern (Mar 2025 - Sep 2025) | Resume + LinkedIn |
| Chequebase — Backend Intern | Resume |
| Cowrywise — Ambassador (Nov 2025 - Dec 2025) | LinkedIn |

**For each entry:**
- Company name + logo (simple wordmark or icon)
- Role title
- Date range
- 1-2 sentence description (pulled from resume)
- 1-2 "What I built" bullets (technical, specific)
- Tech tags (small, JetBrains Mono, pill-shaped)
- Related GitHub project link (where applicable — e.g. the Quidax repos link to his internship work)

**Also on this page:**
- **Education**: Covenant University, BSc CS, 4.89 GPA
- **Certifications**: freeCodeCamp, CS50P, Google Prompting certs — as smaller timeline entries

---

### 3.5 Projects Page

**Purpose:** Proof of work — live links, tech stack breakdown, and the story behind each project.

**Filter system:**
- By language: Java · Python · TypeScript · JavaScript · HTML/CSS
- By type: Backend · Full Stack · AI/ML · Tooling

**Featured projects (4-6 selected, not all 75 repos):**

| Project | Language | Why it matters |
|---------|----------|---------------|
| **Telegram Complaint System** | Python | Shows real-world problem-solving, full-stack capability, Docker deployment |
| **Cryptocurrency Price Ticker** | Java | 100% Java, Quidax API integration — internship-adjacent work |
| **Dynamic Portfolio** | Java/TS/Python | Multi-language project — shows versatility |
| **water-cooler-network** | Java | Social platform for remote workers — shows product thinking |
| **SplitSnap** | TypeScript | Mobile expense splitting — UX awareness |
| **ONUEGBU--22CG031937** | Python/HTML | Facial emotion detection with CNN — AI/ML interest |
| **intelligent-career-optimizer** | Python | Graph algorithms + ML — ambition and analytical thinking |
| **Fundly** | JavaScript | 1 star — first community validation |

**For each project card:**
- Name + link to live demo and GitHub
- 1-sentence description (not copied — rewritten to tell the *why*)
- Language breakdown (visual bar like GitHub's)
- Key technical decisions (1-2 bullets)
- What he learned
- Status: Active · Archived · Learning Project

**Grid layout:** 2 columns on desktop, 1 on mobile. Cards with subtle borders, no shadows.

---

### 3.6 Uses Page (aka /uses)

**Purpose:** A page listing the tools, software, and gear he uses. Popular in the developer community. Shows taste and intentionality.

**Categories:**
- **Editor**: VS Code + theme + fonts
- **Terminal**: [zsh + Oh My Zsh, etc.]
- **Languages**: Java, Python, TypeScript, JavaScript, C, C++, SQL
- **Frameworks**: Spring Boot, Flask, React (lightweight)
- **Tools**: Docker, Git, PostgreSQL, HCL/Terraform
- **Hardware**: [his laptop, monitor, etc. — whatever he uses]
- **Music**: [what he codes to]
- **Note-taking**: [how he organizes]

Each item gets a tiny 1-line opinion: "X because Y." No long reviews. The personality comes through in the *why*, not the *what*.

This page should feel like peeking into his setup — minimal, intentional, curated.

---

### 3.7 Photos Page (Gallery)

**Purpose:** A visual break from the technical pages. Photos from his life — Lagos, Covenant University, whatever he chooses to share. This is the "who I am outside code" page.

**Layout:**
- Masonry or justified grid
- No captions (let the images breathe)
- Optional: year/month groupings
- Lightbox on click

**Source:** His own photography. Not stock photos. Even 6-10 images is enough.

**Optional:** A small note at the bottom: *"Shot on [phone/camera]."*

---

### 3.8 Footer (Global)

Simple, text-based:

```
Udochukwu Onuegbu
onuegbuudochukwu6@gmail.com

[GitHub] [LinkedIn] [Email]

Built with [tech stack]. Last updated [month year].
Nigeria.
```

No newsletter signup. No "Let's talk" CTA. Just connection points.

---

## 4. Interaction & Animation Guidelines

### 4.1 Philosophy

Motion should feel like a **thoughtful pause**, not a spectacle.

### 4.2 Specifics

| Element | Animation | Trigger |
|---------|-----------|---------|
| Page transitions | Subtle fade + micro slide-up (0.3s, ease-out) | Route change |
| Timeline entries | Staggered fade-in from left | Scroll into view |
| Project cards | Slight lift on hover (translateY -2px, no shadow increase) | Hover |
| Pull quotes | Fade in with a slight delay | Scroll into view |
| GitHub contribution grid | Draw in from left-to-right, cell by cell | First visit / scroll-to |
| Navigation links | Underline slide-in on hover | Hover |
| Mobile menu | Slide overlay from right | Toggle |

**No:**
- Parallax scrolling
- Particle effects
- Typing animations
- Loading spinners (instant transitions)
- Scrolljacking

---

## 5. Data Sources Mapping

| Content | Primary Source | Secondary Source |
|---------|---------------|-----------------|
| Bio / tagline | LinkedIn about section | — |
| Work history | Resume | LinkedIn Experience |
| Project list | GitHub repos | Resume Projects |
| Project details | GitHub README / code | Resume descriptions |
| Skills | Resume + GitHub languages | LinkedIn Skills |
| Certification | Resume | LinkedIn Licenses |
| Education | Resume | — |
| Contribution data | GitHub API | — |
| Personality / voice | LinkedIn posts | — |
| Current focus | LinkedIn post content | — |
| Tool preferences | LinkedIn / GitHub activity | — |

---

## 6. Tech Stack Recommendations

### 6.1 Frontend

- **Framework:** Next.js 14+ (App Router) — static generation, great DX
- **Styling:** Tailwind CSS + a custom design token file for the palette
- **Typography:** `next/font` for Google Fonts (Instrument Serif, Inter, JetBrains Mono)
- **Animation:** Framer Motion (lightweight usage as specified) or CSS-only transitions
- **Contribution graph:** Custom SVG renderer from the GitHub API data

### 6.2 Data / Build

- **Content:** Markdown files or a simple JSON data layer (no CMS needed)
- **Build:** `next build` → static export or Vercel
- **GitHub API:** Fetch at build time via `getStaticProps` / `generateStaticParams`
- **Revalidation:** On-demand revalidation or weekly rebuild for contribution graph updates

### 6.3 Performance Targets

- Lighthouse: 95+ Performance, 100 Accessibility
- First Contentful Paint: < 1.5s
- Total page weight: < 500kb (no images on most pages)
- Zero JS bundle for pages that don't need interactivity

---

## 7. Content Copy (Key Sections)

### 7.1 Meta / Title Tag

```
Udochukwu Onuegbu — Backend Engineer
```

### 7.2 Home Page Subtitle Options

```
Backend & AI Engineer in Training.
Final year @ Covenant University.

I focus on what happens behind the scenes.
```

### 7.3 About Blurb (Used on Now or Home)

> "I write clean, maintainable code. I'd rather debug complex backend logic for hours than try to center a div for 10 minutes. My goal is simple: to build systems that carry weight without making noise. I prefer logic over design."

### 7.4 Work Narrative

> "Two internships before graduation. Quidax taught me Java in production. Chequebase taught me how APIs break and how to fix them. Each project since has been a deliberate step toward mastering the backend."

---

## 8. Sitemap

```
/
/now
/work
/projects
/projects/[slug]
/uses
/photos
```

All top-level pages. No deeply nested routes. The `/projects/[slug]` is optional — could also use modals.

---

## 9. Responsive Breakpoints

| Device | Layout |
|--------|--------|
| > 1024px | Full multi-column |
| 768 - 1024px | 2-column grids collapse to 1 |
| < 768px | Single column, stacked timeline, hamburger nav |

---

## 10. Success Metrics (What "Done" Looks Like)

- The site compiles with zero build errors
- Lighthouse 95+ Performance, 100 Accessibility
- All GitHub data is live-sourced or statically generated from API
- Contribution graph renders correctly and matches GitHub
- All links (GitHub, LinkedIn, live demos) resolve correctly
- Mobile: smooth nav, readable type, no horizontal scroll
- Typography hierarchy is maintained across all viewports
- Every page loads under 2 seconds on a 3G connection
- No placeholder content — every word is his
- The site feels *quiet*. No popups, no cookie banners, no "Let's connect" modals.

---

## 11. Build Order (Recommended)

1. Project scaffolding (Next.js, Tailwind, fonts, colors)
2. Navigation + layout shell (header, footer, page transitions)
3. Home page (hero + contribution graph)
4. Work / timeline page (data layer + scroll animation)
5. Projects page (filtering + cards)
6. Project detail (modal or slug page)
7. Now page (simple markdown content)
8. Uses page (tool grid)
9. Photos page (gallery + lightbox)
10. Polish: animation timing, responsive QA, performance audit
11. Deploy + connect GitHub data pipeline

---

## 12. Constraints & Anti-Goals

- **No** blog engine (he didn't ask for one)
- **No** contact form (email in footer is sufficient)
- **No** dark/light toggle unless trivial to implement
- **No** analytics or tracking
- **No** cookie consent / GDPR banners (static site, no cookies)
- **No** "Hire me" / CTA banners
- **No** stock photography
- **No** generic templates or AI-generated copy
- **No** social media feeds embedded

---

*PRD prepared by merging resume content, LinkedIn profile + posts, and GitHub profile + repositories.*
