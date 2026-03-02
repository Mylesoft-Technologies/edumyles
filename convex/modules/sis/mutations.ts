import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { logAction } from "../../helpers/auditLog";

/**
 * Create a new student record.
 */
export const createStudent = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.string(),
        gender: v.string(),
        classId: v.optional(v.string()),
        admissionNumber: v.optional(v.string()),
        guardianName: v.optional(v.string()),
        guardianEmail: v.optional(v.string()),
        guardianPhone: v.optional(v.string()),
        guardianRelationship: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");
        await requireModule(ctx, tenantCtx.tenantId, "sis");

        const { tenantId } = tenantCtx;
        const now = Date.now();

        // Auto-generate admission number if not provided
        const admissionNumber =
            args.admissionNumber ||
            `ADM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Check for duplicate admission number
        const existing = await ctx.db
            .query("students")
            .withIndex("by_admission", (q) =>
                q.eq("tenantId", tenantId).eq("admissionNumber", admissionNumber)
            )
            .first();

        if (existing) {
            throw new Error("DUPLICATE_ADMISSION_NUMBER: This admission number already exists");
        }

        const studentId = await ctx.db.insert("students", {
            tenantId,
            firstName: args.firstName,
            lastName: args.lastName,
            dateOfBirth: args.dateOfBirth,
            gender: args.gender,
            classId: args.classId,
            admissionNumber,
            status: "active",
            enrolledAt: now,
            createdAt: now,
            updatedAt: now,
        });

        // Create guardian record if provided
        if (args.guardianName && args.guardianEmail && args.guardianPhone) {
            await ctx.db.insert("guardians", {
                tenantId,
                firstName: args.guardianName.split(" ")[0] || args.guardianName,
                lastName: args.guardianName.split(" ").slice(1).join(" ") || "",
                email: args.guardianEmail,
                phone: args.guardianPhone,
                relationship: args.guardianRelationship || "guardian",
                studentIds: [studentId],
                createdAt: now,
                updatedAt: now,
            });
        }

        await logAction(ctx, {
            tenantId,
            userId: tenantCtx.userId,
            action: "student.created",
            targetId: studentId,
            targetType: "student",
            details: { admissionNumber, firstName: args.firstName, lastName: args.lastName },
        });

        return { success: true, studentId, admissionNumber };
    },
});

/**
 * Update an existing student record.
 */
export const updateStudent = mutation({
    args: {
        studentId: v.id("students"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        dateOfBirth: v.optional(v.string()),
        gender: v.optional(v.string()),
        classId: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");

        const student = await ctx.db.get(args.studentId);
        if (!student || student.tenantId !== tenantCtx.tenantId) {
            throw new Error("STUDENT_NOT_FOUND");
        }

        const updates: Record<string, unknown> = { updatedAt: Date.now() };
        if (args.firstName !== undefined) updates.firstName = args.firstName;
        if (args.lastName !== undefined) updates.lastName = args.lastName;
        if (args.dateOfBirth !== undefined) updates.dateOfBirth = args.dateOfBirth;
        if (args.gender !== undefined) updates.gender = args.gender;
        if (args.classId !== undefined) updates.classId = args.classId;
        if (args.status !== undefined) updates.status = args.status;

        await ctx.db.patch(args.studentId, updates);

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "student.updated",
            targetId: args.studentId,
            targetType: "student",
            details: updates,
        });

        return { success: true };
    },
});

/**
 * Transfer a student to a different class.
 */
export const transferStudent = mutation({
    args: {
        studentId: v.id("students"),
        toClassId: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");

        const student = await ctx.db.get(args.studentId);
        if (!student || student.tenantId !== tenantCtx.tenantId) {
            throw new Error("STUDENT_NOT_FOUND");
        }

        const fromClassId = student.classId;

        await ctx.db.patch(args.studentId, {
            classId: args.toClassId,
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "student.updated",
            targetId: args.studentId,
            targetType: "student",
            details: { transfer: true, fromClassId, toClassId: args.toClassId },
        });

        return { success: true };
    },
});

/**
 * Graduate a student (mark as graduated).
 */
export const graduateStudent = mutation({
    args: {
        studentId: v.id("students"),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");

        const student = await ctx.db.get(args.studentId);
        if (!student || student.tenantId !== tenantCtx.tenantId) {
            throw new Error("STUDENT_NOT_FOUND");
        }

        await ctx.db.patch(args.studentId, {
            status: "graduated",
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "student.updated",
            targetId: args.studentId,
            targetType: "student",
            details: { graduated: true },
        });

        return { success: true };
    },
});

/**
 * Create a new class.
 */
export const createClass = mutation({
    args: {
        name: v.string(),
        level: v.optional(v.string()),
        stream: v.optional(v.string()),
        teacherId: v.optional(v.string()),
        capacity: v.optional(v.number()),
        academicYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "settings:write");
        await requireModule(ctx, tenantCtx.tenantId, "sis");

        const classId = await ctx.db.insert("classes", {
            tenantId: tenantCtx.tenantId,
            name: args.name,
            level: args.level,
            stream: args.stream,
            teacherId: args.teacherId,
            capacity: args.capacity,
            academicYear: args.academicYear,
            createdAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "class.created",
            targetId: classId,
            targetType: "class",
            details: { name: args.name },
        });

        return { success: true, classId };
    },
});

/**
 * Update a class.
 */
export const updateClass = mutation({
    args: {
        classId: v.id("classes"),
        name: v.optional(v.string()),
        level: v.optional(v.string()),
        stream: v.optional(v.string()),
        teacherId: v.optional(v.string()),
        capacity: v.optional(v.number()),
        academicYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "settings:write");

        const classRecord = await ctx.db.get(args.classId);
        if (!classRecord || classRecord.tenantId !== tenantCtx.tenantId) {
            throw new Error("CLASS_NOT_FOUND");
        }

        const updates: Record<string, unknown> = {};
        if (args.name !== undefined) updates.name = args.name;
        if (args.level !== undefined) updates.level = args.level;
        if (args.stream !== undefined) updates.stream = args.stream;
        if (args.teacherId !== undefined) updates.teacherId = args.teacherId;
        if (args.capacity !== undefined) updates.capacity = args.capacity;
        if (args.academicYear !== undefined) updates.academicYear = args.academicYear;

        await ctx.db.patch(args.classId, updates);

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "class.updated",
            targetId: args.classId,
            targetType: "class",
            details: updates,
        });

        return { success: true };
    },
});
