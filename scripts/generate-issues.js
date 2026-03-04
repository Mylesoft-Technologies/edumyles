#!/usr/bin/env node

/**
 * EduMyles Implementation Plan Issue Generator
 * 
 * This script automatically creates GitHub issues for the entire implementation plan
 * based on the phases and modules defined in the documentation.
 */

const fs = require('fs');
const path = require('path');

// Phase definitions from implementation plan
const phases = [
  {
    number: 1,
    title: "Shared Foundation",
    duration: "Week 1-2",
    dependencies: "None",
    tasks: [
      {
        title: "Install & Configure shadcn/ui",
        description: "Install shadcn/ui CLI and dependencies, generate base components",
        requirements: [
          "Install shadcn/ui CLI and dependencies",
          "Generate 20+ base components (Button, Card, Dialog, etc.)",
          "Configure components.json for project paths"
        ],
        files: ["components.json", "frontend/src/components/ui/*"],
        estimatedHours: 8
      },
      {
        title: "Build Shared Layout Components",
        description: "Create reusable layout components for all panels",
        requirements: [
          "AppShell.tsx - Main app shell with sidebar + header + content",
          "Sidebar.tsx - Collapsible sidebar with role-based navigation",
          "Header.tsx - Top bar with tenant name, user avatar, notifications",
          "ImpersonationBanner.tsx - Warning banner during admin impersonation",
          "MobileNav.tsx - Mobile hamburger menu",
          "Shared components (DataTable, StatCard, EmptyState, etc.)"
        ],
        files: ["frontend/src/components/layout/*", "frontend/src/components/shared/*"],
        estimatedHours: 16
      },
      {
        title: "Build Core Hooks",
        description: "Create essential React hooks for the application",
        requirements: [
          "useAuth.ts - Session, user, role, tenant from Convex",
          "useTenant.ts - Current tenant context",
          "usePermissions.ts - Check permissions client-side",
          "useModules.ts - Installed modules for current tenant",
          "useNotifications.ts - Real-time notification subscription",
          "usePagination.ts - Pagination state management"
        ],
        files: ["frontend/src/hooks/*"],
        estimatedHours: 12
      },
      {
        title: "Build Utility Library",
        description: "Create utility functions and helpers",
        requirements: [
          "convex.ts - Convex client setup",
          "auth.ts - Auth helpers (getSession, redirectToLogin)",
          "formatters.ts - Date, currency (KES), phone formatting",
          "permissions.ts - Client-side permission checks",
          "routes.ts - Role-based route definitions"
        ],
        files: ["frontend/src/lib/*"],
        estimatedHours: 8
      },
      {
        title: "Add New Roles to Schema & RBAC",
        description: "Add alumni and partner roles to the system",
        requirements: [
          "Add alumni and partner roles to authorize.ts",
          "Update shared constants and types",
          "Update Convex schema user role enum",
          "Define permissions for alumni and partner roles"
        ],
        files: [
          "convex/helpers/authorize.ts",
          "shared/src/constants/index.ts",
          "shared/src/types/index.ts",
          "convex/schema.ts"
        ],
        estimatedHours: 6
      },
      {
        title: "Fix Auth Flow",
        description: "Complete authentication flow implementation",
        requirements: [
          "Fix deriveTenantId() - use WorkOS organization ID",
          "Fix deriveRole() - look up role from users table",
          "Build proper /auth/login/page.tsx",
          "Build proper /auth/callback/route.ts",
          "Add logout route",
          "Wire ConvexProvider in root layout"
        ],
        files: [
          "frontend/src/app/auth/login/page.tsx",
          "frontend/src/app/auth/callback/route.ts",
          "frontend/src/app/auth/logout/route.ts",
          "frontend/src/app/layout.tsx"
        ],
        estimatedHours: 12
      },
      {
        title: "Role-Based Router",
        description: "Implement role-based routing middleware",
        requirements: [
          "Update middleware to detect role from session",
          "Redirect based on role (master_admin → /platform, etc.)",
          "Add route protection for all panels"
        ],
        files: ["frontend/src/middleware.ts"],
        estimatedHours: 4
      }
    ]
  },
  {
    number: 2,
    title: "Module Marketplace",
    duration: "Week 2-3",
    dependencies: "Phase 1 Complete",
    tasks: [
      {
        title: "Backend - Marketplace Convex Functions",
        description: "Implement all marketplace backend functions",
        requirements: [
          "getModuleRegistry() - list all available modules",
          "getInstalledModules(tenantId) - list modules for tenant",
          "getAvailableForTier(tenantId) - filter by tenant's tier",
          "getModuleDetails(moduleId) - single module info",
          "getModuleRequests(tenantId) - list pending requests",
          "installModule(tenantId, moduleId) - install with validation",
          "uninstallModule(tenantId, moduleId) - safe uninstall",
          "updateModuleConfig(tenantId, moduleId, config) - settings",
          "requestModuleAccess(tenantId, userId, moduleId, reason)",
          "reviewModuleRequest(requestId, status, notes)",
          "seedModuleRegistry() - populate with 11 modules",
          "updateModuleStatus(moduleId, status)",
          "updateModuleVersion(moduleId, version)"
        ],
        files: [
          "convex/modules/marketplace/queries.ts",
          "convex/modules/marketplace/mutations.ts"
        ],
        estimatedHours: 20
      },
      {
        title: "Backend - Module Gate Middleware",
        description: "Create module access control system",
        requirements: [
          "requireModule(ctx, tenantId, moduleId) helper",
          "Use in every module's queries/mutations as first check"
        ],
        files: ["convex/helpers/moduleGuard.ts"],
        estimatedHours: 4
      },
      {
        title: "Frontend - Marketplace Pages",
        description: "Create marketplace user interface",
        requirements: [
          "/admin/marketplace - Module marketplace grid",
          "/admin/marketplace/[moduleId] - Module detail page",
          "/admin/marketplace/requests - Module access requests",
          "ModuleCard, ModuleGrid, InstallDialog components",
          "TierBadge, ModuleStatusBadge, RequestList components"
        ],
        files: ["frontend/src/app/(admin)/marketplace/*"],
        estimatedHours: 24
      },
      {
        title: "Frontend - Module Settings",
        description: "Create module configuration interface",
        requirements: [
          "/admin/settings/modules - Installed modules list",
          "/admin/settings/modules/[moduleId] - Per-module config"
        ],
        files: ["frontend/src/app/(admin)/settings/modules/*"],
        estimatedHours: 12
      },
      {
        title: "Platform Admin - Marketplace Management",
        description: "Create platform-level marketplace admin",
        requirements: [
          "/platform/marketplace - All modules registry",
          "/platform/marketplace/[moduleId] - Edit module metadata",
          "ModuleRegistryTable, ModuleEditForm components"
        ],
        files: ["frontend/src/app/(platform)/marketplace/*"],
        estimatedHours: 16
      }
    ]
  },
  {
    number: 3,
    title: "Master Admin & Super Admin Panels",
    duration: "Week 3-4",
    dependencies: "Phase 2 Complete",
    tasks: [
      {
        title: "Backend - Platform Functions",
        description: "Implement platform administration backend",
        requirements: [
          "getPlatformStats() - platform metrics",
          "getRecentActivity() - recent platform activity",
          "getRevenueMetrics() - revenue analytics",
          "listPlatformAdmins() - all platform admins",
          "listAllUsers(filters) - cross-tenant user search",
          "createPlatformAdmin(email, role) - invite admin",
          "updatePlatformAdminRole(userId, role) - change role",
          "deactivatePlatformAdmin(userId) - remove access",
          "listSubscriptions(filters) - all subscriptions",
          "getSubscriptionDetails(tenantId) - billing info",
          "updateTenantTier(tenantId, tier) - change subscription",
          "overrideBilling(tenantId, amount, notes) - manual adjustment"
        ],
        files: [
          "convex/platform/dashboard/queries.ts",
          "convex/platform/users/queries.ts",
          "convex/platform/users/mutations.ts",
          "convex/platform/billing/queries.ts",
          "convex/platform/billing/mutations.ts"
        ],
        estimatedHours: 24
      },
      {
        title: "Frontend - Master Admin Panel",
        description: "Create comprehensive master admin interface",
        requirements: [
          "Platform layout with sidebar navigation",
          "Dashboard with stats, charts, recent activity",
          "Tenant management (list, detail, create, modules, users, billing)",
          "Platform admin user management",
          "Marketplace management (from Phase 2)",
          "Billing overview and revenue analytics",
          "Audit log viewer",
          "Impersonation session management",
          "Platform settings"
        ],
        files: ["frontend/src/app/(platform)/*"],
        estimatedHours: 32
      },
      {
        title: "Super Admin Panel",
        description: "Create restricted super admin interface",
        requirements: [
          "Share platform layout with restricted access",
          "Permission-gated components using usePermissions()",
          "Can view tenants but not delete",
          "Can view audit logs but not clear",
          "Cannot manage billing overrides",
          "Cannot create other master admins"
        ],
        files: ["frontend/src/app/(platform)/*"],
        estimatedHours: 8
      }
    ]
  },
  {
    number: 4,
    title: "School Admin Panel",
    duration: "Week 4-5",
    dependencies: "Phase 3 Complete, SIS Module Backend",
    tasks: [
      {
        title: "Backend - School Management Functions",
        description: "Implement school administration backend",
        requirements: [
          "SIS functions: students, classes, guardians management",
          "Admissions functions: application pipeline",
          "HR functions: staff management",
          "Bulk operations: import students, create classes"
        ],
        files: [
          "convex/modules/sis/queries.ts",
          "convex/modules/sis/mutations.ts",
          "convex/modules/admissions/queries.ts",
          "convex/modules/admissions/mutations.ts",
          "convex/modules/hr/queries.ts",
          "convex/modules/hr/mutations.ts"
        ],
        estimatedHours: 32
      },
      {
        title: "Frontend - Admin Dashboard & Pages",
        description: "Create comprehensive school admin interface",
        requirements: [
          "Admin layout with sidebar navigation",
          "Dashboard with student count, staff count, fee collection, attendance",
          "Student management (list, profile, create, import)",
          "Class management (list, detail, create)",
          "Staff directory and management",
          "Admissions pipeline",
          "User management and invitations",
          "Marketplace integration",
          "School settings and modules",
          "Billing and role management",
          "Audit log viewer"
        ],
        files: ["frontend/src/app/(admin)/*"],
        estimatedHours: 40
      }
    ]
  },
  {
    number: 5,
    title: "Teacher Panel",
    duration: "Week 5-6",
    dependencies: "Phase 4 Complete, Academics Backend",
    tasks: [
      {
        title: "Backend - Teacher Functions",
        description: "Implement teacher-specific backend functions",
        requirements: [
          "getTeacherClasses() - classes assigned to teacher",
          "getClassStudents() - students in a class",
          "getGrades() - grade sheet view",
          "getAssignments() - assignments list",
          "getSubmissions() - student submissions",
          "getAttendance() - attendance for a day",
          "enterGrades() - bulk grade entry",
          "createAssignment() - new assignment",
          "gradeSubmission() - grade student work",
          "markAttendance() - bulk attendance marking",
          "generateReportCard() - trigger report generation"
        ],
        files: [
          "convex/modules/academics/queries.ts",
          "convex/modules/academics/mutations.ts"
        ],
        estimatedHours: 20
      },
      {
        title: "Frontend - Teacher Portal",
        description: "Create teacher portal interface",
        requirements: [
          "Teacher layout with sidebar navigation",
          "Dashboard with today's classes, pending grades, upcoming assignments",
          "My classes list and class management",
          "Gradebook with spreadsheet-like UI",
          "Attendance marking and history",
          "Assignment creation and grading",
          "Timetable view",
          "Teacher profile"
        ],
        files: ["frontend/src/app/(portal)/teacher/*"],
        estimatedHours: 32
      }
    ]
  },
  {
    number: 6,
    title: "Parent Panel",
    duration: "Week 6-7",
    dependencies: "Phase 4 Complete, Finance + Academics Backend",
    tasks: [
      {
        title: "Backend - Parent Functions",
        description: "Implement parent-specific backend functions",
        requirements: [
          "getChildren() - list linked children",
          "getChildGrades() - grades for a child",
          "getChildAttendance() - attendance record",
          "getChildTimetable() - child's schedule",
          "getFeeBalance() - outstanding fees",
          "getPaymentHistory() - past payments",
          "getChildAssignments() - upcoming assignments",
          "getAnnouncements() - school announcements",
          "initiatePayment() - start fee payment",
          "sendMessage() - message teacher/admin"
        ],
        files: [
          "convex/modules/portal/parent/queries.ts",
          "convex/modules/portal/parent/mutations.ts"
        ],
        estimatedHours: 16
      },
      {
        title: "Frontend - Parent Portal",
        description: "Create parent portal interface",
        requirements: [
          "Parent layout with sidebar navigation",
          "Dashboard with children summary, fee balance, recent grades",
          "Children management with detailed views",
          "Grades, attendance, timetable, assignments per child",
          "Fee statements and payment processing",
          "Message inbox and compose",
          "School announcements feed",
          "Parent profile and notification preferences"
        ],
        files: ["frontend/src/app/(portal)/parent/*"],
        estimatedHours: 24
      }
    ]
  },
  {
    number: 7,
    title: "Student Panel",
    duration: "Week 7-8",
    dependencies: "Phase 5 Complete, Academics Backend",
    tasks: [
      {
        title: "Backend - Student Functions",
        description: "Implement student-specific backend functions",
        requirements: [
          "getMyGrades() - own grades",
          "getMyAttendance() - own attendance",
          "getMyTimetable() - own schedule",
          "getMyAssignments() - pending/completed assignments",
          "getMyWalletBalance() - eWallet balance",
          "getMyReportCards() - downloadable report cards",
          "getAnnouncements() - school announcements",
          "submitAssignment() - submit work"
        ],
        files: [
          "convex/modules/portal/student/queries.ts",
          "convex/modules/portal/student/mutations.ts"
        ],
        estimatedHours: 12
      },
      {
        title: "Frontend - Student Portal",
        description: "Create student portal interface",
        requirements: [
          "Student layout with sidebar navigation",
          "Dashboard with GPA, upcoming assignments, attendance %, wallet balance",
          "Grades by subject and term",
          "Weekly timetable view",
          "Assignment management with submission",
          "Attendance calendar",
          "eWallet balance and transaction history",
          "Report card downloads",
          "School announcements",
          "Student profile"
        ],
        files: ["frontend/src/app/(portal)/student/*"],
        estimatedHours: 20
      }
    ]
  },
  {
    number: 8,
    title: "Alumni Panel",
    duration: "Week 8-9",
    dependencies: "Phase 1 Complete",
    tasks: [
      {
        title: "Backend - Alumni Functions",
        description: "Implement alumni-specific backend functions",
        requirements: [
          "getAlumniProfile() - profile with graduation info",
          "getTranscripts() - academic transcripts",
          "getAlumniDirectory() - searchable alumni network",
          "getAlumniEvents() - upcoming events",
          "getAlumniAnnouncements() - alumni-specific news",
          "updateAlumniProfile() - update contact info, career",
          "requestTranscript() - request official transcript",
          "rsvpEvent() - RSVP to event",
          "Schema additions: alumni, alumniEvents, transcriptRequests tables"
        ],
        files: [
          "convex/modules/portal/alumni/queries.ts",
          "convex/modules/portal/alumni/mutations.ts",
          "convex/schema.ts"
        ],
        estimatedHours: 16
      },
      {
        title: "Frontend - Alumni Portal",
        description: "Create alumni portal interface",
        requirements: [
          "Alumni layout with sidebar navigation",
          "Dashboard with graduation year, transcript status, upcoming events",
          "Transcript viewing and request system",
          "Alumni directory with search",
          "Events listing and RSVP",
          "Alumni profile management"
        ],
        files: ["frontend/src/app/(portal)/alumni/*"],
        estimatedHours: 16
      }
    ]
  },
  {
    number: 9,
    title: "Partner Panel",
    duration: "Week 9-10",
    dependencies: "Phase 1 Complete",
    tasks: [
      {
        title: "Backend - Partner Functions",
        description: "Implement partner-specific backend functions",
        requirements: [
          "getPartnerProfile() - organization info",
          "getSponsoredStudents() - students under sponsorship",
          "getSponsorshipReport() - academic/financial report",
          "getPartnerPayments() - payment history",
          "getPartnerAnnouncements() - relevant school updates",
          "updatePartnerProfile() - update org info",
          "sendPartnerMessage() - communicate with school",
          "Schema additions: partners, sponsorships tables"
        ],
        files: [
          "convex/modules/portal/partner/queries.ts",
          "convex/modules/portal/partner/mutations.ts",
          "convex/schema.ts"
        ],
        estimatedHours: 12
      },
      {
        title: "Frontend - Partner Portal",
        description: "Create partner portal interface",
        requirements: [
          "Partner layout with sidebar navigation",
          "Dashboard with sponsored student count, total invested, performance summary",
          "Sponsored students list and reports",
          "Aggregated sponsorship reports (downloadable PDF)",
          "Payment history and upcoming dues",
          "Communication with school",
          "Partner organization profile"
        ],
        files: ["frontend/src/app/(portal)/partner/*"],
        estimatedHours: 16
      }
    ]
  },
  {
    number: 10,
    title: "Remaining Modules Backend",
    duration: "Week 10-13",
    dependencies: "Phase 1 Complete",
    tasks: [
      {
        title: "Finance & Fees Module",
        description: "Implement comprehensive finance management",
        requirements: [
          "Fee structure builder (line items per class/term)",
          "Invoice generation (individual + bulk)",
          "Payment recording + reconciliation",
          "Fee reminders trigger",
          "Financial reports (collection rate, outstanding, by class)",
          "Receipt generation data"
        ],
        files: [
          "convex/modules/finance/queries.ts",
          "convex/modules/finance/mutations.ts"
        ],
        estimatedHours: 24
      },
      {
        title: "Timetable Module",
        description: "Implement timetable scheduling system",
        requirements: [
          "Timetable slot CRUD",
          "Conflict detection (teacher double-booking, room clash)",
          "Substitute teacher assignment",
          "Class/teacher/room schedule views"
        ],
        files: [
          "convex/modules/timetable/queries.ts",
          "convex/modules/timetable/mutations.ts"
        ],
        estimatedHours: 20
      },
      {
        title: "HR & Payroll Module",
        description: "Implement HR and payroll management",
        requirements: [
          "Staff profile CRUD",
          "Contract management",
          "Leave management",
          "Payroll calculation (basic + allowances - deductions)",
          "Payslip data generation"
        ],
        files: [
          "convex/modules/hr/queries.ts",
          "convex/modules/hr/mutations.ts"
        ],
        estimatedHours: 24
      },
      {
        title: "Library Module",
        description: "Implement library management system",
        requirements: [
          "Book catalogue CRUD (ISBN, title, author, category)",
          "Borrow/return tracking",
          "Overdue detection + fine calculation",
          "Low stock alerts"
        ],
        files: [
          "convex/modules/library/queries.ts",
          "convex/modules/library/mutations.ts"
        ],
        estimatedHours: 16
      },
      {
        title: "Transport Module",
        description: "Implement transport management system",
        requirements: [
          "Route definition with stops",
          "Vehicle fleet management",
          "Student-route assignment",
          "Driver assignment"
        ],
        files: [
          "convex/modules/transport/queries.ts",
          "convex/modules/transport/mutations.ts"
        ],
        estimatedHours: 16
      },
      {
        title: "Communications Module",
        description: "Implement communication system",
        requirements: [
          "Notification CRUD + template system",
          "SMS send via Africa's Talking action",
          "Email send via Resend action",
          "Announcement CRUD",
          "Emergency broadcast with acknowledgment"
        ],
        files: [
          "convex/modules/communications/queries.ts",
          "convex/modules/communications/mutations.ts"
        ],
        estimatedHours: 20
      },
      {
        title: "eWallet Module",
        description: "Implement eWallet system",
        requirements: [
          "Wallet balance queries",
          "Top-up processing",
          "Transaction recording",
          "Spend tracking"
        ],
        files: [
          "convex/modules/ewallet/queries.ts",
          "convex/modules/ewallet/mutations.ts"
        ],
        estimatedHours: 12
      },
      {
        title: "eCommerce Module",
        description: "Implement eCommerce system",
        requirements: [
          "Product catalogue CRUD",
          "Order management",
          "Cart operations",
          "Payment integration with eWallet"
        ],
        files: [
          "convex/modules/ecommerce/queries.ts",
          "convex/modules/ecommerce/mutations.ts"
        ],
        estimatedHours: 16
      }
    ]
  },
  {
    number: 11,
    title: "Payment Webhooks & Integrations",
    duration: "Week 13-14",
    dependencies: "Phase 10 Complete",
    tasks: [
      {
        title: "API Routes",
        description: "Create payment and integration API routes",
        requirements: [
          "M-Pesa STK Push callback webhook",
          "Stripe webhook handler",
          "Airtel Money callback",
          "WorkOS webhook (user sync)",
          "M-Pesa STK Push initiation",
          "Stripe checkout session creation"
        ],
        files: [
          "frontend/src/app/api/webhooks/mpesa/route.ts",
          "frontend/src/app/api/webhooks/stripe/route.ts",
          "frontend/src/app/api/webhooks/airtel/route.ts",
          "frontend/src/app/api/webhooks/workos/route.ts",
          "frontend/src/app/api/payments/mpesa/initiate/route.ts",
          "frontend/src/app/api/payments/stripe/checkout/route.ts"
        ],
        estimatedHours: 20
      },
      {
        title: "Payment Actions",
        description: "Implement payment processing actions",
        requirements: [
          "M-Pesa STK Push initiation and callback processing",
          "Stripe checkout creation and webhook handling"
        ],
        files: [
          "convex/actions/payments/mpesa.ts",
          "convex/actions/payments/stripe.ts"
        ],
        estimatedHours: 16
      },
      {
        title: "Communication Actions",
        description: "Implement communication integrations",
        requirements: [
          "SMS sending via Africa's Talking API",
          "Email sending via Resend API",
          "Templates: fee reminder, exam results, attendance alert, payslip"
        ],
        files: [
          "convex/actions/communications/sms.ts",
          "convex/actions/communications/email.ts"
        ],
        estimatedHours: 12
      }
    ]
  },
  {
    number: 12,
    title: "Admin Pages for Remaining Modules",
    duration: "Week 14-16",
    dependencies: "Phase 10 Complete",
    tasks: [
      {
        title: "Finance Admin Pages",
        description: "Create finance administration interface",
        requirements: [
          "Fee structures management",
          "Invoice generation and tracking",
          "Payment recording and reconciliation",
          "Financial reports and analytics",
          "Receipt generation and management"
        ],
        files: ["frontend/src/app/(admin)/finance/*"],
        estimatedHours: 24
      },
      {
        title: "Timetable Admin Pages",
        description: "Create timetable administration interface",
        requirements: [
          "Visual timetable builder",
          "Conflict detection and warnings",
          "Substitute teacher management",
          "Schedule views for classes, teachers, rooms"
        ],
        files: ["frontend/src/app/(admin)/timetable/*"],
        estimatedHours: 20
      },
      {
        title: "HR Admin Pages",
        description: "Create HR administration interface",
        requirements: [
          "Staff directory and profiles",
          "Payroll processing and management",
          "Leave management system",
          "Contract management"
        ],
        files: ["frontend/src/app/(admin)/hr/*"],
        estimatedHours: 24
      },
      {
        title: "Library Admin Pages",
        description: "Create library administration interface",
        requirements: [
          "Book catalog management",
          "Circulation tracking",
          "Overdue management and fines",
          "Library dashboard and analytics"
        ],
        files: ["frontend/src/app/(admin)/library/*"],
        estimatedHours: 16
      },
      {
        title: "Transport Admin Pages",
        description: "Create transport administration interface",
        requirements: [
          "Route management and mapping",
          "Vehicle fleet management",
          "Student-route assignments",
          "Driver management and scheduling"
        ],
        files: ["frontend/src/app/(admin)/transport/*"],
        estimatedHours: 16
      },
      {
        title: "Communications Admin Pages",
        description: "Create communications administration interface",
        requirements: [
          "SMS and email sending interfaces",
          "Template management system",
          "Announcement creation and broadcasting",
          "Emergency broadcast system"
        ],
        files: ["frontend/src/app/(admin)/communications/*"],
        estimatedHours: 16
      },
      {
        title: "eWallet Admin Pages",
        description: "Create eWallet administration interface",
        requirements: [
          "Wallet overview and analytics",
          "Top-up processing and management",
          "Transaction tracking and reporting",
          "Wallet configuration settings"
        ],
        files: ["frontend/src/app/(admin)/ewallet/*"],
        estimatedHours: 12
      },
      {
        title: "eCommerce Admin Pages",
        description: "Create eCommerce administration interface",
        requirements: [
          "Product catalog management",
          "Order processing and tracking",
          "Inventory management",
          "Sales analytics and reporting"
        ],
        files: ["frontend/src/app/(admin)/ecommerce/*"],
        estimatedHours: 16
      }
    ]
  },
  {
    number: 13,
    title: "Testing",
    duration: "Week 16-17",
    dependencies: "All previous phases",
    tasks: [
      {
        title: "Testing Setup",
        description: "Set up comprehensive testing framework",
        requirements: [
          "Install Vitest + testing-library",
          "Configure test environment for Convex",
          "Set up test database and mocks"
        ],
        files: ["package.json", "vitest.config.ts"],
        estimatedHours: 8
      },
      {
        title: "Critical Tests",
        description: "Implement critical security and functionality tests",
        requirements: [
          "Tenant isolation tests (cross-tenant data leak prevention)",
          "RBAC permission tests (every role + permission combination)",
          "Module guard tests (access blocked when module not installed)",
          "Payment webhook signature verification tests",
          "Auth flow tests (login, session, logout, expiry)"
        ],
        files: ["tests/**/*.test.ts"],
        estimatedHours: 24
      },
      {
        title: "Module Tests",
        description: "Implement comprehensive module testing",
        requirements: [
          "Unit tests for every query/mutation in all 11 modules",
          "Integration tests for payment flows",
          "Integration tests for admission pipeline",
          "E2E tests for critical user journeys"
        ],
        files: ["tests/**/*.test.ts"],
        estimatedHours: 32
      }
    ]
  }
];

