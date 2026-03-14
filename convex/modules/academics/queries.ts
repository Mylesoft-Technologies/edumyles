import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { requireTenantContext } from "../../helpers/tenantGuard";

/**
 * Get all classes assigned to the currently authenticated teacher.
 */
export const getTeacherClasses = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "students:read");

    return await ctx.db
      .query("classes")
      .withIndex("by_tenant_teacher", (q) =>
        q.eq("tenantId", tenant.tenantId).eq("teacherId", tenant.userId)
      )
      .collect();
  },
});

/**
 * Get all students in a specific class (scoped to tenant).
 */
export const getClassStudents = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "sis");
    requirePermission(tenant, "students:read");

    return await ctx.db
      .query("students")
      .withIndex("by_tenant_class", (q) =>
        q.eq("tenantId", tenant.tenantId).eq("classId", args.classId)
      )
      .collect();
  },
});

/**
 * Get grade records for a class, subject, and term.
 */
export const getGrades = query({
  args: {
    classId: v.string(),
    subjectId: v.string(),
    term: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "grades:read");

    return await ctx.db
      .query("grades")
      .withIndex("by_class_subject", (q) =>
        q
          .eq("classId", args.classId)
          .eq("subjectId", args.subjectId)
          .eq("term", args.term)
      )
      .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
      .collect();
  },
});

/**
 * Get assignments for a specific class.
 */
export const getAssignments = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");

    return await ctx.db
      .query("assignments")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
      .collect();
  },
});

/**
 * Get a specific assignment by ID.
 */
export const getAssignment = query({
  args: {
    assignmentId: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");

    const assignment = await ctx.db.get(args.assignmentId);
    
    if (!assignment || assignment.tenantId !== tenant.tenantId) {
      return null;
    }

    return assignment;
  },
});

/**
 * Get all submissions for a specific assignment.
 */
export const getSubmissions = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");

    return await ctx.db
      .query("submissions")
      .withIndex("by_assignment", (q) =>
        q.eq("assignmentId", args.assignmentId)
      )
      .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
      .collect();
  },
});

/**
 * Get attendance records for a class on a specific date.
 */
export const getAttendance = query({
  args: {
    classId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "attendance:read");

    return await ctx.db
      .query("attendance")
      .withIndex("by_class_date", (q) =>
        q.eq("classId", args.classId).eq("date", args.date)
      )
      .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
      .collect();
  },
});

/**
 * Get academics dashboard statistics.
 */
export const getAcademicsStats = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "students:read");

    const [classes, subjects, teachers, grades] = await Promise.all([
      ctx.db
        .query("classes")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
        .collect(),
      ctx.db
        .query("subjects")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
        .collect(),
      ctx.db
        .query("staff")
        .withIndex("by_tenant_role", (q) =>
          q.eq("tenantId", tenant.tenantId).eq("role", "teacher")
        )
        .collect(),
      ctx.db
        .query("grades")
        .withIndex("by_class_subject", (q) => q.eq("classId", "dummy")) // We'll need to filter differently
        .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId))
        .collect(),
    ]);

    // Calculate average performance
    const avgPerformance = grades.length > 0
      ? Math.round(
          grades.reduce((sum, grade) => sum + (grade.score || 0), 0) / grades.length
        )
      : 0;

    return {
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      activeTeachers: teachers.length,
      avgPerformance,
    };
  },
});

/**
 * Get recent examinations for the dashboard.
 */
export const getRecentExams = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "grades:read");

    const limit = args.limit || 10;

    // Since we don't have examinations table yet, return mock data
    // This will be implemented when we create the examinations table
    return [
      {
        _id: "exam1",
        name: "Mid-Term Examinations",
        className: "Grade 5",
        date: "2024-03-15",
        status: "completed",
        submissions: 38,
        total: 40,
        tenantId: tenant.tenantId,
        createdAt: Date.now() - 86400000,
      },
      {
        _id: "exam2",
        name: "Science Practical Test",
        className: "Grade 8",
        date: "2024-03-18",
        status: "ongoing",
        submissions: 25,
        total: 35,
        tenantId: tenant.tenantId,
        createdAt: Date.now() - 43200000,
      },
      {
        _id: "exam3",
        name: "Mathematics Assessment",
        className: "Grade 3",
        date: "2024-03-20",
        status: "scheduled",
        submissions: 0,
        total: 42,
        tenantId: tenant.tenantId,
        createdAt: Date.now(),
      },
    ].slice(0, limit);
  },
});

/**
 * Get upcoming academic events.
 */
export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "academics");
    requirePermission(tenant, "students:read");

    const limit = args.limit || 10;

    // Since we don't have academicEvents table yet, return mock data
    // This will be implemented when we create the academicEvents table
    return [
      {
        _id: "event1",
        title: "Parent-Teacher Meeting",
        date: "2024-03-25",
        time: "2:00 PM",
        type: "meeting",
        tenantId: tenant.tenantId,
        createdAt: Date.now(),
      },
      {
        _id: "event2",
        title: "Science Fair",
        date: "2024-03-28",
        time: "9:00 AM",
        type: "event",
        tenantId: tenant.tenantId,
        createdAt: Date.now(),
      },
      {
        _id: "event3",
        title: "End of Term Exams",
        date: "2024-04-10",
        time: "8:00 AM",
        type: "exam",
        tenantId: tenant.tenantId,
        createdAt: Date.now(),
      },
    ].slice(0, limit);
  },
});
