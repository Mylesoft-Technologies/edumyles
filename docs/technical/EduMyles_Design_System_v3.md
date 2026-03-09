# EduMyles Design System v3.0
### The Unified Master Reference
**UI/UX Standards + Colour System + Developer Guide**

**Owner:** Jonathan Ayany (Myles) — Mylesoft Technologies  
**Contact:** ayany004@gmail.com | 0743993715 | 0751812884  
**Repository:** github.com/Mylesoft-Technologies/edumyles  
**Date:** March 2026 | **Classification:** Internal — All Teams

---

## Table of Contents

1. [Design Philosophy & Principles](#01-design-philosophy--principles)
2. [Colour Palette — Core Swatches](#02-colour-palette--core-swatches)
3. [Design Tokens — CSS Variables](#03-design-tokens--css-variables)
4. [Tailwind CSS & React Native Config](#04-tailwind-css--react-native-config)
5. [Typography System](#05-typography-system)
6. [Button System & Hierarchy](#06-button-system--hierarchy)
7. [Component Usage Rules (19 Components)](#07-component-usage-rules)
8. [Role-Based Colour Coding](#08-role-based-colour-coding)
9. [Layout & Grid System](#09-layout--grid-system)
10. [Spacing & Elevation System](#10-spacing--elevation-system)
11. [Card Component Rules](#11-card-component-rules)
12. [Icon Guidelines](#12-icon-guidelines)
13. [Animation Guidelines](#13-animation-guidelines)
14. [Semantic Alert System](#14-semantic-alert-system)
15. [Data Visualisation Palette](#15-data-visualisation-palette)
16. [Payment UI & M-Pesa Trust Colours](#16-payment-ui--m-pesa-trust-colours)
17. [Progress & Grade Indicators](#17-progress--grade-indicators)
18. [Skeleton Loaders & Empty States](#18-skeleton-loaders--empty-states)
19. [Accessibility — WCAG Compliance](#19-accessibility--wcag-compliance)
20. [Dark Mode Token Overrides](#20-dark-mode-token-overrides)
21. [Email & Notification Templates](#21-email--notification-templates)
22. [Print Styles](#22-print-styles)
23. [Component Reuse Policy](#23-component-reuse-policy)
24. [Developer Rules & Code Standards](#24-developer-rules--code-standards)
25. [Do's and Don'ts](#25-dos-and-donts)
26. [Governance & Versioning](#26-governance--versioning)

> This document is the single source of truth for all design decisions across EduMyles — web, mobile, email, and print surfaces. Every developer, designer, and QA engineer must follow these specifications. Never introduce a colour, component, or pattern not defined here without going through the governance process in Section 26.

---

## 01 Design Philosophy & Principles

EduMyles follows a clean, modern SaaS design style. As a school management platform serving administrators, teachers, finance officers, parents, and students, every design decision prioritises trust, clarity, and usability across all user roles.

### Core Values

- **Simplicity:** Remove visual noise. Every element must earn its place on screen.
- **Accessibility:** All interfaces meet WCAG 2.1 AA minimum. AAA preferred for body text.
- **Clarity:** Information hierarchy must be immediately obvious. Users should never guess what to do next.
- **Consistency:** Same problem, same solution. Reuse components and patterns across the entire platform.
- **Professional Trust:** A school's financial and academic data demands a trustworthy, polished interface.

### Design Principles (In Priority Order)

1. Consistency over creativity — never invent a new pattern when an existing one works.
2. Whitespace improves readability — generous padding and margins are mandatory.
3. Actions must be obvious — primary CTAs are visible, secondary actions are discoverable.
4. Information hierarchy must be clear — headings, body, and metadata are visually distinct.
5. Mobile-first thinking — every layout must work at 360px width before scaling up.
6. Performance matters — no heavy animations, no unnecessary DOM elements, no layout shifts.

---

## 02 Colour Palette — Core Swatches

These are the eight approved colours for EduMyles. Each has exactly one defined role. Do not use them interchangeably. All hex values below are the final resolved values from the v1.0/v2.0 merge.

| Colour Name | Hex | Token | Role / Usage |
|---|---|---|---|
| Dark Green | `#1A4731` | `--em-primary` | Primary brand. Navbar, sidebar, headers, footer backgrounds |
| Emerald | `#16A34A` | `--em-primary-light` | Success states, primary CTAs, active nav, progress fills |
| Deep Green | `#0F2E20` | `--em-primary-dark` | Sidebar dark, footer, deep contrast areas |
| Navy Blue | `#1E3A8A` | `--em-info` | Informational states, data links, info badges, stats |
| Amber / Gold | `#F59E0B` | `--em-accent` | Warnings, fee due, announcements, pending badges |
| Alert Red | `#DC2626` | `--em-danger` | Errors, overdue fees, suspensions, critical danger ONLY |
| Dark Gray | `#1E293B` | `--em-text-primary` | Primary text, headings on white/light backgrounds |
| Mid Gray | `#64748B` | `--em-text-secondary` | Secondary text, placeholders, metadata, timestamps |

### Extended Neutral Scale

| Token Name | Hex Value | Usage |
|---|---|---|
| neutral-50 | `#F8FAFC` | Page background, outer wrapper |
| neutral-100 | `#F1F5F9` | Input backgrounds, zebra rows, muted surfaces |
| neutral-200 | `#E2E8F0` | Borders, dividers, skeleton base |
| neutral-400 | `#94A3B8` | Disabled text, placeholders |
| neutral-500 | `#64748B` | Secondary / helper text |
| neutral-700 | `#334155` | Dark borders in dark mode |
| neutral-900 | `#0F172A` | Code block backgrounds, tooltips |

### Marketing Accent (Legacy)

The brighter yellow (`#FFD731`) from v1.0 may be retained strictly for marketing landing pages and highlight sections. It must **never** be used inside the product UI — use `#F59E0B` (`--em-accent`) for all in-app warning and accent states.

> **CRITICAL RESOLUTION — CTA Button Colour:** All primary call-to-action buttons across EduMyles use Emerald Green (`#16A34A`). Red (`#DC2626`) is reserved exclusively for destructive actions (Delete, Suspend, Expel). This was the single most important conflict resolved between v1.0 and v2.0. Green signals "go, safe, action" — appropriate for a school management platform. Red signals "danger, stop" and must never be used for positive CTAs.

---

## 03 Design Tokens — CSS Variables

Define all tokens in a single global CSS file (`globals.css` or `tokens.css`). Import this file at the root of your Next.js app. **NEVER hardcode hex values anywhere else in the codebase.**

```css
/* ================================================= */
/* EduMyles Design Tokens v3.0 — globals.css         */
/* ================================================= */
:root {
  /* Brand */
  --em-primary: #1A4731;
  --em-primary-light: #16A34A;
  --em-primary-dark: #0F2E20;
  --em-primary-10: rgba(26,71,49,0.10);

  /* Accent */
  --em-accent: #F59E0B;
  --em-accent-light: #FDE68A;
  --em-accent-dark: #B45309;

  /* Semantic */
  --em-info: #1E3A8A;
  --em-info-bg: #DBEAFE;
  --em-success: #16A34A;
  --em-success-bg: #DCFCE7;
  --em-warning: #F59E0B;
  --em-warning-bg: #FEF9C3;
  --em-danger: #DC2626;
  --em-danger-bg: #FEE2E2;

  /* Text */
  --em-text-primary: #1E293B;
  --em-text-secondary: #64748B;
  --em-text-disabled: #94A3B8;
  --em-text-inverse: #FFFFFF;

  /* Surfaces */
  --em-bg-base: #FFFFFF;
  --em-bg-subtle: #F8FAFC;
  --em-bg-muted: #F1F5F9;
  --em-border: #E2E8F0;
  --em-border-strong: #CBD5E1;

  /* Elevation Shadows */
  --em-shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --em-shadow-md: 0 4px 12px rgba(0,0,0,0.10);
  --em-shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --em-shadow-xl: 0 16px 40px rgba(0,0,0,0.15);
}
```

> **Token naming convention:** All tokens use the `--em-*` prefix (EduMyles). This is shorter and semantic compared to the legacy `--color-brand-*` naming from v1.0 which is now deprecated.

---

## 04 Tailwind CSS & React Native Config

### Tailwind CSS — `tailwind.config.js`

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A4731', light: '#16A34A',
          dark: '#0F2E20', '10': 'rgba(26,71,49,0.10)'
        },
        accent: {
          DEFAULT: '#F59E0B', light: '#FDE68A', dark: '#B45309'
        },
        info:    { DEFAULT: '#1E3A8A', bg: '#DBEAFE' },
        success: { DEFAULT: '#16A34A', bg: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', bg: '#FEF9C3' },
        danger:  { DEFAULT: '#DC2626', bg: '#FEE2E2' },
        neutral: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
          400: '#94A3B8', 500: '#64748B', 700: '#334155',
          900: '#0F172A'
        },
      },
      boxShadow: {
        'em-sm': '0 1px 3px rgba(0,0,0,0.08)',
        'em-md': '0 4px 12px rgba(0,0,0,0.10)',
        'em-lg': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
};
```

### React Native / Expo — `theme/colors.ts`

```ts
export const Colors = {
  primary: '#1A4731',
  primaryLight: '#16A34A',
  primaryDark: '#0F2E20',
  primaryOverlay: 'rgba(26,71,49,0.10)',
  accent: '#F59E0B',
  accentLight: '#FDE68A',
  info: '#1E3A8A',   infoBg: '#DBEAFE',
  success: '#16A34A', successBg: '#DCFCE7',
  warning: '#F59E0B', warningBg: '#FEF9C3',
  danger: '#DC2626',  dangerBg: '#FEE2E2',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  textInverse: '#FFFFFF',
  bgBase: '#FFFFFF',
  bgSubtle: '#F8FAFC',
  bgMuted: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
```

---

## 05 Typography System

EduMyles uses a two-font system: **Poppins** for marketing/landing pages and **Inter** (with system fallbacks) for the product dashboard. Both are Google Fonts, free for commercial use.

| Element | Font | Size / Weight | Text Colour | Background | Notes |
|---|---|---|---|---|---|
| Page Title (H1) | Poppins / Inter | 28px / 700 | `#1A4731` | Light bg | Brand green for authority |
| Section Title (H2) | Poppins / Inter | 22px / 700 | `#1E293B` | Any light | Dark gray, neutral |
| Card Title (H3) | Inter | 16px / 600 | `#1E293B` | `#FFFFFF` | Consistent with H2 |
| Body Text | Inter / System | 14px / 400 | `#1E293B` | `#FFFFFF` | Minimum readable size |
| Caption / Meta | Inter / System | 12px / 400 | `#64748B` | Any light | Timestamps, helpers |
| Input Label | Inter / System | 13px / 500 | `#1E293B` | Transparent | Above input fields |
| Placeholder | Inter / System | 13px / 400 | `#94A3B8` | `#FFFFFF` | Inside inputs |
| Link | Inter / System | 14px / 500 | `#1E3A8A` | Any light | Hover: `#16A34A` underline |
| Nav Active | Inter / System | 14px / 600 | `#FFFFFF` | `--em-primary` | Left emerald 3px border |
| Nav Idle | Inter / System | 14px / 400 | `#A7F3D0` | `--em-primary` | Hover: white |
| Button Text | Inter / System | 14px / 600 | `#FFFFFF` | `--em-primary-light` | Always bold |
| Badge Text | Inter / System | 11px / 600 | Role bg | Role light bg | ALL CAPS, 0.5 spacing |
| Code / Mono | JetBrains Mono | 13px / 400 | `#E2E8F0` | `#0F172A` | Technical displays only |

### Typography Rules

- Avoid long paragraphs — keep to 3–4 sentences max per block.
- Use a maximum line width of 60–70 characters for readability.
- Keep section headings clear and descriptive.
- **Never use white text on Amber (`#F59E0B`)** — it fails WCAG. Always use `#1E293B` dark text on amber.
- Marketing pages use Poppins; product UI uses Inter with system fallbacks.
- Minimum font size anywhere in the product is 12px (captions/meta). Never go below.

---

## 06 Button System & Hierarchy

Buttons follow a strict hierarchy. Every screen has at most one primary CTA. Secondary and ghost buttons support additional actions without competing for attention.

| Type | Background | Text | Border | Hover | Usage Examples |
|---|---|---|---|---|---|
| Primary CTA | `#16A34A` (Emerald) | White | None | Darken 8% / Opacity 50% disabled | Get Started, Save, Confirm, Activate Trial, Create School, Pay Now |
| Secondary | Transparent | `#1A4731` (Dark Green) | `#1A4731` (1px solid) | bg: `--em-primary-10` / border: Emerald | Contact Sales, Learn More, Cancel, Back |
| Danger | `#DC2626` (Alert Red) | White | None | Darken 8% | Delete, Suspend, Expel — ONLY destructive actions |
| Ghost | Transparent | `#1E293B` (Dark Gray) | `#E2E8F0` (Border) | bg: `--em-bg-muted` | Filter, Sort, Minor actions |

### Button Rules

- Primary CTA is **ALWAYS** Emerald Green (`#16A34A`). Never red for positive actions.
- Only one primary CTA per screen / modal / card.
- Minimum button height: **44px** (touch target accessibility).
- Button text is always 14px / 600 weight.
- Disabled state: opacity 50%, cursor not-allowed.
- Loading state: show spinner inside button, keep button width stable.
- Red (Danger) buttons require a confirmation dialog before executing.

---

## 07 Component Usage Rules

| Component | Background | Text / Icon | Border / Accent | State Notes |
|---|---|---|---|---|
| Navbar | `--em-primary` | `--em-text-inverse` | `--em-primary-light` (active) | Active: left 3px Emerald border |
| Sidebar | `--em-primary-dark` | `--em-text-inverse` | `--em-primary-light` | Hover bg: `--em-primary-10` |
| Primary CTA Btn | `--em-primary-light` | `--em-text-inverse` | None | Hover: darken 8%. Disabled: 50% |
| Secondary Btn | Transparent | `--em-primary` | `--em-primary` (1px) | Hover bg: `--em-primary-10` |
| Danger Btn | `--em-danger` | `--em-text-inverse` | None | Delete / Suspend / Expel only |
| Ghost Btn | Transparent | `--em-text-primary` | `--em-border` | Hover bg: `--em-bg-muted` |
| Input / Select | `--em-bg-base` | `--em-text-primary` | `--em-border` | Focus: `--em-primary-light` 2px |
| Input (Error) | `--em-bg-base` | `--em-text-primary` | `--em-danger` | Error msg in `--em-danger` below |
| Cards | `--em-bg-base` | `--em-text-primary` | `--em-border` | Shadow: `--em-shadow-sm` |
| Table Header | `--em-primary` | `--em-text-inverse` | None | Sticky header recommended |
| Table Rows | bg-base / bg-subtle | `--em-text-primary` | `--em-border` | Zebra: alternate backgrounds |
| Modal Overlay | `rgba(0,0,0,0.50)` | — | — | Card: bg-base + shadow-xl |
| Tooltip | neutral-900 | `--em-text-inverse` | None | Max width 220px |
| Badge Success | `--em-success-bg` | `--em-success` | None | Font weight 600 |
| Badge Warning | `--em-warning-bg` | `--em-accent-dark` | None | Font weight 600 |
| Badge Danger | `--em-danger-bg` | `--em-danger` | None | Font weight 600 |
| Badge Info | `--em-info-bg` | `--em-info` | None | Font weight 600 |
| Footer | `--em-primary-dark` | `--em-text-inverse` | `--em-primary` (top 1px) | Links: `#6EE7B7`, hover: white |
| Page Background | `--em-bg-subtle` | — | — | Never use pure white as outermost bg |

---

## 08 Role-Based Colour Coding

Each user role has a dedicated identity colour used for badges, avatars, dashboard accents, and sidebar header tints.

| Role | Primary Hex | Light Hex | Text on Primary | Rationale |
|---|---|---|---|---|
| Super Admin | `#1A4731` | `#DCFCE7` | White | Full system access. Primary brand green = highest trust. |
| School Admin | `#1E3A8A` | `#DBEAFE` | White | Navy conveys authority and institutional trust. |
| Teacher | `#16A34A` | `#DCFCE7` | White | Emerald = growth, learning, positive academic energy. |
| Finance Officer | `#F59E0B` | `#FEF9C3` | `#1E293B` (Dark) | Amber = money, transactions, financial attention. |
| Parent | `#0D9488` | `#CCFBF1` | White | Teal = calm, caring, non-threatening reassurance. |
| Student | `#7C3AED` | `#EDE9FE` | White | Purple = creative, energetic, youthful identity. |

### Role Colour Implementation

```ts
export const RoleColors = {
  'super-admin':    { bg: '#1A4731', text: '#FFFFFF', light: '#DCFCE7' },
  'school-admin':   { bg: '#1E3A8A', text: '#FFFFFF', light: '#DBEAFE' },
  'teacher':        { bg: '#16A34A', text: '#FFFFFF', light: '#DCFCE7' },
  'finance-officer':{ bg: '#F59E0B', text: '#1E293B', light: '#FEF9C3' },
  'parent':         { bg: '#0D9488', text: '#FFFFFF', light: '#CCFBF1' },
  'student':        { bg: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE' },
} as const;
```

---

## 09 Layout & Grid System

- **Maximum page width:** 1200px (centered)
- **Section vertical spacing:** 5rem (80px)
- **Primary mobile breakpoint:** 900px
- **Minimum supported viewport:** 360px

| Grid Type | Columns | Use Case | Collapse Behaviour |
|---|---|---|---|
| 2-Column | 2 | Text + image sections, split layouts | Stack vertically at 900px |
| 3-Column | 3 | Feature cards, module listings | 2-col at 900px, 1-col at 600px |
| 4-Column | 4 | Pricing tables, comparison grids | 2-col at 900px, 1-col at 600px |
| Sidebar + Main | 1 + 1 | Dashboard layout (sidebar 260px) | Sidebar collapses to drawer at 900px |
| Full Width | 1 | Hero sections, empty states | Padding adjusts at breakpoints |

### Responsive Breakpoints

| Breakpoint | Width | Behaviour |
|---|---|---|
| Mobile Small | < 480px | Single column, stacked nav, hamburger menu |
| Mobile | 480px – 767px | Single column, bottom nav optional |
| Tablet | 768px – 899px | 2-column where applicable, sidebar drawer |
| Desktop | 900px – 1200px | Full layout, sidebar visible, all columns |
| Wide | > 1200px | Content centered, max-width 1200px applied |

---

## 10 Spacing & Elevation System

### Spacing Tokens

Use these tokens for all margins, padding, and gaps. **Never use arbitrary values like `margin: 37px`.**

| Token | Size | Common Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps between inline elements, icon-to-text |
| `--space-2` | 8px | Small padding inside badges, compact lists |
| `--space-4` | 16px | Standard card padding, form field gaps |
| `--space-6` | 24px | Section sub-headings, grouped element spacing |
| `--space-8` | 32px | Card-to-card gaps, major section breaks within a page |
| `--space-12` | 48px | Section-level vertical padding |
| `--space-16` | 64px | Page section spacing, hero content padding |

### Elevation Shadows

Elevation is communicated through shadows, not just z-index. All shadow colours use black at low opacity — never use coloured shadows.

| Token | CSS Value | Used On |
|---|---|---|
| `--em-shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Default cards, inputs, nav items |
| `--em-shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Hover states, dropdowns, popovers |
| `--em-shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals, drawers, floating menus |
| `--em-shadow-xl` | `0 16px 40px rgba(0,0,0,0.15)` | Full-screen modals, command palettes |

### Hover Overlay Pattern

```css
.nav-item:hover   { background: var(--em-primary-10); }
.table-row:hover  { background: var(--em-bg-muted); }
.card:hover       { box-shadow: var(--em-shadow-md); }
.btn-secondary:hover { background: var(--em-primary-10); }
```

---

## 11 Card Component Rules

Cards are used for features, pricing, testimonials, modules, student profiles, and dashboard widgets.

### Standard Card Styling

- **Border Radius:** 18px
- **Padding:** 2rem (32px)
- **Background:** White (`#FFFFFF`) — token: `--em-bg-base`
- **Shadow:** `--em-shadow-sm` (soft, subtle)
- **Border:** 1px solid `--em-border` (`#E2E8F0`)
- **Hover Effect:** `transform: translateY(-3px)` + shadow upgrade to `--em-shadow-md`
- **Transition:** `transition: all 0.2s ease`

> **RULE:** Never use heavy shadows on cards. Never use coloured borders on cards unless it is a selected/active state (in which case use `--em-primary-light` 2px border).

---

## 12 Icon Guidelines

**Recommended icon libraries (in order of preference):**

1. **Lucide Icons** — primary library for web (Next.js). Install: `npm install lucide-react`
2. **Heroicons** — acceptable alternative. Same outline style. Install: `npm install @heroicons/react`
3. **React Native:** use `lucide-react-native` or `@expo/vector-icons`

### Icon Standards

- **Style:** Outline only — never filled, never mixed styles on the same screen
- **Sizes:** 16px (inline with text), 20px (buttons, nav items), 24px (standalone, headers)
- **Colour:** Inherit text colour. Never hardcode icon colours.
- **Stroke Width:** 1.5px default, 2px for emphasis
- **Consistency:** If you use Lucide for one icon on a page, use Lucide for ALL icons on that page.

---

## 13 Animation Guidelines

All animations in EduMyles must be subtle and purposeful. Motion should provide feedback, not decoration.

### Allowed Animations

- Hover elevation on cards — `translateY(-3px)` with `0.2s ease`
- Button hover — darken background 8%, transition `0.15s`
- Dropdown/modal enter — opacity 0 to 1, `translateY(-4px)` to 0, `0.2s ease-out`
- Page transitions — fade in, `0.2s` max duration
- Skeleton shimmer — linear gradient sweep, 1.5s loop
- Focus ring — 2px outline with `0.1s` transition
- Toast notifications — slide in from top-right, `0.3s ease`

### Forbidden Animations

**NEVER use:** Bouncing animations, flashing effects, parallax scrolling, auto-playing video backgrounds, loading spinners longer than 2 seconds without a skeleton, spring physics animations, or any animation that causes layout shift (CLS).

### Animation Timing

| Type | Duration |
|---|---|
| Micro-interactions (hover, focus) | 100ms – 200ms |
| Transitions (dropdowns, modals) | 200ms – 300ms |
| Page transitions | 200ms max |
| Skeleton loops | 1500ms (1.5s) |
| Toast auto-dismiss | 4000ms – 6000ms |

> **Easing:** Use `ease-out` for enter, `ease-in` for exit. Never use `linear` for UI motion.

---

## 14 Semantic Alert System

EduMyles has four alert types. Every alert must use the correct semantic colour — never create custom alert colours.

| Type | Background | Border-Left | Heading | Body Text | Examples |
|---|---|---|---|---|---|
| Success | `#DCFCE7` | `#16A34A` (3px) | `#166534` | `#14532D` | Fee paid, enrolled, grade submitted |
| Warning | `#FEF9C3` | `#F59E0B` (3px) | `#92400E` | `#78350F` | Fee due soon, attendance < 75% |
| Danger | `#FEE2E2` | `#DC2626` (3px) | `#991B1B` | `#7F1D1D` | Overdue fees, suspended, exam failed |
| Info | `#DBEAFE` | `#1E3A8A` (3px) | `#1E40AF` | `#1E3A8A` | New policy, timetable changed, notice |

### Alert Component Code

```ts
const alertConfig = {
  success: { bg: 'bg-success-bg', border: 'border-success', heading: 'text-[#166534]' },
  warning: { bg: 'bg-warning-bg', border: 'border-warning', heading: 'text-[#92400E]' },
  danger:  { bg: 'bg-danger-bg',  border: 'border-danger',  heading: 'text-[#991B1B]' },
  info:    { bg: 'bg-info-bg',    border: 'border-info',    heading: 'text-[#1E40AF]' },
};
```

---

## 15 Data Visualisation Palette

### Categorical Palette — for multi-series charts (bar, line, pie)

| # | Hex | Token | Best Used For |
|---|---|---|---|
| 1 | `#16A34A` | `--em-chart-1` | Attendance present / fees paid / pass |
| 2 | `#1E3A8A` | `--em-chart-2` | Second series / enrolment count |
| 3 | `#F59E0B` | `--em-chart-3` | Pending / partial / in-progress |
| 4 | `#7C3AED` | `--em-chart-4` | Student metrics, assignments |
| 5 | `#0D9488` | `--em-chart-5` | Parent engagement, communication |
| 6 | `#DC2626` | `--em-chart-6` | Absent / overdue / failed — use last |

### Sequential Palette — for heatmaps, attendance grids, performance maps

| Level | Hex | Meaning |
|---|---|---|
| Very Low | `#FEE2E2` | Critical — 0–40% |
| Low | `#FEF9C3` | Poor — 41–60% |
| Medium | `#FDE68A` | Average — 61–70% |
| Good | `#DCFCE7` | Good — 71–85% |
| Excellent | `#16A34A` | Excellent — 86–100% |

### Chart Configuration Code

```ts
export const chartColors = {
  categorical: ['#16A34A', '#1E3A8A', '#F59E0B', '#7C3AED', '#0D9488', '#DC2626'],
  sequential:  ['#FEE2E2', '#FEF9C3', '#FDE68A', '#DCFCE7', '#16A34A'],
  grid: '#E2E8F0',
  axis: '#64748B',
  tooltip_bg: '#1E293B',
  tooltip_text: '#F1F5F9',
};
```

---

## 16 Payment UI & M-Pesa Trust Colours

Payment screens require extra trust-building. Apply these rules strictly on all fee payment, M-Pesa, Airtel Money, and Stripe screens.

| Element | Colour / Hex | Reason |
|---|---|---|
| Payment page background | `#F8FAFC` (Light Gray) | Neutral, non-threatening — signals safety |
| Payment card / container | White + shadow-md | Clean, clinical — like a bank form |
| Pay Now button | `#16A34A` (Emerald) | Green = go, confirmed, safe. Not red. |
| Amount display | `#1E293B` (Bold) | Large, clear, no ambiguity on amount |
| M-Pesa logo area | White card | Never tint M-Pesa brand colours |
| Stripe card input | White + green focus | Trust + brand consistency |
| Success confirmation | `#DCFCE7` (Success bg) | Positive reinforcement |
| Pending / processing | `#FEF9C3` (Amber bg) | Communicates 'wait, not failed' |
| Failed / declined | `#FEE2E2` (Danger bg) | Clear failure, with retry option |
| Security lock icon | `#16A34A` (Emerald) | Green lock = secure, verified |
| Transaction reference | Mono + `#64748B` | Small, secondary — not alarming |
| Receipt download | `#1A4731` border (outline) | Non-distracting — task complete |

> **CRITICAL:** Never use red anywhere on the payment flow unless a transaction has definitively failed. Amber handles all in-progress or pending states.

---

## 17 Progress & Grade Indicators

| Grade | Range | Background | Text Colour | Label |
|---|---|---|---|---|
| A | 86–100% | `#DCFCE7` | `#16A34A` | Excellent |
| B | 71–85% | `#ECFCCB` | `#65A30D` | Good |
| C | 61–70% | `#FEF9C3` | `#F59E0B` | Average |
| D | 41–60% | `#FFEDD5` | `#EA580C` | Below Average |
| F | 0–40% | `#FEE2E2` | `#DC2626` | Failing |

### Grade Colour Utility Function

```ts
export function getGradeColor(score: number) {
  if (score >= 86) return { bg: '#DCFCE7', text: '#16A34A', label: 'Excellent' };
  if (score >= 71) return { bg: '#ECFCCB', text: '#65A30D', label: 'Good' };
  if (score >= 61) return { bg: '#FEF9C3', text: '#F59E0B', label: 'Average' };
  if (score >= 41) return { bg: '#FFEDD5', text: '#EA580C', label: 'Below Avg' };
  return { bg: '#FEE2E2', text: '#DC2626', label: 'Failing' };
}
```

---

## 18 Skeleton Loaders & Empty States

| Element | Base Colour | Shimmer Colour | Notes |
|---|---|---|---|
| Skeleton block | `#E2E8F0` | `#F1F5F9` | Animate shimmer L to R, 1.5s loop |
| Skeleton avatar | `#E2E8F0` | `#F8FAFC` | Circular shape, same animation |
| Skeleton text line | `#E2E8F0` | `#F1F5F9` | Vary widths: 100%, 80%, 60% |
| Empty state bg | `#F1F5F9` | — | Light gray container, no brand colours |
| Empty state icon | `#94A3B8` | — | Neutral, non-alarming |
| Empty state heading | `#1E293B` | — | Clear but not urgent |
| Empty state CTA | `#16A34A` | — | Actionable: 'Add First Student' |

### Skeleton Shimmer CSS

```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(90deg,
    #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
```

---

## 19 Accessibility — WCAG Compliance

All text must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text). AAA (7:1) is preferred for body copy.

| Combination | Foreground | Background | Ratio | AA | AAA |
|---|---|---|---|---|---|
| Primary on White | `#1A4731` | `#FFFFFF` | 10.3:1 | ✅ Pass | ✅ Pass |
| White on Primary | `#FFFFFF` | `#1A4731` | 10.3:1 | ✅ Pass | ✅ Pass |
| Emerald on White | `#16A34A` | `#FFFFFF` | 4.6:1 | ✅ Pass | ❌ Fail |
| White on Emerald | `#FFFFFF` | `#16A34A` | 4.6:1 | ✅ Pass | ❌ Fail |
| Dark Gray on White | `#1E293B` | `#FFFFFF` | 15.1:1 | ✅ Pass | ✅ Pass |
| Mid Gray on White | `#64748B` | `#FFFFFF` | 4.7:1 | ✅ Pass | ❌ Fail |
| White on Navy | `#FFFFFF` | `#1E3A8A` | 8.6:1 | ✅ Pass | ✅ Pass |
| White on Red | `#FFFFFF` | `#DC2626` | 4.5:1 | ✅ Pass | ❌ Fail |
| Dark on Amber | `#1E293B` | `#F59E0B` | 6.7:1 | ✅ Pass | ❌ Fail |
| **White on Amber** | `#FFFFFF` | `#F59E0B` | **2.8:1** | ❌ **FAIL** | ❌ **FAIL** |
| Dark on Warning bg | `#92400E` | `#FEF9C3` | 7.2:1 | ✅ Pass | ✅ Pass |
| Dark on Success bg | `#166534` | `#DCFCE7` | 6.9:1 | ✅ Pass | ❌ Fail |
| Dark on Danger bg | `#991B1B` | `#FEE2E2` | 6.1:1 | ✅ Pass | ❌ Fail |
| Dark on Info bg | `#1E3A8A` | `#DBEAFE` | 5.8:1 | ✅ Pass | ❌ Fail |
| White on Teal | `#FFFFFF` | `#0D9488` | 4.6:1 | ✅ Pass | ❌ Fail |
| White on Purple | `#FFFFFF` | `#7C3AED` | 5.1:1 | ✅ Pass | ❌ Fail |

> **CRITICAL:** Never use white text on Amber (`#F59E0B`) for ANY text size — it fails WCAG at 2.8:1. Always pair amber backgrounds with `#1E293B` dark text.

---

## 20 Dark Mode Token Overrides

Dark mode is activated by adding the class `'dark'` to the HTML element. Brand and semantic colours remain unchanged. Only surface and text tokens are overridden.

```css
.dark {
  --em-bg-base: #0F172A;
  --em-bg-subtle: #1E293B;
  --em-bg-muted: #334155;
  --em-text-primary: #F1F5F9;
  --em-text-secondary: #94A3B8;
  --em-text-disabled: #475569;
  --em-border: #334155;
  --em-border-strong: #475569;

  /* Semantic bgs go darker */
  --em-success-bg: #14532D;
  --em-warning-bg: #78350F;
  --em-danger-bg: #7F1D1D;
  --em-info-bg: #1E3A8A;

  /* Brand stays recognisable */
  --em-primary: #1A4731;
  --em-primary-light: #16A34A;
  --em-accent: #F59E0B;
}
```

**Tailwind Usage:**
```html
class="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50"
```

---

## 21 Email & Notification Templates

Transactional emails use inline styles only — never external CSS (email clients strip it).

| Section | Background | Text | Notes |
|---|---|---|---|
| Outer wrapper | `#F8FAFC` | — | Prevents white-on-white in some clients |
| Container (600px) | `#FFFFFF` | — | Max-width 600px, center aligned |
| Header / logo bar | `#1A4731` | `#FFFFFF` | Logo + school name. Height 70–80px |
| Hero / title area | `#1A4731` | `#FFFFFF` | Bold heading, brief subtext |
| Body content | `#FFFFFF` | `#1E293B` | 14px / line-height 1.6 minimum |
| Key info block | `#F8FAFC` | `#1E293B` | Amount due, student name, dates |
| Primary CTA button | `#16A34A` | `#FFFFFF` | Rounded 6px. Min 44px tall. |
| Success receipt | `#DCFCE7` | `#166534` | Fee paid / enrollment confirmed |
| Warning strip | `#FEF9C3` | `#92400E` | Fee due reminder |
| Danger strip | `#FEE2E2` | `#991B1B` | Overdue / suspended notice |
| Footer | `#1E293B` | `#94A3B8` | Links, unsubscribe, address |
| Footer links | — | `#6EE7B7` | Hover: `#FFFFFF` |

---

## 22 Print Styles

Report cards, fee statements, admission letters, and transcripts are printed. Use print CSS to strip unnecessary colour and save ink.

| Element | Screen Colour | Print Colour | Reason |
|---|---|---|---|
| Page background | `#F8FAFC` | `#FFFFFF` | Saves ink |
| Navbar / sidebar | `#1A4731` | Hidden (`display:none`) | Not needed in print |
| Headings | `#1A4731` | `#000000` | Saves colour ink |
| Body text | `#1E293B` | `#000000` | Maximum legibility |
| Table headers | `#1A4731` bg | Bold text, no fill | Avoids ink blobs |
| Grade — Pass | `#16A34A` bg | 2px border, no fill | Ink-friendly |
| Grade — Fail | `#DC2626` bg | 2px border + label | Ink-friendly |
| Borders | `#E2E8F0` | `#CCCCCC` | Darker for print clarity |
| Buttons / CTAs | `#16A34A` | Hidden | No interactive elements |
| Links | `#1E3A8A` | Show URL in () | Printed links need visible URL |
| School letterhead | Full brand | Keep brand colours | Official docs need identity |

### Print CSS

```css
@media print {
  nav, aside, .sidebar, .btn, .no-print {
    display: none !important;
  }
  body { background: #fff; color: #000; font-size: 11pt; }
  h1, h2, h3 { color: #000; }
  a::after { content: ' (' attr(href) ')'; font-size: 9pt; }
  table { border-collapse: collapse; }
  th { background: #f0f0f0 !important; color: #000 !important; }
  .page-break { page-break-before: always; }
}
```

---

## 23 Component Reuse Policy

Before creating any new component, every developer must follow this checklist:

- Check existing components in the `/components` directory first.
- If an existing component can be extended with props, extend it — do not duplicate.
- Reuse existing styles from the design token system. Never create one-off CSS.
- If a truly new component is required, add it to `components/` with a descriptive name.
- Document the new component in this design system (submit a PR to update this doc).
- All new components must follow the token system (`--em-*`) for all colours, spacing, and shadows.
- Components must be responsive by default — test at 360px, 768px, and 1200px.
- Components must support dark mode via `.dark` class token overrides.

### File Organisation

| File | Purpose |
|---|---|
| `globals.css` | Design tokens, base styles, CSS custom properties |
| `components/` | Reusable UI components (Button, Card, Badge, Alert, etc.) |
| `theme/colors.ts` | React Native colour constants |
| `tailwind.config.js` | Tailwind theme extensions matching tokens |
| `lib/utils.ts` | Utility functions (`getGradeColor`, `RoleColors`, etc.) |

---

## 24 Developer Rules & Code Standards

1. Use design tokens (`--em-*`) for every colour, shadow, and spacing value. Zero hardcoded hex values.
2. Do not introduce new colours without going through the governance process (Section 26).
3. Maintain spacing consistency using `--space-*` tokens. No arbitrary pixel values.
4. Keep components reusable — check `/components` before creating anything new.
5. Follow the typography hierarchy exactly — Poppins/Inter, correct sizes, correct weights.
6. Every PR must be reviewed for UI consistency against this design system document.
7. Test all UI changes at minimum 3 breakpoints: 360px (mobile), 768px (tablet), 1200px (desktop).
8. Run WCAG contrast checks before shipping any new colour combination (use WebAIM Contrast Checker).
9. All interactive elements must have visible focus states (2px `--em-primary-light` outline).
10. Loading states must use skeleton loaders, never blank white screens.
11. Payment screens follow Section 16 strictly — no exceptions.
12. Grade and progress indicators follow the 5-step scale in Section 17 — no custom colours.
13. Email templates use inline styles only — no external CSS (email clients strip it).
14. Print stylesheets must be tested before shipping any printable document (report cards, receipts).
15. Dark mode must work for every new component — test with `.dark` class on HTML element.

---

## 25 Do's and Don'ts

| ✅ DO | ❌ DON'T |
|---|---|
| Use CSS tokens (`--em-*`) everywhere | Hardcode hex values in components |
| Use Emerald for all primary CTAs | Mix red and amber as CTA colours |
| Use Dark Green for nav/sidebar only | Apply Dark Green to random sections |
| Reserve Red for destructive actions only | Use Red decoratively or for highlights |
| Use `#1E293B` dark text on Amber bgs | Place white text on Amber — fails WCAG |
| Use Light Gray (`#F8FAFC`) as outer page bg | Use pure white (`#FFF`) as outermost bg |
| Use Navy for info/data-heavy UI states | Swap Navy and Dark Green interchangeably |
| Maintain role colours per role consistently | Change role colours by personal preference |
| Apply semantic alert colours strictly | Create custom one-off alert colours |
| Use the 5-step grade scale for all metrics | Invent new colours for pass/fail states |
| Follow WCAG contrast table (Section 19) | Ship UI without checking contrast ratios |
| Use skeleton shimmer for loading states | Show blank white screens while loading |
| Use print CSS to strip colours for printing | Send brand-heavy dark pages to printer |
| Go through governance to add new colours | Add new hex values without documenting |
| Test at 360px, 768px, and 1200px | Only test on desktop before shipping |
| Use Lucide/Heroicons outline icons | Mix filled and outline icon styles |
| Use subtle hover animations (0.2s ease) | Add bouncing or flashing animations |

---

## 26 Governance & Versioning

### Colour & Design Governance Process

| Step | Action | Owner |
|---|---|---|
| 1 | Identify the need — what existing token does not cover the use case? | Developer / Designer |
| 2 | Check WCAG compliance for the proposed new colour (WebAIM Contrast Checker) | Requester |
| 3 | Submit a PR to the design token file with proposed addition and justification | Developer |
| 4 | Review and approve PR — check token naming consistency | Jonathan Ayany (Mylesoft) |
| 5 | Update this document with new token + update the changelog below | Document Owner |
| 6 | Announce the change in team Slack/Notion channel | Tech Lead |

### Version Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0 | March 2025 | Jonathan Ayany | Initial UI/UX Standards — layout, buttons, cards, spacing, icons, animation |
| v2.0 | March 2026 | Jonathan Ayany | Colour Guide — palette, tokens, role colours, data viz, accessibility, dark mode, alerts, payment UI |
| v3.0 | March 2026 | Jonathan Ayany | UNIFIED MASTER — Merged v1.0 + v2.0. Resolved all 8 conflicts (CTA colour, brand green, token naming, etc.) |

### Future Roadmap

- **Figma Component Library** — Create a living Figma design kit from the merged token set.
- **Storybook Integration** — Visual regression testing for all components.
- **UI Testing Guidelines** — Automated Chromatic visual regression in CI/CD pipeline.
- **Accessibility Audit** — Full WCAG 2.1 AAA compliance pass for all body text.
- **Component Library Package** — Publish as internal npm package for cross-project reuse.
- **Motion Design Tokens** — Formalise animation durations and easing as CSS custom properties.

---

*EduMyles Design System v3.0 — The Unified Master Reference*  
**Jonathan Ayany (Myles)** | ayany004@gmail.com | 0743993715 | 0751812884  
github.com/Mylesoft-Technologies/edumyles  
© 2026 Mylesoft Technologies. All rights reserved.