// Module definitions for individual module issues
const modules = [
  {
    name: "Student Information System (SIS)",
    id: "sis",
    priority: "high",
    description: "Core student data management including enrollment, classes, and academic records",
    backendRequirements: [
      "Student profile CRUD with enrollment status",
      "Class management with student assignments",
      "Guardian relationships and contact management",
      "Student academic history tracking",
      "Bulk student import/export functionality",
      "Class transfer and graduation workflows"
    ],
    frontendRequirements: [
      "Student directory with advanced search and filtering",
      "Individual student profile pages with academic history",
      "Class management interface with roster views",
      "Bulk import tools with CSV validation",
      "Student enrollment and registration forms",
      "Guardian management and communication tools"
    ],
    estimatedHours: 40
  },
  {
    name: "Admissions & Enrollment",
    id: "admissions",
    priority: "high",
    description: "Complete admissions pipeline from application to enrollment",
    backendRequirements: [
      "Application form submission and validation",
      "Application status tracking and workflow",
      "Document upload and management",
      "Application review and approval process",
      "Enrollment conversion from applications",
      "Waitlist management and communication"
    ],
    frontendRequirements: [
      "Online application forms with document upload",
      "Application pipeline dashboard (kanban view)",
      "Application review and evaluation interface",
      "Automated communication templates",
      "Enrollment confirmation and registration",
      "Admissions analytics and reporting"
    ],
    estimatedHours: 32
  },
  {
    name: "Academics & Gradebook",
    id: "academics",
    priority: "high",
    description: "Academic record management including grades, assessments, and report cards",
    backendRequirements: [
      "Gradebook structure with subjects and terms",
      "Grade entry and calculation engine",
      "Assessment and assignment tracking",
      "Report card generation system",
      "Transcript generation and archiving",
      "Academic performance analytics"
    ],
    frontendRequirements: [
      "Gradebook interface with spreadsheet-like functionality",
      "Grade entry forms with validation",
      "Student grade reports and transcripts",
      "Assessment scheduling and management",
      "Academic performance dashboards",
      "Report card template customization"
    ],
    estimatedHours: 36
  },
  {
    name: "HR & Payroll",
    id: "hr",
    priority: "medium",
    description: "Staff management, payroll processing, and HR administration",
    backendRequirements: [
      "Staff profile management with roles and permissions",
      "Contract and employment tracking",
      "Leave management system",
      "Payroll calculation engine with deductions",
      "Payslip generation and distribution",
      "Performance review and evaluation system"
    ],
    frontendRequirements: [
      "Staff directory with detailed profiles",
      "Payroll processing dashboard",
      "Leave request and approval workflows",
      "Contract management interface",
      "Performance review tools",
      "HR analytics and reporting"
    ],
    estimatedHours: 40
  },
  {
    name: "Fee & Finance",
    id: "finance",
    priority: "high",
    description: "Comprehensive fee management, invoicing, and financial reporting",
    backendRequirements: [
      "Fee structure builder with flexible pricing",
      "Invoice generation and batch processing",
      "Payment recording and reconciliation",
      "Fee calculation and billing cycles",
      "Financial reporting and analytics",
      "Receipt and statement generation"
    ],
    frontendRequirements: [
      "Fee structure configuration interface",
      "Invoice generation and management dashboard",
      "Payment processing and reconciliation tools",
      "Financial reports and analytics",
      "Student fee statements and payment history",
      "Automated fee reminder system"
    ],
    estimatedHours: 44
  },
  {
    name: "Timetable & Scheduling",
    id: "timetable",
    priority: "medium",
    description: "Class scheduling, room allocation, and timetable management",
    backendRequirements: [
      "Timetable slot creation and management",
      "Conflict detection and resolution",
      "Room and resource allocation",
      "Substitute teacher assignment",
      "Schedule optimization algorithms",
      "Timetable export and sharing"
    ],
    frontendRequirements: [
      "Visual timetable builder with drag-and-drop",
      "Conflict detection and resolution tools",
      "Room and resource management interface",
      "Substitute teacher assignment system",
      "Schedule viewing for different user roles",
      "Timetable printing and sharing options"
    ],
    estimatedHours: 32
  },
  {
    name: "Library Management",
    id: "library",
    priority: "low",
    description: "Book catalog, circulation, and library administration",
    backendRequirements: [
      "Book catalog with ISBN integration",
      "Borrowing and return tracking",
      "Fine calculation and payment processing",
      "Inventory management and stock alerts",
      "Reservation and hold system",
      "Library analytics and reporting"
    ],
    frontendRequirements: [
      "Book catalog with search and filtering",
      "Circulation desk interface",
      "Patron management and communication",
      "Inventory management dashboard",
      "Fine payment processing",
      "Library usage analytics"
    ],
    estimatedHours: 24
  },
  {
    name: "Transport Management",
    id: "transport",
    priority: "low",
    description: "School transport routing, vehicle management, and student tracking",
    backendRequirements: [
      "Route creation and optimization",
      "Vehicle fleet management",
      "Student-route assignment system",
      "Driver management and scheduling",
      "Transport fee calculation",
      "GPS tracking integration (optional)"
    ],
    frontendRequirements: [
      "Route planning and mapping interface",
      "Vehicle management dashboard",
      "Student transport assignment tools",
      "Driver scheduling and management",
      "Transport fee billing system",
      "Route optimization and analytics"
    ],
    estimatedHours: 28
  },
  {
    name: "Communications",
    id: "communications",
    priority: "medium",
    description: "Multi-channel communication system with SMS, email, and notifications",
    backendRequirements: [
      "Message template management",
      "SMS sending via Africa's Talking",
      "Email sending via Resend",
      "Notification system with real-time delivery",
      "Emergency broadcast capabilities",
      "Communication analytics and tracking"
    ],
    frontendRequirements: [
      "Message composition and sending interface",
      "Template management and customization",
      "Broadcast message creation tools",
      "Communication history and analytics",
      "Emergency alert system",
      "Parent-teacher messaging platform"
    ],
    estimatedHours: 32
  },
  {
    name: "eWallet",
    id: "ewallet",
    priority: "medium",
    description: "Digital wallet system for students with transaction management",
    backendRequirements: [
      "Wallet balance management",
      "Transaction recording and tracking",
      "Top-up processing with multiple payment methods",
      "Spending limits and controls",
      "Transaction history and reporting",
      "Wallet-to-wallet transfers"
    ],
    frontendRequirements: [
      "Wallet dashboard with balance overview",
      "Top-up interface with payment options",
      "Transaction history and statements",
      "Spending analytics and insights",
      "Wallet settings and controls",
      "Parental controls and monitoring"
    ],
    estimatedHours: 24
  },
  {
    name: "eCommerce",
    id: "ecommerce",
    priority: "low",
    description: "School store and product management system",
    backendRequirements: [
      "Product catalog management",
      "Order processing and fulfillment",
      "Shopping cart functionality",
      "Payment integration with eWallet",
      "Inventory management and tracking",
      "Sales analytics and reporting"
    ],
    frontendRequirements: [
      "Product catalog with search and filtering",
      "Shopping cart and checkout process",
      "Order management dashboard",
      "Inventory tracking and alerts",
      "Sales analytics and reporting",
      "Customer account management"
    ],
    estimatedHours: 28
  }
];

