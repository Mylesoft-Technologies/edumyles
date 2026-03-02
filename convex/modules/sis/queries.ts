import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

/**
 * List students for the current tenant with optional filtering.
 */
export const listStudents = query({
    args: {
        status: v.optional(v.string()),
        classId: v.optional(v.string()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");
        await requireModule(ctx, tenantCtx.tenantId, "sis");

        const { tenantId } = tenantCtx;

        let students;

        if (args.classId) {
            students = await ctx.db
                .query("students")
                .withIndex("by_tenant_class", (q) =>
                    q.eq("tenantId", tenantId).eq("classId", args.classId!)
                )
                .collect();
        } else if (args.status) {
            students = await ctx.db
                .query("students")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenantId).eq("status", args.status!)
                )
                .collect();
        } else {
            students = await ctx.db
                .query("students")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
                .collect();
        }

        // Client-side search filtering (name or admission number)
        if (args.search) {
            const lower = args.search.toLowerCase();
            students = students.filter(
                (s) =>
                    s.firstName.toLowerCase().includes(lower) ||
                    s.lastName.toLowerCase().includes(lower) ||
                    s.admissionNumber.toLowerCase().includes(lower)
            );
        }

        return students;
    },
});

/**
 * Get a single student by their Convex document ID.
 */
export const getStudent = query({
    args: { studentId: v.id("students") },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        const student = await ctx.db.get(args.studentId);
        if (!student || student.tenantId !== tenantCtx.tenantId) {
            throw new Error("STUDENT_NOT_FOUND");
        }

        // Fetch guardian info
        const guardians = await ctx.db
            .query("guardians")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantCtx.tenantId))
            .filter((q) =>
                q.neq(q.field("studentIds"), undefined)
            )
            .collect();

        const studentGuardians = guardians.filter((g) =>
            g.studentIds.includes(student._id)
        );

        // Fetch class info
        let classInfo = null;
        if (student.classId) {
            const classes = await ctx.db
                .query("classes")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantCtx.tenantId))
                .collect();
            classInfo = classes.find((c) => c._id === student.classId) ?? null;
        }

        return {
            ...student,
            guardians: studentGuardians,
            class: classInfo,
        };
    },
});

/**
 * Get student statistics for the dashboard.
 */
export const getStudentStats = query({
    args: {},
    handler: async (ctx) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        const { tenantId } = tenantCtx;

        const allStudents = await ctx.db
            .query("students")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        const total = allStudents.length;
        const active = allStudents.filter((s) => s.status === "active").length;
        const graduated = allStudents.filter((s) => s.status === "graduated").length;
        const suspended = allStudents.filter((s) => s.status === "suspended").length;

        // Count by class
        const byClass: Record<string, number> = {};
        for (const s of allStudents) {
            if (s.classId) {
                byClass[s.classId] = (byClass[s.classId] || 0) + 1;
            }
        }

        return { total, active, graduated, suspended, byClass };
    },
});

/**
 * List all classes for the tenant.
 */
export const listClasses = query({
    args: {},
    handler: async (ctx) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        const { tenantId } = tenantCtx;

        const classes = await ctx.db
            .query("classes")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        // Get student counts per class
        const students = await ctx.db
            .query("students")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        return classes.map((c) => ({
            ...c,
            studentCount: students.filter((s) => s.classId === c._id).length,
        }));
    },
});

/**
 * List all guardians for the tenant.
 */
export const listGuardians = query({
    args: {},
    handler: async (ctx) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        return await ctx.db
            .query("guardians")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantCtx.tenantId))
            .collect();
    },
});
