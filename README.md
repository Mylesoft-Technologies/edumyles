# EduMyles

> Multi-tenant, modular school management platform for East Africa.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS + shadcn/ui |
| Backend | Convex (real-time serverless DB + compute) |
| Auth | WorkOS (magic links, SSO, Organizations) |
| Mobile | React Native (Expo) |
| SMS | Africa's Talking |
| Email | Resend + React Email |
| Payments | M-Pesa (Daraja), Airtel Money, Stripe, Bank Transfer |
| Hosting | Vercel (subdomain routing) |

---

## Repository Structure

```
edumyles/
│
├── frontend/              # Next.js App Router — school portal ({slug}.edumyles.com)
│   └── src/
│       ├── app/           # Route segments (auth, dashboard, admin)
│       ├── components/    # UI components (ui, forms, tables)
│       ├── hooks/         # Convex subscription hooks
│       └── lib/           # Utilities, constants, formatters
│
├── mobile/                # React Native (Expo) — iOS & Android
│   └── src/
│       ├── screens/
│       ├── components/
│       ├── hooks/
│       └── lib/
│
├── backend/               # Convex — real-time serverless backend
│   ├── modules/           # Domain modules (one folder per module)
│   │   ├── sis/           # Student Information System
│   │   ├── admissions/    # Admissions & Enrollment
│   │   ├── finance/       # Fee & Finance Management
│   │   ├── timetable/     # Timetable & Scheduling
│   │   ├── academics/     # Academics & Gradebook
│   │   ├── hr/            # HR & Payroll
│   │   ├── library/       # Library Management
│   │   ├── transport/     # Transport Management
│   │   ├── communications/# Communication & Notifications
│   │   ├── ewallet/       # eWallet
│   │   └── ecommerce/     # eCommerce
│   ├── helpers/           # requireTenantContext, audit log, notifications
│   └── platform/          # Master admin, tenant provisioning, billing
│
├── landing/               # Next.js marketing site (edumyles.com root)
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── shared/                # Shared TypeScript types, constants, validators
│   ├── types/             # Shared types used by frontend + mobile + backend
│   ├── constants/         # Roles, tiers, modules, curriculum codes
│   └── validators/        # Shared Zod schemas
│
├── infra/                 # Infrastructure config
│   ├── vercel/            # vercel.json, project config
│   ├── env-templates/     # .env.example — template for all environment variables
│   └── scripts/           # Deployment and maintenance scripts
│
└── docs/                  # Project documentation (PDFs stored externally)
    ├── README.md           # Documentation index
    ├── architecture/       # System architecture, database design
    ├── api/                # API specification
    ├── guides/             # User flows, build guides, action plans
    └── compliance/         # Pricing, legal, compliance docs
```

---

## Getting Started

```bash
# Clone
gh repo clone Mylesoft-Technologies/edumyles
cd edumyles

# Install dependencies
npm install

# Copy env template
cp infra/env-templates/.env.example frontend/.env.local
# Fill in your values

# Start Convex backend
cd backend && npx convex dev

# Start frontend
cd ../frontend && npm run dev

# Start landing page
cd ../landing && npm run dev
```

---

## Architecture Principles

- **Tenant isolation:** Every Convex query must call `requireTenantContext(ctx)` first
- **No cross-tenant access:** `tenantId` is the first field on every table and every index
- **Secrets:** Never committed — stored in GitHub org secrets and injected at build time
- **Docs:** PDFs are not committed to git — see `docs/README.md` for access

---

## Documentation

See [`docs/README.md`](docs/README.md) for the full index of project documents.

> 📌 Docs are **not committed** as PDF files — they are stored securely and referenced via link.

---

## License

Proprietary — © Mylesoft Technologies. All rights reserved.
