import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { logAction } from "../../helpers/auditLog";

const VALID_STATUSES = ["draft", "submitted", "under_review", "accepted", "rejected", "waitlisted", "enrolled"];

const VALID_TRANSITIONS: Record<string, string[]> = {
    draft: ["submitted"],
    submitted: ["under_review", "rejected"],
    under_review: ["accepted", "rejected", "waitlisted"],
    accepted: ["enrolled", "rejected"],
    waitlisted: ["accepted", "rejected"],
    rejected: [],
    enrolled: [],
};

/**
 * Submit a new admission application.
 */
export const submitApplication = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.string(),
        gender: v.string(),
        requestedGrade: v.string(),
        guardianName: v.string(),
        guardianPhone: v.string(),
        guardianEmail: v.string(),
        documents: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        asDraft: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");
        await requireModule(ctx, tenantCtx.tenantId, "admissions");

        const { tenantId } = tenantCtx;
        const now = Date.now();

        const applicationId = `APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const status = args.asDraft ? "draft" : "submitted";

        const id = await ctx.db.insert("admissionApplications", {
            tenantId,
            applicationId,
            firstName: args.firstName,
            lastName: args.lastName,
            dateOfBirth: args.dateOfBirth,
            gender: args.gender,
            requestedGrade: args.requestedGrade,
            guardianName: args.guardianName,
            guardianPhone: args.guardianPhone,
            guardianEmail: args.guardianEmail,
            documents: args.documents,
            notes: args.notes,
            status,
            submittedAt: status === "submitted" ? now : undefined,
            createdAt: now,
            updatedAt: now,
        });

        await logAction(ctx, {
            tenantId,
            userId: tenantCtx.userId,
            action: "admission.submitted",
            targetId: id,
            targetType: "admissionApplication",
            details: { applicationId, status },
        });

        return { success: true, id, applicationId };
    },
});

/**
 * Update admission application status.
 */
export const updateApplicationStatus = mutation({
    args: {
        applicationId: v.id("admissionApplications"),
        status: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");

        if (!VALID_STATUSES.includes(args.status)) {
            throw new Error(`INVALID_STATUS: '${args.status}' is not a valid status`);
        }

        const application = await ctx.db.get(args.applicationId);
        if (!application || application.tenantId !== tenantCtx.tenantId) {
            throw new Error("APPLICATION_NOT_FOUND");
        }

        const allowedTransitions = VALID_TRANSITIONS[application.status] ?? [];
        if (!allowedTransitions.includes(args.status)) {
            throw new Error(
                `INVALID_TRANSITION: Cannot move from '${application.status}' to '${args.status}'. Allowed: [${allowedTransitions.join(", ")}]`
            );
        }

        const now = Date.now();
        await ctx.db.patch(args.applicationId, {
            status: args.status,
            notes: args.notes ?? application.notes,
            reviewedBy: tenantCtx.userId,
            reviewedAt: now,
            submittedAt: args.status === "submitted" ? now : application.submittedAt,
            updatedAt: now,
        });

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "admission.status_updated",
            targetId: args.applicationId,
            targetType: "admissionApplication",
            details: { from: application.status, to: args.status },
        });

        return { success: true };
    },
});

/**
 * Enroll a student from an accepted application.
 * Creates a student record in SIS and updates the application status to "enrolled".
 */
export const enrollFromApplication = mutation({
    args: {
        applicationId: v.id("admissionApplications"),
        classId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:write");

        const application = await ctx.db.get(args.applicationId);
        if (!application || application.tenantId !== tenantCtx.tenantId) {
            throw new Error("APPLICATION_NOT_FOUND");
        }

        if (application.status !== "accepted") {
            throw new Error("INVALID_STATUS: Application must be in 'accepted' status to enroll");
        }

        const { tenantId } = tenantCtx;
        const now = Date.now();

        // Generate admission number
        const admissionNumber = `ADM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Create student record
        const studentId = await ctx.db.insert("students", {
            tenantId,
            firstName: application.firstName,
            lastName: application.lastName,
            dateOfBirth: application.dateOfBirth,
            gender: application.gender,
            classId: args.classId,
            admissionNumber,
            status: "active",
            enrolledAt: now,
            createdAt: now,
            updatedAt: now,
        });

        // Create guardian record
        await ctx.db.insert("guardians", {
            tenantId,
            firstName: application.guardianName.split(" ")[0] || application.guardianName,
            lastName: application.guardianName.split(" ").slice(1).join(" ") || "",
            email: application.guardianEmail,
            phone: application.guardianPhone,
            relationship: "guardian",
            studentIds: [studentId],
            createdAt: now,
            updatedAt: now,
        });

        // Update application status to enrolled
        await ctx.db.patch(args.applicationId, {
            status: "enrolled",
            updatedAt: now,
        });

        await logAction(ctx, {
            tenantId,
            userId: tenantCtx.userId,
            action: "admission.enrolled",
            targetId: args.applicationId,
            targetType: "admissionApplication",
            details: { studentId, admissionNumber },
        });

        return { success: true, studentId, admissionNumber };
    },
});
