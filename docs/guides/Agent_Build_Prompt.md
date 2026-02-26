# EduMyles — AI Agent Build Prompt
> Pass this entire document to your AI coding agent (e.g. Claude Code, Cursor, Windsurf, Devin, etc.) as the master build brief. The agent should read every section before writing a single line of code.

---

## 1. PRODUCT OVERVIEW

You are building **EduMyles** — a production-grade, multi-tenant, modular school management SaaS platform purpose-built for the East African education market (Kenya first). It digitises every aspect of school operations: admissions, academics, HR/payroll, finance, communication, transport, library, and e-commerce — all in a real-time, serverless architecture optimised for low-bandwidth environments and mobile-money-first economies.

**Core philosophy:**
- Every school is a fully isolated tenant. No data leaks across tenants. Ever.
- M-Pesa is always the primary payment option, not an afterthought.
- The system must be usable on a 3G connection on a mid-range Android phone.
- Code must be production-grade from day one: typed, tested, secure, and scalable.

---

## 2. TECH STACK (non-negotiable)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) |
| Backend / Database | Convex (real-time, serverless) |
| Authentication | WorkOS (magic links, SSO, Organizations) |
| SMS | Africa's Talking |
| Email | Resend + React Email |
| Hosting | Vercel (subdomain routing via middleware) |
| Mobile | React Native (Expo) — iOS & Android |
| Payments | M-Pesa Daraja API, Airtel Money, Stripe, Visa/Mastercard, Bank Transfer |
| UI Components | shadcn/ui + Tailwind CSS |
| Type Safety | TypeScript strict mode — zero `any` in production |
| Validation | Zod (client) mirroring Convex validators (server) |
| PDF Generation | React-PDF or Puppeteer (report cards, receipts, payslips) |

---

## 3. REPOSITORY STRUCTURE

```
edumyles/
├── apps/
│   ├── web/                    # Next.js App Router frontend
│   │   ├── src/
│   │   │   ├── app/            # Route segments
│   │   │   │   ├── (auth)/     # Login, magic link verify
│   │   │   │   ├── (dashboard)/# Role-based dashboards
│   │   │   │   ├── (admin)/    # Platform-level admin
│   │   │   │   └── api/        # Route handlers (webhooks)
│   │   │   ├── components/
│   │   │   │   ├── ui/         # Base shadcn components
│   │   │   │   ├── forms/      # Composed form components
│   │   │   │   └── tables/     # Data table components
│   │   │   ├── hooks/          # Convex subscription hooks
│   │   │   ├── lib/            # Utilities, constants, formatters
│   │   │   └── middleware.ts   # Subdomain routing
│   └── mobile/                 # React Native (Expo)
├── convex/
│   ├── schema.ts               # Full database schema
│   ├── crons.ts                # Scheduled jobs
│   ├── helpers/                # Shared backend utilities
│   │   ├── auth.ts             # requireTenantContext()
│   │   ├── audit.ts            # Audit log writer
│   │   └── notifications.ts    # SMS + Email dispatcher
│   ├── modules/                # One folder per domain module
│   │   ├── sis/                # queries.ts, mutations.ts, actions.ts, validators.ts
│   │   ├── admissions/
│   │   ├── finance/
│   │   ├── academics/
│   │   ├── hr/
│   │   ├── timetable/
│   │   ├── library/
│   │   ├── transport/
│   │   ├── communications/
│   │   ├── ewallet/
│   │   └── ecommerce/
│   └── platform/               # Master admin, tenant provisioning, billing
└── packages/
    └── shared/
        ├── types/              # Shared TypeScript types (web + mobile)
        ├── constants/          # Roles, tiers, modules, curricula
        └── validators/         # Shared Zod schemas
```

---

## 4. MULTI-TENANCY ARCHITECTURE

### 4.1 IDs & Identifiers

```
Tenant ID:   TENANT-{6-digit-code}        → e.g. TENANT-145629
User ID:     {TENANT-CODE}-{TYPE}-{SEQ}   → e.g. TENANT-145629-STU-000001
```

User type codes: `STU` (Student), `TCH` (Teacher), `PAR` (Parent), `ADM` (Admin), `TCH`, `BUR`, `HR`, `LIB`, `TRN`, `BRD`

### 4.2 Subdomain Routing

- Phase 1: `{slug}.edumyles.com` via Vercel middleware
- Phase 2 (Enterprise): Custom domains e.g. `portal.maryhill.ac.ke`

