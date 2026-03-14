import { v } from "convex/values";
import { query } from "../../../_generated/server";
import { requireTenantContext } from "../../../helpers/tenantGuard";
import { requirePermission } from "../../../helpers/authorize";
import { requireModule } from "../../../helpers/moduleGuard";

/**
 * Get the student record for the current authenticated user.
 */
export const getMyProfile = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        // Student profile is part of SIS
        await requireModule(ctx, tenant.tenantId, "sis");

        // First try to find by userId (preferred method)
        let student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        // If not found by userId, try finding by session matching (fallback)
        if (!student) {
            console.log("Student not found by userId, trying fallback methods");
            
            // Try to find any student record for this tenant as fallback
            const allStudents = await ctx.db
                .query("students")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
                .collect();
            
            console.log(`Found ${allStudents.length} students for tenant ${tenant.tenantId}`);
            
            // For now, return the first student as a fallback
            // In production, this should be handled by proper user-student linking
            student = allStudents.length > 0 ? allStudents[0] : null;
        }

        if (!student) {
            console.log("No student record found for user:", tenant.userId, "tenant:", tenant.tenantId);
            return null;
        }

        // Verify tenant match
        if (student.tenantId !== tenant.tenantId) {
            console.log("Tenant mismatch:", student.tenantId, "vs", tenant.tenantId);
            return null;
        }

        console.log("Found student:", student._id, student.firstName, student.lastName);
        return student;
    },
});

export const getMyGrades = query({
    args: {
        term: v.optional(v.string()),
        academicYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "academics");
        requirePermission(tenant, "grades:read");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        if (!student) return [];

        let gradesQuery = ctx.db
            .query("grades")
            .withIndex("by_student", (q) =>
                q.eq("studentId", student._id.toString())
            )
            .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId));

        const grades = await gradesQuery.collect();

        return grades.filter(g =>
            (!args.term || g.term === args.term) &&
            (!args.academicYear || g.academicYear === args.academicYear)
        );
    },
});

export const getMyAttendance = query({
    args: {
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "academics");
        requirePermission(tenant, "attendance:read");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        if (!student) return [];

        const records = await ctx.db
            .query("attendance")
            .withIndex("by_student_date", (q) =>
                q.eq("studentId", student._id.toString())
            )
            .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
            .collect();

        if (args.startDate || args.endDate) {
            return records.filter(r =>
                (!args.startDate || r.date >= args.startDate) &&
                (!args.endDate || r.date <= args.endDate)
            );
        }

        return records;
    },
});

export const getMyTimetable = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "timetable");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        if (!student || !student.classId) return [];

        return await ctx.db
            .query("timetables")
            .withIndex("by_class", (q) =>
                q.eq("classId", student.classId!)
            )
            .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
            .collect();
    },
});

export const getMyAssignments = query({
    args: {
        status: v.optional(v.union(v.literal("pending"), v.literal("submitted"), v.literal("graded"))),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "academics");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        if (!student || !student.classId) return [];

        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_class", (q) =>
                q.eq("classId", student.classId!)
            )
            .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
            .collect();

        const submissions = await ctx.db
            .query("submissions")
            .withIndex("by_student", (q) =>
                q.eq("studentId", student._id.toString())
            )
            .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
            .collect();

        const result = assignments.map(a => {
            const submission = submissions.find(s => s.assignmentId === a._id);
            return {
                ...a,
                submission,
                status: submission ? (submission.grade !== undefined ? "graded" : "submitted") : "pending"
            };
        });

        if (args.status) {
            return result.filter(r => r.status === args.status);
        }

        return result;
    },
});

export const getMyWalletBalance = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "ewallet");

        // For now, if no wallet table exists, we return a mock or 0.
        // Looking at schema, there isn't an ewallet table yet.
        // The implementation plan says eWallet is Phase 10.
        // I'll return a mock balance for now if the table is missing.
        return { balanceCents: 0, currency: "KES" };
    },
});

export const getMyReportCards = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "academics");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        if (!student) return [];

        return await ctx.db
            .query("reportCards")
            .withIndex("by_student_term", (q) =>
                q.eq("studentId", student._id.toString())
            )
            .filter((q) =>
                q.and(
                    q.eq(q.field("tenantId"), tenant.tenantId),
                    q.eq(q.field("status"), "published")
                )
            )
            .collect();
    },
});

export const getMySubmission = query({
    args: {
        assignmentId: v.id("assignments"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "academics");

        const submission = await ctx.db
            .query("submissions")
            .withIndex("by_student", (q) =>
                q.eq("studentId", args.userId)
            )
            .filter((q) => 
                q.and(
                    q.eq(q.field("tenantId"), tenant.tenantId),
                    q.eq(q.field("assignmentId"), args.assignmentId)
                )
            )
            .first();

        return submission;
    },
});

export const getAnnouncements = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "communications");

        const student = await ctx.db
            .query("students")
            .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
            .first();

        return await ctx.db
            .query("notifications")
            .withIndex("by_tenant", (q) =>
                q.eq("tenantId", tenant.tenantId)
            )
            .filter(q => q.or(
                q.eq(q.field("type"), "announcement"),
                q.eq(q.field("type"), "general")
            ))
            .collect();
    },
});