/**
 * Generate markdown content for a phase issue
 */
function generatePhaseIssue(phase, task) {
  const requirements = task.requirements.map(req => `- [ ] ${req}`).join('\n');
  const files = task.files.map(file => `\`${file}\``).join(', ');

  return `# [PHASE ${phase.number}] ${task.title}

## Phase Overview
- **Phase Number**: ${phase.number}
- **Phase Title**: ${phase.title}
- **Estimated Duration**: ${phase.duration}
- **Dependencies**: ${phase.dependencies}
- **Estimated Hours**: ${task.estimatedHours}

## Task Description
${task.description}

## Detailed Requirements
${requirements}

## Acceptance Criteria
- [ ] All backend functions implemented and tested
- [ ] All frontend pages created and responsive
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Code review approved

## Files to Create/Modify
${files}

## Testing Requirements
- [ ] Unit tests for all functions
- [ ] Integration tests for workflows
- [ ] E2E tests for critical user journeys
- [ ] Performance tests if applicable

## Technical Notes
This task is part of Phase ${phase.number}: ${phase.title} and must be completed according to the implementation plan specifications.

## Dependencies
${phase.dependencies}

## Labels
\`implementation\`, \`phase-${phase.number}\`, \`backend\`, \`frontend\`

## Assignee
To be assigned

## Project Board
Phase ${phase.number} Column
`;
}