**`apps/web/src/middleware.ts` must:**
1. Extract subdomain from `request.headers.get("host")`
2. Resolve `tenantId` from subdomain via Convex lookup (or edge cache)
3. Inject `tenantId` into request headers for downstream server components
4. Redirect unknown subdomains to `edumyles.com/not-found`

### 4.3 The Golden Rule — Convex Tenant Isolation

**Every single tenant-scoped Convex query and mutation must start with:**

```typescript
const { tenantId, userId, role } = await requireTenantContext(ctx, args);
```

This helper (in `convex/helpers/auth.ts`) must:
- Verify the session token is valid and not expired
- Assert `args.tenantId === session.tenantId` (prevent cross-tenant spoofing)
- Check the user's role has permission for the requested operation
- Throw `ConvexError("UNAUTHORIZED")` on any failure

**Every tenant-scoped Convex table must have `tenantId` as the leading index key:**

```typescript
// convex/schema.ts
students: defineTable({
  tenantId: v.string(),
  // ... other fields
})
.index("by_tenant", ["tenantId"])
.index("by_tenant_and_class", ["tenantId", "classId"])
```

**Never query without tenantId filter:**
```typescript
// ❌ WRONG
const students = await ctx.db.query("students").collect();

// ✅ CORRECT
const students = await ctx.db
  .query("students")
  .withIndex("by_tenant", q => q.eq("tenantId", tenantId))
  .collect();
```

---

## 5. AUTHENTICATION (WorkOS)

### 5.1 Magic Link Flow

1. User enters email → POST `/api/auth/magic-link`
2. Server calls WorkOS `sendMagicLink()`, stores attempt record in Convex
3. Rate limit: max 3 requests per email per 15 min, 5-min cooldown after 3 failures
4. Token: 64-char, 15-min expiry, single-use
5. Click link → `GET /api/auth/callback?token=...`
6. WorkOS verifies token → returns user profile
7. Server creates/updates Convex session:
   ```typescript
   {
     tenantId, userId, role, permissions,
     deviceInfo: { ua, ip, fingerprint },
     expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
   }
   ```
8. Set HTTP-only, Secure, SameSite=Strict session cookie

### 5.2 Session Cookie Security

```typescript
// Never expose tenantId via NEXT_PUBLIC_ env vars
// Always read from server-side session
cookies().set("edumyles_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
});
```

### 5.3 Master Admin Impersonation

- Allowed only for `role === "MASTER_ADMIN"`
- Every impersonation action written to `auditLogs` table with `{ actorId, impersonatedId, action, timestamp, ipAddress }`
- A persistent warning banner must appear on every page while impersonating:
  ```
  ⚠️ IMPERSONATION ACTIVE — You are viewing as {name} ({userId}). All actions are logged.
  ```
- Impersonation sessions expire after 2 hours regardless of activity

---

## 6. DATABASE SCHEMA (Convex)

Define all tables in `convex/schema.ts`. Key tables (non-exhaustive — implement all):

