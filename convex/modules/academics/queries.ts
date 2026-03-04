import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

/**
 * Get all classes assigned to a specific teacher.
 */
export const getTeacherClasses = query({
    args: {
        tenantId: v.string(),
        teacherId: v.string(),
    },
    handler: async (ctx, args) => {
        // We assume the caller (middleware/hooks) handles authentication and provides tenantId
        // But we'll add a quick guard here too.
        await requireModule(ctx, args.tenantId, "academics");

        return await ctx.db
            .query("classes")
            .withIndex("by_tenant_teacher", (q) =>
                q.eq("tenantId", args.tenantId).eq("teacherId", args.teacherId)
            )
            .collect();
    },
});

/**
 * Get all students in a specific class.
 */
export const getClassStudents = query({
    args: {
        tenantId: v.string(),
        classId: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "sis");

        return await ctx.db
            .query("students")
            .withIndex("by_tenant_class", (q) =>
                q.eq("tenantId", args.tenantId).eq("classId", args.classId)
            )
            .collect();
    },
});

/**
 * Get grade records for a class, subject, and term.
 */
export const getGrades = query({
    args: {
        tenantId: v.string(),
        classId: v.string(),
        subjectId: v.string(),
        term: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        return await ctx.db
            .query("grades")
            .withIndex("by_class_subject", (q) =>
                q.eq("classId", args.classId)
                    .eq("subjectId", args.subjectId)
                    .eq("term", args.term)
            )
            .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
            .collect();
    },
});

/**
 * Get assignments for a specific class.
 */
export const getAssignments = query({
    args: {
        tenantId: v.string(),
        classId: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        return await ctx.db
            .query("assignments")
            .withIndex("by_class", (q) => q.eq("classId", args.classId))
            .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
            .collect();
    },
});

/**
 * Get all submissions for a specific assignment.
 */
export const getSubmissions = query({
    args: {
        tenantId: v.string(),
        assignmentId: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        return await ctx.db
            .query("submissions")
            .withIndex("by_assignment", (q) => q.eq("assignmentId", args.assignmentId))
            .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
            .collect();
    },
});

/**
 * Get attendance records for a class on a specific date.
 */
export const getAttendance = query({
    args: {
        tenantId: v.string(),
        classId: v.string(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        return await ctx.db
            .query("attendance")
            .withIndex("by_class_date", (q) =>
                q.eq("classId", args.classId).eq("date", args.date)
            )
            .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
            .collect();
    },
});
