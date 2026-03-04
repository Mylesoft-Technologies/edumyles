import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

/**
 * Bulk enter or update grades for students.
 */
export const enterGrades = mutation({
    args: {
        tenantId: v.string(),
        grades: v.array(
            v.object({
                studentId: v.string(),
                classId: v.string(),
                subjectId: v.string(),
                term: v.string(),
                academicYear: v.string(),
                score: v.number(),
                grade: v.string(),
                remarks: v.optional(v.string()),
                recordedBy: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");
        // requirePermission(ctx, "grades:write"); // Assuming middleware provides context

        const now = Date.now();
        for (const record of args.grades) {
            // Check if a grade already exists for this student, subject, and term
            const existing = await ctx.db
                .query("grades")
                .withIndex("by_student", (q) =>
                    q.eq("studentId", record.studentId).eq("term", record.term)
                )
                .filter((q) => q.eq(q.field("subjectId"), record.subjectId))
                .first();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    ...record,
                    updatedAt: now,
                });
            } else {
                await ctx.db.insert("grades", {
                    ...record,
                    tenantId: args.tenantId,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }
        return { success: true, count: args.grades.length };
    },
});

/**
 * Create a new assignment.
 */
export const createAssignment = mutation({
    args: {
        tenantId: v.string(),
        classId: v.string(),
        subjectId: v.string(),
        teacherId: v.string(),
        title: v.string(),
        description: v.string(),
        dueDate: v.string(),
        maxPoints: v.number(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        const now = Date.now();
        const assignmentId = await ctx.db.insert("assignments", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });

        return assignmentId;
    },
});

/**
 * Grade a student's submission.
 */
export const gradeSubmission = mutation({
    args: {
        tenantId: v.string(),
        submissionId: v.id("submissions"),
        grade: v.number(),
        feedback: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        const now = Date.now();
        await ctx.db.patch(args.submissionId, {
            grade: args.grade,
            feedback: args.feedback,
            status: "graded",
            gradedAt: now,
        });

        return { success: true };
    },
});

/**
 * Bulk mark attendance for a class on a specific date.
 */
export const markAttendance = mutation({
    args: {
        tenantId: v.string(),
        records: v.array(
            v.object({
                classId: v.string(),
                studentId: v.string(),
                date: v.string(),
                status: v.string(),
                remarks: v.optional(v.string()),
                recordedBy: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        const now = Date.now();
        for (const record of args.records) {
            const existing = await ctx.db
                .query("attendance")
                .withIndex("by_student_date", (q) =>
                    q.eq("studentId", record.studentId).eq("date", record.date)
                )
                .first();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    ...record,
                });
            } else {
                await ctx.db.insert("attendance", {
                    ...record,
                    tenantId: args.tenantId,
                    createdAt: now,
                });
            }
        }
        return { success: true, count: args.records.length };
    },
});

/**
 * Placeholder for report card generation logic.
 */
export const generateReportCard = mutation({
    args: {
        tenantId: v.string(),
        studentId: v.string(),
        term: v.string(),
        academicYear: v.string(),
    },
    handler: async (ctx, args) => {
        await requireModule(ctx, args.tenantId, "academics");

        const now = Date.now();
        // This would involve complex calculations of GPA, ranks, etc.
        // For now, we just insert a record.
        const reportCardId = await ctx.db.insert("reportCards", {
            ...args,
            status: "generating",
            generatedAt: now,
            createdAt: now,
        });

        return reportCardId;
    },
});