/**
 * Generate markdown content for a module issue
 */
function generateModuleIssue(module) {
  const backendReqs = module.backendRequirements.map(req => `- [ ] ${req}`).join('\n');
  const frontendReqs = module.frontendRequirements.map(req => `- [ ] ${req}`).join('\n');

  return `# [MODULE] ${module.name}

## Module Information
- **Module Name**: ${module.name}
- **Module ID**: ${module.id}
- **Priority**: ${module.priority}
- **Estimated Hours**: ${module.estimatedHours}

## Module Description
${module.description}

## Backend Requirements
${backendReqs}

## Frontend Requirements
${frontendReqs}

## Integration Requirements
- [ ] Payment webhooks (if applicable)
- [ ] Third-party API integrations
- [ ] Notification templates
- [ ] Permission checks using RBAC
- [ ] Module guard implementation
- [ ] Tenant isolation enforcement

## Acceptance Criteria
- [ ] All functions working correctly
- [ ] Tenant isolation enforced
- [ ] RBAC permissions respected
- [ ] Module can be installed/uninstalled
- [ ] Configuration settings work
- [ ] Tests passing
- [ ] Documentation updated

## Files to Create
- \`convex/modules/${module.id}/queries.ts\`
- \`convex/modules/${module.id}/mutations.ts\`
- \`convex/modules/${module.id}/actions.ts\` (if applicable)
- \`frontend/src/app/(admin)/${module.id}/*\`
- \`tests/modules/${module.id}.test.ts\`

## Dependencies
- Phase 1: Shared Foundation
- Module marketplace functionality
- Relevant payment integrations

## Labels
\`module\`, \`${module.id}\`, \`priority-${module.priority}\`, \`implementation\`

## Assignee
To be assigned

## Project Board
Modules Column
`;
}

