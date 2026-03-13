# Mylesoft Technologies — Website Technical Specification
**Version:** v1.0 | **Date:** March 2026 | **Author:** Jonathan Myles — Founder & CEO  
**URL:** www.mylesoft.com | **Repo:** github.com/Mylesoft-Technologies/mylesoft-website  
**Classification:** Confidential — Internal Use Only

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Information Architecture](#3-information-architecture)
4. [Page Specifications](#4-page-specifications)
5. [Design System](#5-design-system)
6. [Technology Stack](#6-technology-stack)
7. [Features & Functionality](#7-features--functionality)
8. [Content Strategy](#8-content-strategy)
9. [SEO & Performance](#9-seo--performance)
10. [Integrations](#10-integrations)
11. [Security & Compliance](#11-security--compliance)
12. [Development Phases & Timeline](#12-development-phases--timeline)
13. [Hosting & Infrastructure](#13-hosting--infrastructure)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

This document is the authoritative technical specification for the Mylesoft Technologies Limited corporate website at **www.mylesoft.com**. It defines every aspect of the website — purpose, information architecture, page-by-page content plans, design system, technology stack, SEO strategy, integrations, security requirements, development phases, and hosting infrastructure.

The Mylesoft website serves as the primary digital front door for the company — a high-converting marketing platform that communicates the company's vision, showcases its 20+ AI-powered products, generates qualified leads, and supports customer onboarding across East Africa and beyond.

The website must reflect Mylesoft's position as **East Africa's leading AI-powered software company** — professional, authoritative, modern, and accessible — while performing at the highest level on mobile devices and low-bandwidth connections across the continent.

---

## 2. Project Overview

### 2.1 Purpose & Goals

- Establish credibility and authority as East Africa's leading AI-powered SaaS company
- Generate qualified leads and demo bookings from schools, hospitals, businesses, and government bodies
- Showcase the full Mylesoft product portfolio across 18 sectors
- Support customer acquisition and onboarding with clear pricing and product information
- Attract top engineering and business talent through a compelling careers page
- Provide a platform for thought leadership through the Mylesoft blog
- Serve as the primary entry point for partner and investor enquiries

### 2.2 Target Audience

| Segment | Role | Primary Goal on Site |
|---------|------|----------------------|
| Educational Institutions | School principals, administrators, board members | Learn about EduMyles, book a demo, view pricing |
| Healthcare Facilities | Hospital CEOs, clinic managers, medical directors | Explore MylesCare features and capabilities |
| SMEs & Corporates | CEOs, IT managers, operations leads | Discover MylesCRM, AgriMyles, and other products |
| Government Bodies | County officials, procurement officers | Explore MylesGov and enterprise licensing |
| Developers & Partners | Tech professionals, system integrators | Access API docs and partnership information |
| Investors | Venture capitalists, angel investors | Review company profile, products, and traction |
| Job Seekers | Engineers, designers, sales professionals | Browse open positions and apply |

### 2.3 Success Metrics (KPIs)

| Metric | Target (Year 1) |
|--------|----------------|
| Monthly Unique Visitors | 50,000+ |
| Demo Booking Conversion Rate | 3–5% of visitors |
| Contact Form Submissions | 500+ per month |
| Bounce Rate | < 45% |
| Average Session Duration | > 3 minutes |
| Mobile Traffic Share | > 65% |
| Page Load Speed (LCP) | < 2.5 seconds |
| Organic Search Traffic | 40% of total traffic by Month 6 |
| Blog Monthly Readers | 10,000+ by Month 6 |

---

## 3. Information Architecture

### 3.1 Sitemap

| Level | Page / Section | URL |
|-------|----------------|-----|
| Primary Nav | Home | `/` |
| Primary Nav | Products | `/products` |
| Primary Nav | Services | `/services` |
| Primary Nav | Pricing | `/pricing` |
| Primary Nav | About | `/about` |
| Primary Nav | Blog | `/blog` |
| Primary Nav | Careers | `/careers` |
| Primary Nav | Contact | `/contact` |
| CTA Button | Book a Demo | `/book-demo` |
| Footer | Privacy Policy | `/legal/privacy` |
| Footer | Terms of Use | `/legal/terms` |
| Footer | Cookie Policy | `/legal/cookies` |
| Dynamic | Blog Post | `/blog/[slug]` |
| Dynamic | Product Page | `/products/[slug]` |
| Dynamic | Career Post | `/careers/[slug]` |

### 3.2 Navigation Structure

**Desktop Nav:**  
`Logo` | Home · Products · Services · Pricing · About · Blog | `Login` · `Book a Demo`

**Mobile Nav:**  
Hamburger → full-screen overlay. `Book a Demo` pinned to bottom.

**Products Mega Menu:**  
On hover/tap — expands into a grid organised by sector: Education · Healthcare · Agriculture · Business · Finance · Transport · Logistics · Hospitality

**Footer Nav:**  
Four columns — Products | Company | Resources | Contact  
Social icons row → Legal links → Tagline → Copyright

---

## 4. Page Specifications

### 4.1 Home Page `/`

**Purpose:** Primary landing page. Convert visitors into demo bookings and product explorations.

| Section | Content |
|---------|---------|
| **Hero** | Headline: *"East Africa's Leading AI-Powered Software Company"*. Sub-headline about transforming Education, Healthcare, Agriculture & Business. Two CTAs: **Book a Free Demo** (gold) and **Explore Products** (outlined). Animated gradient background with African map or tech grid. |
| **Impact Stats Strip** | Animated counters: 500+ Schools · 250,000+ Students · 100+ Hospitals · 1,000+ Farmers · 18 Sectors · 47 Counties. Navy background, gold numbers. |
| **Featured Products Grid** | 6-card grid: EduMyles, EduRyde, MylesCare, MylesCRM, AgriMyles, Myles AI. Each card: icon, name, one-line description, Learn More link. |
| **How It Works** | 3-step: 1. Book a Demo → 2. Customise → 3. Go Live. Icon-based with connecting arrows. |
| **Testimonials Carousel** | 3–5 rotating testimonials. Name, title, org, photo, quote, star rating. |
| **Myles AI Spotlight** | Full-width dark section. African language support. Industry-specific AI models. |
| **Trusted By** | Logo strip of partner organisations, schools, hospitals, counties. |
| **Blog Preview** | Latest 3 posts — thumbnail, category, title, excerpt, Read More. |
| **Final CTA** | *"Ready to Transform Your Organisation?"* — Book a Demo + Contact Us. Navy background. |

---

### 4.2 About Page `/about`

**Purpose:** Build trust and credibility. Tell the Mylesoft story.

- **Hero** — Team photo background, *"About Mylesoft Technologies"* headline
- **Our Story** — Founding in 2020, problem identified, mission, journey to 20+ products
- **Mission** — *"To build world-class, affordable, locally-relevant technology that transforms critical industries across Africa."*
- **Vision** — *"A continent where every organisation has access to intelligent, purpose-built software."*
- **Values** — M.Y.L.E.S.: Mastery · Youth-Driven · Legacy-Building · Empowerment · Service
- **Impact Section** — Data story with Kenya map and location markers
- **Team** — Jonathan Myles (CEO) and Pauline Moraa (COO) — headshots, bios, LinkedIn
- **Advisors & Partners** — Logos and brief descriptions
- **Awards & Recognition** — Press coverage, certifications
- **CTA** — Join us on our mission → Careers + Contact

---

### 4.3 Products Page `/products`

**Purpose:** Full showcase of all Mylesoft products. Enable visitors to find the right product.

- **Hero** — *"20+ AI-powered solutions across 18 sectors — all built for East Africa"*
- **Sector Filter Tabs** — All | Education | Healthcare | Agriculture | Business | Finance | Transport | Logistics | Hospitality | Government | Legal | HR | Manufacturing
- **Product Cards Grid** — Icon, name, sector badge, 2-line description, 3 key features, status badge (Live / In Development / Coming Soon), Learn More CTA
- **Individual Product Pages** `/products/[slug]` — Full features, screenshots, pricing summary, tech stack, testimonials, demo CTA
- **Myles AI Banner** — Persistent: *"All products powered by Myles AI — Africa's intelligence engine"*

---

### 4.4 Services Page `/services`

**Purpose:** Describe professional services beyond SaaS subscriptions.

| Service | Description |
|---------|-------------|
| Implementation & Onboarding | Custom setup, data migration, staff training |
| Custom Development | Bespoke software on the Mylesoft platform |
| System Integration | Connect Mylesoft with ERP, HRIS, accounting systems |
| AI & Data Consulting | Custom analytics and predictive models via Myles AI |
| Support & Maintenance | SLA-based technical support packages |

Each service: icon + title + description + deliverables list + **Get a Quote** CTA.

---

### 4.5 Pricing Page `/pricing`

**Purpose:** Clearly communicate pricing to reduce sales friction.

- **Product Selector** — Tab/dropdown to choose product
- **3 Tiers** — Starter / Professional / Enterprise with "Most Popular" highlight
- **Billing Toggle** — Monthly / Annual (annual shows "Save 20%" badge)
- **Feature Comparison Table** — Full matrix across all tiers
- **FAQ** — 8–10 accordion questions
- **Enterprise CTA** — Custom plan enquiry form

**EduMyles Reference Pricing (KES):**

| Plan | Monthly | Annual | Best For |
|------|---------|--------|----------|
| Starter | 12,900 | 129,000 | Up to 500 students |
| Professional | 38,900 | 389,000 | 501–2,000 students |
| Enterprise | Custom | Custom | 2,000+ students, multi-campus |

---

### 4.6 Blog `/blog`

**Purpose:** Drive organic SEO traffic, establish thought leadership.

- Category filters: Technology | Education | Healthcare | Agriculture | Business | AI & Data | Company News
- Search bar
- Featured post hero (latest or manually pinned)
- 3-column card grid: thumbnail, category, title, excerpt, read time, date, author
- Pagination or infinite scroll
- Individual post: full article + author bio + related posts + social share + newsletter CTA
- **CMS:** Notion API or Contentful — editors publish without code
- **Target:** 2 posts/week, 1,000+ words each, SEO-optimised

---

### 4.7 Careers Page `/careers`

**Purpose:** Attract top talent. Communicate culture and open roles.

- **Hero** — *"Build the Future of African Technology"* — culture video or photo collage
- **Why Mylesoft** — Mission-driven work · Competitive KES pay · Remote-first · Learning budget · ESOP equity · Impact at scale
- **Open Roles** — Filter by department (Engineering / Design / Sales / Operations). Each role: title, department, location, type, description, Apply Now
- **Application Form** — Name, email, role, CV upload, cover letter, LinkedIn, portfolio
- **Open Application** — *"Drop your CV"* CTA when no specific role matches

---

### 4.8 Contact Page `/contact`

**Purpose:** Make it easy to reach the right team.

- **Contact Form** — Name, email, phone, organisation, subject dropdown (Sales / Support / Partnership / Press / General), message
- **Contact Details:**
  - 📧 info@mylesoft.com
  - 📞 +254 743 993 715 | +254 751 812 884
  - 📍 Wester Heights, Westlands, Nairobi, Kenya
- **Department Quick Links** — Sales | Support | Press | Partnerships | Careers
- **Embedded Google Map** — Westlands, Nairobi
- **Social Links** — LinkedIn, Twitter/X, GitHub, YouTube
- **Response Promise** — *"We respond within 24 hours on business days"*

---

### 4.9 Book a Demo `/book-demo`

**Purpose:** Primary conversion page.

- **Hero** — *"See Mylesoft in Action"*
- **Product Selector** — Which product to demo?
- **Organisation Details** — Name, email, phone, org name, org size, country
- **Cal.com Embed** — Integrated calendar with available time slots
- **What to Expect** — 1. Pick a time → 2. Personalised preparation → 3. 30-min live walkthrough
- **Testimonial** — One strong customer quote

---

### 4.10 Legal Pages `/legal/*`

| Page | URL | Content |
|------|-----|---------|
| Privacy Policy | `/legal/privacy` | GDPR + Kenya DPA 2019 compliant. Data collection, usage, storage, rights. |
| Terms of Service | `/legal/terms` | Use of website and SaaS, IP, liability, payment terms, termination. |
| Cookie Policy | `/legal/cookies` | Cookie categories, how to manage, third-party cookies. |

---

## 5. Design System

### 5.1 Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Navy Blue (Primary) | `#1A395B` | Navigation, headings, hero backgrounds, footers |
| Gold (Accent) | `#C79639` | CTAs, highlights, dividers, hover states |
| White | `#FFFFFF` | Page backgrounds, cards, text on dark |
| Light Blue | `#C7D7EF` | Secondary highlights, badges, tags |
| Off White | `#F8FAFC` | Alternating section backgrounds |
| Dark Grey | `#212121` | Primary body text |
| Medium Grey | `#545454` | Secondary text, captions, metadata |
| Light Grey | `#E8EDF4` | Card borders, dividers, input borders |
| Success Green | `#2EA44F` | Live status badges, success states |
| Warning Amber | `#F59E0B` | In Development badges, warnings |

### 5.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 Page Title | Plus Jakarta Sans | 48–64px | 800 ExtraBold |
| H2 Section Title | Plus Jakarta Sans | 32–40px | 700 Bold |
| H3 Card Title | Plus Jakarta Sans | 20–24px | 600 SemiBold |
| Body Text | Inter | 16px | 400 Regular |
| Small / Caption | Inter | 14px | 400 Regular |
| Button Text | Inter | 16px | 600 SemiBold |
| Navigation | Inter | 15px | 500 Medium |
| Code | JetBrains Mono | 14px | 400 Regular |

### 5.3 UI Components

| Component | Spec |
|-----------|------|
| **Primary Button** | Gold `#C79639` bg · white text · `rounded-full` · hover darkens to `#A67C2A` · shadow on hover · `px-8 py-3` |
| **Secondary Button** | Transparent · navy border · navy text · `rounded-full` · hover fills navy with white text |
| **Product Card** | White bg · light grey border · `rounded-2xl` · `shadow-sm` · hover lifts with `shadow-lg` + gold top accent |
| **Navigation** | Sticky · white bg · navy text · gold underline on active · transparent on hero |
| **Forms** | `rounded-xl` inputs · navy focus ring · gold submit · inline validation |
| **Blog Card** | `rounded-2xl` · 16:9 image · gold category pill · navy title · grey excerpt |
| **Stats Counter** | Large bold gold number · navy label · count-up on scroll |
| **Testimonial Card** | White · gold stars · italic quote · circular avatar · navy name |

---

## 6. Technology Stack

### 6.1 Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | SSR/SSG for SEO, performance, scalability |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS v4 | Utility-first, consistent design |
| Animation | Framer Motion | Page transitions, scroll animations |
| Icons | Lucide React | Lightweight, consistent |
| Fonts | Next/Font (Google Fonts) | Plus Jakarta Sans + Inter |
| Forms | React Hook Form + Zod | Type-safe validation |
| State | Zustand / React Context | Lightweight global UI state |
| Maps | Google Maps React | Office location on contact page |
| Scheduling | Cal.com Embed | Demo booking |
| Analytics | Vercel Analytics + Posthog | Real-time usage and behaviour |

### 6.2 Backend & Integrations

| Service | Technology | Usage |
|---------|-----------|-------|
| Hosting | Vercel | Edge deployment, auto-scaling |
| Email | Resend | Contact forms, newsletter, auto-responders |
| CMS | Notion API / Contentful | Blog and careers management |
| Scheduling | Cal.com API | Demo booking |
| Forms | Resend + Next.js API Routes | Server-side handling |
| Search | Algolia | Blog and product search |
| Images | Vercel Image Optimization | Auto WebP conversion |
| CDN | Vercel Edge Network | Global CDN |
| Monitoring | Sentry | Error tracking |

### 6.3 Development Tools

| Tool | Usage |
|------|-------|
| VS Code | Primary IDE |
| GitHub | Version control |
| Linear | Sprint tracking |
| Figma | UI/UX design |
| Vercel | Hosting + CI/CD |
| ESLint + Prettier | Code quality |
| Husky + lint-staged | Pre-commit hooks |
| Jest + Playwright | Unit and E2E testing |

---

## 7. Features & Functionality

### 7.1 Core Features

- Responsive design — mobile (360px), tablet (768px), desktop (1280px+)
- Dark mode — system-preference aware with manual toggle
- Multilingual — English (primary), Swahili (Phase 2)
- Cookie consent banner — GDPR/Kenya DPA compliant
- Newsletter subscription — Resend double opt-in
- WhatsApp click-to-chat — floating button
- Live chat — Crisp or Intercom
- Blog RSS feed — auto-generated
- XML sitemap — next-sitemap auto-generated
- robots.txt — properly configured

### 7.2 Animations & Interactions

- Scroll-triggered animations — fade-in, slide-up (Framer Motion + Intersection Observer)
- Counter animations — stats count up on viewport entry
- Product card hover — lift, gold border, scale
- Mega menu — smooth slide-down on Products hover
- Hero parallax — subtle background on scroll
- Page transitions — smooth fade between routes
- Button micro-interactions — scale on hover, spinner on submit
- Testimonial carousel — auto-play, pause on hover, swipe on mobile

### 7.3 Accessibility

- WCAG 2.1 AA compliance target
- Semantic HTML — heading hierarchy, landmark roles, aria-labels
- Keyboard navigation — all elements reachable
- Focus indicators — gold focus rings
- Alt text — all images described
- Colour contrast — 4.5:1 minimum ratio
- Skip to main content link
- Screen reader tested — NVDA and VoiceOver

---

## 8. Content Strategy

### 8.1 Tone of Voice

**Confident · Expert · African-proud · Warm · Professional**

- Use "we" and "you" — conversational and direct
- Lead with outcomes: *"Your students perform better"* not *"We have an analytics module"*
- Use specific numbers: *"500+ schools"* not *"hundreds of schools"*
- Avoid jargon — write for a principal or hospital manager, not a developer
- African context first — reference Nairobi, M-Pesa, county governments, NHIF naturally
- Short sentences. Active voice. No passive constructions.

### 8.2 Content Production Plan

| Content Type | Quantity | Owner | Timeline |
|--------------|----------|-------|----------|
| Home page copy | 1 page | Jonathan Myles | Week 1 |
| About page copy | 1 page | Jonathan Myles | Week 1 |
| Product pages (8 live) | 8 pages | Product team | Week 2 |
| Services page copy | 1 page | Sales team | Week 2 |
| Pricing page content | Per product | Jonathan Myles | Week 2 |
| Blog launch articles | 5 articles | Content writer | Week 3–4 |
| Team bios + headshots | 2 profiles | Jonathan & Pauline | Week 1 |
| Testimonials | 5–8 quotes | Sales team | Week 3 |
| Legal pages | 3 pages | Legal counsel | Week 4 |
| Careers + 3 open roles | 4 pages | Jonathan Myles | Week 3 |

---

## 9. SEO & Performance

### 9.1 SEO Strategy

- **Technical SEO** — Auto sitemap.xml, robots.txt, canonical URLs, JSON-LD schema (Organisation, Product, Article, BreadcrumbList)
- **On-page SEO** — Unique meta title + description per page, Open Graph + Twitter Card tags
- **Keywords** — Primary: *"school management system Kenya"*, *"hospital management software Kenya"*, *"AI software Africa"*. Secondary: product and sector-specific terms
- **Blog SEO** — Long-form content, informational queries, internal linking, keyword clustering
- **Local SEO** — Google Business Profile, Nairobi/Kenya signals throughout
- **Link Building** — Guest posts on EdTech Africa, HealthTech Kenya, startup media

### 9.2 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Image optimisation, SSG, CDN |
| FID (First Input Delay) | < 100ms | Minimal JS, code splitting |
| CLS (Cumulative Layout Shift) | < 0.1 | Explicit image dimensions |
| Lighthouse Performance | > 90 | All above + lazy loading |
| Lighthouse SEO | > 95 | Complete meta + schema |
| Lighthouse Accessibility | > 90 | WCAG 2.1 AA |
| TTFB | < 200ms | Vercel Edge + static generation |

---

## 10. Integrations

| Service | Purpose | Method |
|---------|---------|--------|
| Cal.com | Demo booking | Embed + Cal.com API |
| Resend | Transactional email | API Route + Resend SDK |
| Google Analytics 4 | Traffic analytics | gtag.js via Next.js Script |
| Google Maps | Office location | Maps Embed API |
| Algolia | Site search | InstantSearch React SDK |
| Crisp / Intercom | Live chat | Script embed |
| Hotjar / Posthog | Heatmaps, session recordings | Script embed |
| WhatsApp Business | Click-to-chat | wa.me link |
| Notion API | Blog & careers CMS | API Route + Notion SDK |
| Sentry | Error monitoring | Next.js Sentry plugin |
| Vercel Analytics | Web vitals | Built-in integration |

---

## 11. Security & Compliance

- **HTTPS enforced** — Vercel auto-provisioned SSL/TLS on all pages
- **CSP headers** — Content Security Policy via `next.config.js`
- **Rate limiting** — API routes protected via Vercel Edge middleware
- **Spam protection** — Honeypot fields + reCAPTCHA v3 on all public forms
- **Environment variables** — All API keys in Vercel env vars, never in code
- **Dependency scanning** — Dependabot alerts on GitHub
- **Kenya DPA 2019** — Compliant data handling, privacy policy, cookie consent
- **GDPR-ready** — For European visitors and partners
- **No sensitive data stored** — Contact forms forwarded via email only
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy

---

## 12. Development Phases & Timeline

### Phase 1 — Foundation (Weeks 1–3)

- [ ] Next.js 15, TypeScript, Tailwind CSS, ESLint, Prettier, Git setup
- [ ] Design system — colours, typography, base components
- [ ] Shared components — Navigation, Footer, Button, Card, Badge, SEO head
- [ ] Home page — full build
- [ ] About page — full build
- [ ] Contact page — form + Resend integration
- [ ] Book a Demo — Cal.com integration
- [ ] Legal pages — Privacy, Terms, Cookies

### Phase 2 — Core Pages (Weeks 4–6)

- [ ] Products page with sector filter and 8 live product cards
- [ ] Individual product pages for all 8 live products
- [ ] Services page
- [ ] Pricing page with comparison tables
- [ ] Blog — listing page, individual post, Notion CMS integration
- [ ] 5 launch blog articles published
- [ ] Careers page with 3 open roles

### Phase 3 — Enhancement & Launch (Weeks 7–8)

- [ ] Algolia search
- [ ] GA4, Posthog, Vercel Analytics
- [ ] Hotjar heatmaps
- [ ] Lighthouse 90+ optimisation
- [ ] Cross-browser testing — Chrome, Firefox, Safari, Edge
- [ ] Mobile testing — iPhone 14, Samsung Galaxy S23, low-end Android
- [ ] Accessibility audit and fixes
- [ ] SEO audit — sitemap, schema, meta, robots.txt
- [ ] Team soft launch and feedback
- [ ] Hard launch — DNS cutover + announcement

---

## 13. Hosting & Infrastructure

| Component | Provider | Details |
|-----------|----------|---------|
| Hosting Platform | Vercel Pro | Custom domain, team collaboration, analytics |
| Domain | mylesoft.com | DNS via Vercel or Cloudflare |
| CDN | Vercel Edge Network | Auto-caching of static assets |
| SSL Certificate | Vercel (auto) | Auto-renewed Let's Encrypt |
| CI/CD | GitHub → Vercel | Auto-deploy on push to `main`. Preview URLs on PRs |
| Environments | Production + Preview | `main` → production \| `develop` → preview.mylesoft.com |
| Image Storage | Vercel Blob / Cloudinary | Product images, team photos, blog thumbnails |
| Monitoring | Vercel + Sentry | Uptime, errors, performance |
| Backups | GitHub | Full version history retained |

---

## 14. Appendices

**Appendix A — Figma Design Files**  
Link to be added when designs are complete.

**Appendix B — Brand Assets**  
All logos, icons, and images: `github.com/Mylesoft-Technologies/.github/tree/main/assets`

**Appendix C — API Documentation**  
Internal API routes: `docs.mylesoft.com`

**Appendix D — Content Brief Template**  
Separate document for content writers covering tone, SEO brief, word count, and page structure.

**Appendix E — Competitor Analysis**  
Review of comparable EdTech, HealthTech, and AgriTech websites in East Africa and globally.

---

*Transforming Industries, Empowering Generations.*  
*© 2026 Mylesoft Technologies Limited. All Rights Reserved.*
