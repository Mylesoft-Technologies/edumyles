import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

export const listStudents = query({
    args: {
        status: v.optional(v.string()),
        classId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "sis");
        requirePermission(tenant, "students:read");

        let studentsQuery = ctx.db
            .query("students")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId));

        if (args.status) {
            studentsQuery = ctx.db
                .query("students")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("status", args.status!)
                );
        } else if (args.classId) {
            studentsQuery = ctx.db
                .query("students")
                .withIndex("by_tenant_class", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("classId", args.classId)
                );
        }

        return await studentsQuery.order("desc").collect();
    },
});

export const getStudent = query({
    args: { studentId: v.id("students") },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "sis");
        requirePermission(tenant, "students:read");

        const student = await ctx.db.get(args.studentId);
        if (!student || student.tenantId !== tenant.tenantId) {
            return null;
        }

        const classData = student.classId
            ? await ctx.db.get(student.classId as any)
            : null;

        const guardians = await ctx.db
            .query("guardians")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
            .collect();

        const studentGuardians = guardians.filter((g) =>
            g.studentIds.includes(student._id.toString())
        );

        return {
            ...student,
            class: classData,
            guardians: studentGuardians,
        };
    },
});

export const getStudentStats = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "sis");
        requirePermission(tenant, "students:read");

        const students = await ctx.db
            .query("students")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
            .collect();

        return {
            total: students.length,
            active: students.filter((s) => s.status === "active").length,
            graduated: students.filter((s) => s.status === "graduated").length,
            suspended: students.filter((s) => s.status === "suspended").length,
        };
    },
});

export const listClasses = query({
    args: {
        academicYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "sis");
        requirePermission(tenant, "students:read");

        let classesQuery = ctx.db
            .query("classes")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId));

        const classes = await classesQuery.collect();
        const enrichedClasses = await Promise.all(
            classes.map(async (c) => {
                const students = await ctx.db
                    .query("students")
                    .withIndex("by_tenant_class", (q) =>
                        q.eq("tenantId", tenant.tenantId).eq("classId", c._id)
                    )
                    .collect();
                return { ...c, studentCount: students.length };
            })
        );

        if (args.academicYear) {
            return enrichedClasses.filter((c) => c.academicYear === args.academicYear);
        }
        return enrichedClasses;
    },
});

export const listGuardians = query({
    args: {},
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "sis");
        requirePermission(tenant, "students:read");

        return await ctx.db
            .query("guardians")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
            .collect();
    },
});