```typescript
// Tenants (platform-level, no tenantId needed)
tenants: defineTable({
  id: v.string(),           // TENANT-145629
  slug: v.string(),         // "maryhill" → maryhill.edumyles.com
  name: v.string(),
  tier: v.union(v.literal("FREE"), v.literal("STARTER"), v.literal("GROWTH"), v.literal("ENTERPRISE")),
  installedModules: v.array(v.string()),
  studentCount: v.number(),
  billingCycle: v.union(v.literal("MONTHLY"), v.literal("TERMLY"), v.literal("YEARLY")),
  customDomain: v.optional(v.string()),
  status: v.union(v.literal("ACTIVE"), v.literal("SUSPENDED"), v.literal("TRIAL")),
  createdAt: v.number(),
})
.index("by_slug", ["slug"])
.index("by_status", ["status"])

// Sessions
sessions: defineTable({
  tenantId: v.string(),
  userId: v.string(),
  token: v.string(),        // hashed
  role: v.string(),
  permissions: v.array(v.string()),
  deviceInfo: v.object({ ua: v.string(), ip: v.string() }),
  expiresAt: v.number(),
  isImpersonation: v.boolean(),
  impersonatedBy: v.optional(v.string()),
})
.index("by_token", ["token"])
.index("by_tenant_user", ["tenantId", "userId"])

// Users
users: defineTable({
  tenantId: v.string(),
  userId: v.string(),       // TENANT-145629-STU-000001
  workosUserId: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),  // E.164 format
  firstName: v.string(),
  lastName: v.string(),
  role: v.string(),
  status: v.union(v.literal("ACTIVE"), v.literal("INACTIVE"), v.literal("SUSPENDED")),
  avatarUrl: v.optional(v.string()),
  createdAt: v.number(),
})
.index("by_tenant", ["tenantId"])
.index("by_tenant_email", ["tenantId", "email"])
.index("by_tenant_role", ["tenantId", "role"])

// Students (extends user record)
students: defineTable({
  tenantId: v.string(),
  userId: v.string(),
  admissionNumber: v.string(),
  classId: v.string(),
  curriculum: v.union(
    v.literal("CBC"), v.literal("844"), v.literal("IGCSE"),
    v.literal("UNIVERSITY_GPA"), v.literal("TVET"), v.literal("ACE")
  ),
  dateOfBirth: v.string(),   // ISO date
  gender: v.union(v.literal("MALE"), v.literal("FEMALE"), v.literal("OTHER")),
  nemisNumber: v.optional(v.string()),
  parentIds: v.array(v.string()),
  status: v.union(
    v.literal("ACTIVE"), v.literal("GRADUATED"), v.literal("TRANSFERRED"),
    v.literal("SUSPENDED"), v.literal("WITHDRAWN")
  ),
  enrolledAt: v.number(),
})
.index("by_tenant", ["tenantId"])
.index("by_tenant_class", ["tenantId", "classId"])
.index("by_tenant_admission", ["tenantId", "admissionNumber"])

// Fee records, payments, wallet transactions, attendance, grades, payroll — all follow same tenantId-first index pattern
```

Implement full schemas for: `classes`, `subjects`, `teachers`, `attendance`, `grades`, `feeStructures`, `feeInvoices`, `payments`, `walletTransactions`, `staff`, `payrollRuns`, `books`, `vehicles`, `routes`, `notifications`, `auditLogs`, `moduleRequests`, `billingRecords`.

---

## 7. THE 12 MODULES

Each module lives in `convex/modules/{module}/` with `queries.ts`, `mutations.ts`, `actions.ts`, `validators.ts`.

### Module 1 — Student Information System (SIS)

- CRUD for student records with full validation
- Student lifecycle: `ADMISSION → ENROLLED → ACTIVE → GRADUATED/TRANSFERRED`
- Bulk CSV import (validate → preview → confirm)
- NEMIS number tracking, export to CSV/Excel
- Photo upload via Convex file storage
- Offline: read-only cached access to SIS records

### Module 2 — Admissions & Enrollment

- Online application form (public URL per school)
- Application stages: `SUBMITTED → REVIEWED → INTERVIEW → ACCEPTED → ENROLLED → REJECTED`
- Document upload (birth certificate, previous report cards)
- Auto-generate admission number on acceptance
- Enrollment fee collection before confirming enrollment
- Waiting list management

### Module 3 — Fee & Finance Management

- Fee structure builder: create line items, set amounts per class/term
- Invoice generation (individual + bulk)
- M-Pesa STK Push integration (Daraja API):
  ```typescript
  // convex/modules/finance/actions.ts
  export const initiateMpesaPayment = action({
    args: { tenantId: v.string(), invoiceId: v.string(), phone: v.string(), amount: v.number() },
    handler: async (ctx, args) => {
      // 1. Validate tenant context
      // 2. Call Daraja STK Push API
      // 3. Store pending transaction
      // 4. Return checkoutRequestId for polling
    }
  });
  ```
