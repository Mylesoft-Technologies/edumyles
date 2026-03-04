import { v } from "convex/values";
import { query } from "../../../_generated/server";
import type { Id } from "../../../_generated/dataModel";
import { requireTenantContext } from "../../../helpers/tenantGuard";
import { requirePermission } from "../../../helpers/authorize";
import { requireModule } from "../../../helpers/moduleGuard";

/** Resolve the partner record for the current user in this tenant. */
async function getPartnerRecord(ctx: any, tenant: any) {
  const partner = await ctx.db
    .query("partners")
    .withIndex("by_user", (q: any) => q.eq("userId", tenant.userId))
    .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
    .first();

  if (!partner || !partner.isActive) return null;
  return partner;
}

/**
 * Get the partner (organization) profile for the current user.
 */
export const getPartnerProfile = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    requirePermission(tenant, "students:read");

    return await getPartnerRecord(ctx, tenant);
  },
});

/**
 * Get students under this partner's sponsorship.
 */
export const getSponsoredStudents = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "sis");
    requirePermission(tenant, "students:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) return [];

    const sponsorships = await ctx.db
      .query("sponsorships")
      .withIndex("by_partner", (q: any) => q.eq("partnerId", partner._id.toString()))
      .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .collect();

    const studentIds = [...new Set(sponsorships.map((s: any) => s.studentId))];
    if (studentIds.length === 0) return [];

    const students = await ctx.db
      .query("students")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const sponsored = students.filter((s: any) => studentIds.includes(s._id.toString()));
    return sponsored.map((s: any) => {
      const sponsorship = sponsorships.find((sp: any) => sp.studentId === s._id.toString());
      return {
        ...s,
        sponsorshipAmountCents: sponsorship?.amountCents,
        sponsorshipCurrency: sponsorship?.currency,
        sponsorshipStartDate: sponsorship?.startDate,
        sponsorshipEndDate: sponsorship?.endDate,
      };
    });
  },
});

/**
 * Get sponsorship report for the partner: academic/financial summary for a term.
 */
export const getSponsorshipReport = query({
  args: {
    term: v.optional(v.string()),
    academicYear: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "reports:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) return { students: [], totalInvestedCents: 0, summary: {} };

    const sponsorships = await ctx.db
      .query("sponsorships")
      .withIndex("by_partner", (q: any) => q.eq("partnerId", partner._id.toString()))
      .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .collect();

    const studentIds = sponsorships.map((s: any) => s.studentId);
    const totalInvestedCents = sponsorships.reduce((sum: number, s: any) => sum + (s.amountCents || 0), 0);

    if (studentIds.length === 0) {
      return { students: [], totalInvestedCents, summary: {} };
    }

    const grades = await ctx.db
      .query("grades")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const students = await ctx.db
      .query("students")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const sponsoredStudents = students.filter((s: any) => studentIds.includes(s._id.toString()));

    const studentsWithReport = sponsoredStudents.map((s: any) => {
      const sid = s._id.toString();
      const termGrades = grades.filter(
        (g: any) => g.studentId === sid && (!args.term || g.term === args.term) && (!args.academicYear || g.academicYear === args.academicYear)
      );
      const avgScore = termGrades.length
        ? termGrades.reduce((a: number, g: any) => a + g.score, 0) / termGrades.length
        : null;
      const termAttendance = attendance.filter(
        (a: any) => a.studentId === sid
      );
      const presentCount = termAttendance.filter((a: any) => a.status === "present").length;
      const totalSessions = termAttendance.length;
      const attendanceRate = totalSessions ? (presentCount / totalSessions) * 100 : null;

      return {
        studentId: sid,
        firstName: s.firstName,
        lastName: s.lastName,
        admissionNumber: s.admissionNumber,
        classId: s.classId,
        status: s.status,
        averageScore: avgScore,
        attendanceRate,
        gradesCount: termGrades.length,
      };
    });

    const summary = {
      totalStudents: studentsWithReport.length,
      totalInvestedCents,
      averageScore: studentsWithReport.filter((r: any) => r.averageScore != null).length
        ? studentsWithReport.reduce((a: number, r: any) => a + (r.averageScore ?? 0), 0) /
          studentsWithReport.filter((r: any) => r.averageScore != null).length
        : null,
    };

    return {
      students: studentsWithReport,
      totalInvestedCents,
      summary,
    };
  },
});

/**
 * Payment history and upcoming dues for sponsored students (invoices + payments).
 */
export const getPartnerPayments = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "finance");
    requirePermission(tenant, "finance:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) return { payments: [], upcomingDues: [] };

    const sponsorships = await ctx.db
      .query("sponsorships")
      .withIndex("by_partner", (q: any) => q.eq("partnerId", partner._id.toString()))
      .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
      .collect();

    const studentIds = new Set(sponsorships.map((s: any) => s.studentId));
    if (studentIds.size === 0) return { payments: [], upcomingDues: [] };

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const sponsoredInvoices = invoices.filter((i: any) => studentIds.has(i.studentId));
    const invoiceIds = new Set(sponsoredInvoices.map((i: any) => i._id.toString()));

    const allPayments = await ctx.db
      .query("payments")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();

    const payments = allPayments.filter((p: any) => invoiceIds.has(p.invoiceId));
    const upcomingDues = sponsoredInvoices.filter(
      (i: any) => i.status === "pending" || i.status === "partially_paid"
    );

    return {
      payments: payments.sort((a: any, b: any) => b.processedAt - a.processedAt),
      upcomingDues,
    };
  },
});

/**
 * Relevant school updates / announcements for partners (notifications).
 */
export const getPartnerAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    requirePermission(tenant, "students:read");

    return await ctx.db
      .query("notifications")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .order("desc")
      .take(50);
  },
});

/**
 * Single sponsored student academic/attendance report (read-only) for partner.
 */
export const getSponsoredStudentReport = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "sis");
    requirePermission(tenant, "students:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) return null;

    const sponsorship = await ctx.db
      .query("sponsorships")
      .withIndex("by_partner", (q: any) => q.eq("partnerId", partner._id.toString()))
      .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
      .filter((q: any) => q.eq(q.field("studentId"), args.studentId))
      .first();

    if (!sponsorship) return null;

    const student = await ctx.db.get(args.studentId as Id<"students">);
    if (!student || student.tenantId !== tenant.tenantId) return null;

    const allGrades = await ctx.db
      .query("grades")
      .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
      .collect();
    const grades = allGrades.filter((g: any) => g.studentId === args.studentId);

    const attendanceRecords = await ctx.db
      .query("attendance")
      .withIndex("by_student_date", (q: any) => q.eq("studentId", args.studentId))
      .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
      .order("desc")
      .take(60);

    return {
      student,
      sponsorship: {
        amountCents: sponsorship.amountCents,
        currency: sponsorship.currency,
        startDate: sponsorship.startDate,
        endDate: sponsorship.endDate,
        status: sponsorship.status,
      },
      grades,
      attendance: attendanceRecords,
    };
  },
});