/**
 * Main function to generate all issues
 */
function generateAllIssues() {
  console.log('🚀 Generating EduMyles Implementation Issues...\n');

  // Create output directory
  const outputDir = path.join(__dirname, '..', '.github', 'generated-issues');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate phase issues
  console.log('📋 Generating Phase Issues...');
  let totalPhaseHours = 0;
  phases.forEach(phase => {
    console.log(`\n  Phase ${phase.number}: ${phase.title}`);
    
    phase.tasks.forEach(task => {
      const filename = `phase-${phase.number}-${task.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      const filepath = path.join(outputDir, filename);
      const content = generatePhaseIssue(phase, task);
      
      fs.writeFileSync(filepath, content);
      console.log(`    ✅ Created: ${filename}`);
      
      totalPhaseHours += task.estimatedHours;
    });
  });

  // Generate module issues
  console.log('\n🔧 Generating Module Issues...');
  let totalModuleHours = 0;
  modules.forEach(module => {
    const filename = `module-${module.id}-${module.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const filepath = path.join(outputDir, filename);
    const content = generateModuleIssue(module);
    
    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created: ${filename}`);
    
    totalModuleHours += module.estimatedHours;
  });

  // Generate summary
  const totalHours = totalPhaseHours + totalModuleHours;
  const summary = {
    phases: phases.length,
    phaseTasks: phases.reduce((sum, phase) => sum + phase.tasks.length, 0),
    modules: modules.length,
    totalIssues: phases.reduce((sum, phase) => sum + phase.tasks.length, 0) + modules.length,
    estimatedHours: totalHours,
    estimatedWeeks: Math.ceil(totalHours / 40) // Assuming 40 hours per week
  };

  console.log('\n📊 Generation Summary:');
  console.log(`  Phases: ${summary.phases}`);
  console.log(`  Phase Tasks: ${summary.phaseTasks}`);
  console.log(`  Modules: ${summary.modules}`);
  console.log(`  Total Issues: ${summary.totalIssues}`);
  console.log(`  Estimated Hours: ${summary.estimatedHours}`);
  console.log(`  Estimated Weeks: ${summary.estimatedWeeks}`);

  // Save summary
  const summaryPath = path.join(outputDir, 'generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n💾 Summary saved to: ${summaryPath}`);

  console.log('\n✨ Issue generation complete!');
  console.log('\nNext steps:');
  console.log('1. Review generated issues in .github/generated-issues/');
  console.log('2. Use GitHub CLI or manually create issues from the markdown files');
  console.log('3. Set up project board with appropriate columns');
  console.log('4. Configure automation workflows for issue tracking');
}

// Run the generator
if (require.main === module) {
  generateAllIssues();
}

module.exports = {
  generateAllIssues,
  phases,
  modules,
  generatePhaseIssue,
  generateModuleIssue
};