- M-Pesa C2B paybill webhook at `POST /api/webhooks/mpesa`
- Airtel Money, Stripe, Bank Transfer support
- Receipts as PDF (React-PDF)
- Bursar dashboard: daily collections, outstanding balances, aging reports
- Fee reminders via SMS (Africa's Talking) + Email (Resend)
- Financial reports: term summary, year-end, per-class breakdown

### Module 4 — Timetable & Scheduling

- Visual drag-and-drop timetable builder
- Conflict detection (teacher double-booking, room clash)
- Period templates (CBC, 8-4-4 structures)
- Substitute teacher assignment
- Offline: read-only timetable viewing

### Module 5 — Academics & Gradebook

- Grade entry by teachers per subject/assessment
- Curriculum-aware grading:
  - CBC: strands, sub-strands, competency levels (Exceeds/Meets/Approaches/Below)
  - 8-4-4: percentage marks, letter grades (A, B+, B, C+, C, D+, D, E)
  - IGCSE: A*, A, B, C, D, E, F, G
  - University GPA: 4.0 scale
- Report card PDF generation with school letterhead, student photo, QR verification code
- Bulk report card distribution (email to parents, download ZIP)
- Exam schedule management
- Offline: full offline grade entry, sync on reconnect (last-write-wins)
- Offline conflict resolution UI when sync detects concurrent edits

### Module 6 — HR & Payroll

- Staff records (teachers, support staff)
- Contract management (permanent, contract, part-time)
- Leave management with approval workflow
- Payroll calculation:
  - Basic pay + allowances - deductions
  - Kenya statutory: PAYE (tax brackets), NSSF, SHIF (formerly NHIF), Housing Levy
  - Net pay calculation with audit trail
- Finance Officer approval workflow before disbursement
- Manual disbursement (M-Pesa B2C or bank transfer)
- Payslip PDF generation, email to staff
- KEMIS export capability

### Module 7 — Library Management

- Book catalogue (ISBN lookup integration optional)
- Borrowing and return tracking
- Overdue fines (charged to student eWallet automatically)
- Low stock alerts
- Librarian dashboard

### Module 8 — Transport Management

- Route and stop management
- Vehicle fleet tracking
- Student-to-route assignment
- Transport fee billing (integrated with Fee module)
- Real-time arrival/departure notifications to parents

### Module 9 — Parent & Student Portal

- Parent: view child's grades, attendance, fee balance, timetable, send messages
- Student: view own grades, assignments, timetable, library status, wallet balance
- Mobile-first design (PWA + React Native app)
- Push notifications via Expo Push + Africa's Talking SMS

### Module 10 — Communication & Notifications

Notification types and channels:

| Event | SMS | Email | In-app |
|---|---|---|---|
| Fee payment reminder | ✅ | ✅ | ✅ |
| Exam result published | ✅ | ✅ | ✅ |
| Attendance alert (absent) | ✅ | ✅ | ✅ |
| Payslip ready | — | ✅ | ✅ |
| Low wallet balance | ✅ | — | ✅ |
| New assignment | — | ✅ | ✅ |
| Transport arrival | ✅ | — | ✅ |
| Emergency broadcast | ✅ | ✅ | ✅ |
| System announcement | — | ✅ | ✅ |

SMS quota per tier: Free=0, Starter=1,000/mo, Growth=5,000/mo, Enterprise=unlimited.

```typescript
// convex/helpers/notifications.ts
export async function sendNotification(ctx, { tenantId, userId, type, data }) {
  // 1. Check tenant SMS quota (if SMS channel)
  // 2. Look up user phone/email
  // 3. Render template
  // 4. Dispatch via Africa's Talking / Resend
  // 5. Store notification record in DB
  // 6. Update SMS quota usage
}
```

### Module 11 — eWallet

- All users have a wallet (tied to tenantId + userId)
- Top-up via M-Pesa STK Push, Airtel Money, card
- Funds go DIRECTLY to school's M-Pesa paybill / bank account — EduMyles never holds float
- Wallet balance tracked in Convex as a ledger (sum of credit/debit transactions)
- Spend: school fees, canteen, library fines, transport, events, eCommerce
- Low balance SMS alert
- Transaction history with receipts
- Online only (no offline wallet operations)

```typescript
// Wallet is a ledger — NEVER store balance as mutable field
// Always compute: balance = sum(credits) - sum(debits) for tenantId + userId
walletTransactions: defineTable({
  tenantId: v.string(),
  userId: v.string(),
  type: v.union(v.literal("CREDIT"), v.literal("DEBIT")),
  amount: v.number(),         // Integer cents (KES * 100)
  reference: v.string(),      // M-Pesa receipt, internal ref
  description: v.string(),
  category: v.string(),       // "FEES", "CANTEEN", "LIBRARY_FINE", etc.
  createdAt: v.number(),
})
.index("by_tenant_user", ["tenantId", "userId"])
.index("by_tenant_reference", ["tenantId", "reference"])
```

### Module 12 — eCommerce

- Per-school shop (uniforms, books, stationery)
- Platform marketplace (cross-school products)
- Product listing with images, stock tracking
- Checkout via eWallet or direct M-Pesa
- Order management and delivery tracking
- School admin manages their own shop
- Revenue goes directly to school account

---

## 8. USER ROLES & RBAC

12 roles with strict permission enforcement:

```typescript
// packages/shared/constants/roles.ts
export const ROLES = {
  MASTER_ADMIN: "MASTER_ADMIN",       // Full platform control, impersonation
  SUPER_ADMIN: "SUPER_ADMIN",         // Platform-level admin
  SCHOOL_ADMIN: "SCHOOL_ADMIN",       // School-wide settings
  PRINCIPAL: "PRINCIPAL",             // Approvals, oversight
  TEACHER: "TEACHER",                 // Classes, grades, attendance
  PARENT: "PARENT",                   // Child monitoring, payments
  STUDENT: "STUDENT",                 // View grades, schedule
  BURSAR: "BURSAR",                   // Fee management, payroll approval
  HR_MANAGER: "HR_MANAGER",           // Staff, payroll calculation
  LIBRARIAN: "LIBRARIAN",             // Library management
  TRANSPORT_MANAGER: "TRANSPORT_MANAGER", // Transport, routes
  BOARD_MEMBER: "BOARD_MEMBER",       // Read-only oversight
} as const;
```

Permissions are checked in `requireTenantContext()` — never trust client-sent role claims.

Users can REQUEST access to modules they don't have. `moduleRequests` table tracks these with `PENDING → APPROVED/REJECTED` workflow.

---

## 9. SUBSCRIPTION TIERS

| Tier | Students | Price | SMS Quota | Storage |
|---|---|---|---|---|
| Free | ≤50 | KES 0 | 0 | 1 GB |
| Starter | ≤200 | KES 1,500/mo | 1,000 | 10 GB |
| Growth | ≤1,000 | KES 5,000/mo | 5,000 | 50 GB |
| Enterprise | Unlimited | Custom | Unlimited | 500 GB |

Billing cycles: Monthly, Termly (×3 months), Yearly (×12 months, discount applies).

Feature gates must be checked server-side in Convex before performing module operations:

```typescript
async function assertModuleAccess(ctx, tenantId: string, moduleId: string) {
  const tenant = await ctx.db.query("tenants")
    .filter(q => q.eq(q.field("id"), tenantId)).unique();
  if (!tenant?.installedModules.includes(moduleId)) {
    throw new ConvexError("MODULE_NOT_INSTALLED");
  }
}
```

---

## 10. PAYMENT INTEGRATION PATTERNS

### M-Pesa STK Push (Daraja API)

```typescript
// convex/modules/finance/actions.ts — Convex action (can call external APIs)
export const initiateStkPush = action({
  args: {
    tenantId: v.string(),
    phone: v.string(),     // E.164: +254712345678
    amount: v.number(),    // Integer KES
    invoiceId: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireTenantContext(ctx, args);
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getMpesaToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: args.amount,
          PartyA: args.phone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: args.phone,
          CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mpesa`,
          AccountReference: args.invoiceId,
          TransactionDesc: args.description,
        }),
      }
    );

    const data = await response.json();
    
    // Store pending transaction
    await ctx.runMutation(internal.finance.createPendingTransaction, {
      tenantId: args.tenantId,
      checkoutRequestId: data.CheckoutRequestID,
      invoiceId: args.invoiceId,
      amount: args.amount,
      phone: args.phone,
    });

    return { checkoutRequestId: data.CheckoutRequestID };
  },
});
```

### M-Pesa Callback Webhook

```typescript
// apps/web/src/app/api/webhooks/mpesa/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate M-Pesa checksum header
  const signature = request.headers.get("X-Mpesa-Signature");
  if (!validateMpesaSignature(body, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { Body: { stkCallback: { ResultCode, CheckoutRequestID, CallbackMetadata } } } = body;
  
  if (ResultCode === 0) {
    // Payment successful — update transaction and invoice
    await convex.mutation(api.finance.confirmPayment, {
      checkoutRequestId: CheckoutRequestID,
      mpesaReceiptNumber: extractMetadata(CallbackMetadata, "MpesaReceiptNumber"),
      amount: extractMetadata(CallbackMetadata, "Amount"),
    });
  } else {
    await convex.mutation(api.finance.failPayment, { checkoutRequestId: CheckoutRequestID });
  }

  return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
```

---

## 11. OFFLINE STRATEGY

| Module | Offline Capability | Sync Strategy |
|---|---|---|
| Attendance | Full offline — mark attendance offline | Auto-sync on reconnect, last-write-wins |
| Gradebook | Full offline — enter grades offline | Auto-sync on reconnect, last-write-wins |
| SIS | Read-only cached | Refresh on reconnect |
| HR Records | Read-only cached | Refresh on reconnect |
| Timetable | Read-only cached | Refresh on reconnect |
| eWallet | Online only | N/A |
| Finance | Online only | N/A |
| eCommerce | Online only | N/A |
| Payroll | Online only | N/A |

**Implementation:**
- Use Convex's built-in optimistic updates for offline-capable modules
- Service Worker caches critical data for offline access
- IndexedDB stores pending offline mutations queue
- On reconnect: process queue in order, show conflict resolution UI if server state diverged
- Network status banner: "You are offline. Attendance changes will sync when connected."

---

## 12. NOTIFICATION SYSTEM

```typescript
// convex/helpers/notifications.ts
import { action } from "./_generated/server";
import AfricasTalking from "africastalking";
import { Resend } from "resend";

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function dispatchNotification(ctx, {
  tenantId, userId, channel, type, templateData,
}: NotificationPayload) {
  // 1. Load user contact info
  const user = await ctx.runQuery(internal.users.getById, { tenantId, userId });
  
  // 2. Check SMS quota if SMS channel
  if (channel === "SMS") {
    await assertSmsQuota(ctx, tenantId);
  }
  
  // 3. Render template and send
  if (channel === "SMS" && user.phone) {
    await at.SMS.send({
      to: [user.phone],
      message: renderSmsTemplate(type, templateData),
      from: process.env.AT_SENDER_ID,
    });
    await incrementSmsUsage(ctx, tenantId);
  }
  
  if (channel === "EMAIL" && user.email) {
    await resend.emails.send({
      from: `EduMyles <noreply@edumyles.com>`,
      to: user.email,
      subject: getEmailSubject(type, templateData),
      react: renderEmailTemplate(type, templateData),
    });
  }
  
  // 4. Store in-app notification record
  await ctx.runMutation(internal.notifications.create, {
    tenantId, userId, type, templateData,
    readAt: undefined,
    createdAt: Date.now(),
  });
}
```

---

## 13. AUDIT LOGGING

Every state-changing operation by privileged roles must be logged:

```typescript
// convex/helpers/audit.ts
export async function writeAuditLog(ctx, {
  tenantId, actorId, actorRole, action, entityType, entityId,
  previousState, newState, ipAddress, isImpersonation, impersonatedBy,
}) {
  await ctx.db.insert("auditLogs", {
    tenantId,
    actorId,
    actorRole,
    action,               // e.g. "STUDENT_DELETED", "GRADE_MODIFIED", "PAYROLL_APPROVED"
    entityType,
    entityId,
    previousState: JSON.stringify(previousState),
    newState: JSON.stringify(newState),
    ipAddress,
    isImpersonation: isImpersonation ?? false,
    impersonatedBy,
    createdAt: Date.now(),
  });
}
// Retention: 7 years (enforce via Convex scheduled cleanup after 2557 days)
```

---

## 14. NEXT.JS APP ROUTER CONVENTIONS

```typescript
// ✅ Default to Server Components
// apps/web/src/app/(dashboard)/students/page.tsx
export default async function StudentsPage() {
  const session = await getServerSession();     // Read HTTP-only cookie
  const students = await fetchQuery(api.sis.listStudents, {
    tenantId: session.tenantId,
  });
  return <StudentTable data={students} />;
}

// ✅ Client component only when needed
// "use client" — for Convex real-time subscriptions, forms, event handlers
"use client";
export function AttendanceMarker({ classId }: { classId: string }) {
  const session = useSession();
  const students = useQuery(api.attendance.getClassStudents, {
    tenantId: session.tenantId, classId,
  });
  // ...
}

// ✅ Server Actions for form submissions
async function submitAttendance(formData: FormData) {
  "use server";
  const session = await getServerSession();
  await convex.mutation(api.attendance.markAttendance, {
    tenantId: session.tenantId,
    // ...
  });
}

// ✅ Route-level loading and error states
// loading.tsx and error.tsx alongside every page.tsx
```

---

## 15. MONEY & FORMATTING RULES

```typescript
// packages/shared/lib/money.ts

// Store all amounts as integers (KES * 100 to avoid float errors)
export const toStorageAmount = (kes: number) => Math.round(kes * 100);
export const fromStorageAmount = (cents: number) => cents / 100;

// Display format
export const formatKES = (cents: number) =>
  `KES ${(cents / 100).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
// Output: "KES 1,500.00"

// Phone numbers: always E.164 format
export const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.startsWith("254")) return `+${digits}`;
  return `+254${digits}`;
};

// Date format: DD/MM/YYYY for display, ISO 8601 for storage
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", { day: "2-digit", month: "2-digit", year: "numeric" });
```

---

## 16. CURRICULUM SUPPORT

```typescript
// packages/shared/constants/curricula.ts
export const CURRICULA = {
  CBC: {
    name: "Competency Based Curriculum",
    gradingScale: ["EE", "ME", "AE", "BE"],  // Exceeds/Meets/Approaches/Below Expectations
    levels: ["PP1", "PP2", "Grade 1-6", "Junior Secondary 7-9", "Senior Secondary 10-12"],
  },
  "8-4-4": {
    name: "8-4-4 System",
    gradingScale: ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"],
    marks: { "A": [75, 100], "A-": [70, 74], "B+": [65, 69], /* ... */ },
  },
  IGCSE: {
    name: "IGCSE / Cambridge",
    gradingScale: ["A*", "A", "B", "C", "D", "E", "F", "G", "U"],
  },
  UNIVERSITY_GPA: {
    name: "University GPA",
    gradingScale: { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, /* ... */ },
  },
  TVET: {
    name: "TVET / Vocational",
    gradingScale: ["Distinction", "Credit", "Pass", "Fail"],
  },
  ACE: {
    name: "Accelerated Christian Education",
    gradingScale: ["A", "B", "C", "D", "F"],
  },
} as const;
```

---

## 17. KENYA INTEGRATIONS

### NEMIS Export (v1: CSV/Excel)
- Export fields: `Learner Name, DOB, Gender, NEMIS Number, Class, Admission Date, Guardian Name, Guardian Phone`
- Format: CSV matching NEMIS template, Excel with header row
- Triggered by School Admin / Principal

### KNEC Export (v1: CSV/Excel)
- Exam candidate registration data export
- Fields per KNEC specification

### Live API Sync (v2: Future)
- NEMIS REST API integration when available
- KNEC candidate registration API

---

## 18. WEBHOOKS

Register and validate all webhooks:

| Webhook | Path | Provider |
|---|---|---|
| M-Pesa STK callback | `POST /api/webhooks/mpesa` | Safaricom Daraja |
| M-Pesa C2B confirmation | `POST /api/webhooks/mpesa/c2b` | Safaricom Daraja |
| Africa's Talking delivery | `POST /api/webhooks/at/delivery` | Africa's Talking |
| WorkOS auth events | `POST /api/webhooks/workos` | WorkOS |
| Stripe payment events | `POST /api/webhooks/stripe` | Stripe |
| Airtel Money callback | `POST /api/webhooks/airtel` | Airtel Money |

**All webhooks must:**
1. Verify request signature/HMAC before processing
2. Return `200 OK` immediately (process async via Convex action)
3. Be idempotent (safe to receive duplicate deliveries)

---

## 19. ENVIRONMENT VARIABLES

```bash
# .env.example — document ALL vars with descriptions

# Convex
CONVEX_DEPLOYMENT=           # dev:xxx or prod:xxx
NEXT_PUBLIC_CONVEX_URL=      # https://xxx.convex.cloud

# WorkOS
WORKOS_API_KEY=              # sk_live_...
WORKOS_CLIENT_ID=            # client_...
WORKOS_WEBHOOK_SECRET=       # Verify WorkOS webhook signatures

# M-Pesa Daraja
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=             # Paybill number
MPESA_PASSKEY=               # From Daraja portal
MPESA_ENV=                   # "sandbox" | "production"

# Africa's Talking
AT_API_KEY=
AT_USERNAME=
AT_SENDER_ID=                # e.g. "EDUMYLES"

# Resend
RESEND_API_KEY=              # re_...
RESEND_FROM_DOMAIN=          # edumyles.com (verified)

# Stripe
STRIPE_SECRET_KEY=           # sk_live_...
STRIPE_WEBHOOK_SECRET=       # whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_live_...

# Airtel Money
AIRTEL_CLIENT_ID=
AIRTEL_CLIENT_SECRET=
AIRTEL_ENV=                  # "sandbox" | "production"

# App
NEXT_PUBLIC_APP_URL=         # https://edumyles.com
SESSION_SECRET=              # 64-char random string for session signing
```

**Rule:** Any variable without `NEXT_PUBLIC_` prefix is server-side only. Never expose secrets to the client.

---

## 20. PERFORMANCE TARGETS

| Metric | Target |
|---|---|
| Largest Contentful Paint (3G) | < 2.5 seconds |
| Time to Interactive (mid-range Android) | < 3.5 seconds |
| Convex indexed query response | < 200ms |
| Initial JS bundle (gzipped) | < 200 KB |
| M-Pesa STK Push initiation | < 3 seconds |

**Optimisation rules:**
- Default to Server Components — reduce client-side JS
- Use `next/image` with `sizes` and `priority` attributes
- Lazy-load below-the-fold content
- Paginate all lists — never load unbounded collections
- Use Convex `withIndex()` on every query — no full table scans

---

## 21. SECURITY CHECKLIST

Every implementation must satisfy:

- [ ] `tenantId` validated server-side on every Convex query — never trust client
- [ ] Magic links: 64-char token, 15-min expiry, single-use, 3-attempt limit
- [ ] Session cookies: `httpOnly`, `secure`, `sameSite=strict`
- [ ] All webhook endpoints verify request signatures
- [ ] No secrets in `NEXT_PUBLIC_` env vars
- [ ] Rate limiting on: magic link generation, SMS sending, payment initiation, API endpoints
- [ ] CSP headers configured (no inline scripts)
- [ ] Master Admin impersonation: audit logged + warning banner on every page
- [ ] Audit logs: 7-year retention, immutable (no update/delete mutations on `auditLogs`)
- [ ] All user inputs validated: Zod on client, Convex validators on server
- [ ] Cross-tenant access test: every tenant-scoped mutation has a test asserting it throws when called with wrong tenantId

---

## 22. TESTING REQUIREMENTS

```typescript
// Every Convex module must have tests covering:

// 1. Tenant isolation
test("cannot access other tenant's students", async () => {
  const { tenantA, tenantB } = await setupTwoTenants();
  await expect(
    convex.query(api.sis.listStudents, { tenantId: tenantB.id, sessionToken: tenantA.token })
  ).rejects.toThrow("UNAUTHORIZED");
});

// 2. Role-based access
test("STUDENT cannot delete another student", async () => {
  const { student } = await setupTenant();
  await expect(
    convex.mutation(api.sis.deleteStudent, { tenantId: student.tenantId, studentId: "..." })
  ).rejects.toThrow("FORBIDDEN");
});

// 3. Payment flows
test("M-Pesa payment success updates invoice and wallet", async () => {
  // Simulate STK push initiation → callback → verify invoice marked PAID
});
```

Coverage targets: Convex backend ≥ 80%, shared utilities ≥ 70%.
E2E tests (Playwright): sign-in, student enrollment, fee payment, grade entry, report card generation.

---

## 23. SCALE TARGETS

| Year | Schools | Students |
|---|---|---|
| Year 1 | 50–100 | 50,000 |
| Year 3 | 500 | 300,000 |

Architecture must support horizontal scale from day one:
- Convex handles real-time scale automatically
- All queries use indexes — no full scans
- Convex file storage for documents, photos, PDFs
- PDF generation offloaded to background Convex actions (not blocking the request)

---

## 24. AGENT EXECUTION INSTRUCTIONS

Work through these steps in order. Do not skip ahead:

1. **Read all project documents first** — PRD, System Architecture, Database Design, API Specification, Feature Specification — before writing any code.

2. **Set up monorepo** — pnpm workspaces, TypeScript strict mode, ESLint, Prettier, Convex project init, Next.js app init.

3. **Build schema first** (`convex/schema.ts`) — every table with proper indexes before building any query.

4. **Build `requireTenantContext()`** — this is the foundation. Everything else depends on it.

5. **Implement modules in priority order:**
   1. Auth (WorkOS magic link + session)
   2. Tenant provisioning + subdomain routing
   3. SIS (Student Information System)
   4. Fee & Finance (M-Pesa integration)
   5. Academics & Gradebook
   6. Communication & Notifications
   7. Admissions
   8. HR & Payroll
   9. Parent & Student Portal
   10. Timetable
   11. eWallet
   12. Library, Transport, eCommerce (in parallel)

6. **Write tests alongside code** — not after. Every mutation gets a tenant isolation test at the time of writing.

7. **Flag architectural risks proactively** — if you see a security gap, a performance bottleneck, or a design conflict, raise it immediately with a clear explanation before proceeding.

8. **East African context always wins** — when in doubt: M-Pesa first, SMS over email, optimise for 3G, KES formatting, DD/MM/YYYY dates, `+254` phone defaults.

---

*End of EduMyles Agent Build Prompt — v1.0*
*Generated for: AI Coding Agent Handoff*
*Platform: EduMyles School Management SaaS*
*Primary Market: East Africa (Kenya first)*
