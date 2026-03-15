import { query } from "../../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../../helpers/platformGuard";

/**
 * Get security overview with metrics
 */
export const getSecurityOverview = query({
  args: {
    sessionToken: v.string(),
    timeRange: v.optional(v.union(v.literal("1h"), v.literal("24h"), v.literal("7d"), v.literal("30d"))),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    const timeRange = args.timeRange || "24h";
    const now = Date.now();
    let timeFilter = 0;
    
    switch (timeRange) {
      case "1h":
        timeFilter = 1 * 60 * 60 * 1000;
        break;
      case "24h":
        timeFilter = 24 * 60 * 60 * 1000;
        break;
      case "7d":
        timeFilter = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        timeFilter = 30 * 24 * 60 * 60 * 1000;
        break;
    }

    // Get security metrics
    const [activeThreats, mitigatedThreats, totalIncidents, resolvedIncidents, blockedIPs] = await Promise.all([
      ctx.db
        .query("threats")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .filter((q) => q.gte(q.field("detectedAt"), now - timeFilter))
        .collect()
        .then(threats => threats.length),
      
      ctx.db
        .query("threats")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .withIndex("by_status", (q) => q.eq("status", "resolved"))
        .filter((q) => q.gte(q.field("mitigatedAt"), now - timeFilter))
        .collect()
        .then(threats => threats.length),
      
      ctx.db
        .query("securityIncidents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .filter((q) => q.gte(q.field("createdAt"), now - timeFilter))
        .collect()
        .then(incidents => incidents.length),
      
      ctx.db
        .query("securityIncidents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .withIndex("by_status", (q) => q.eq("status", "resolved"))
        .filter((q) => q.gte(q.field("resolvedAt"), now - timeFilter))
        .collect()
        .then(incidents => incidents.length),
      
      ctx.db
        .query("blockedIPs")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .filter((q) => q.gte(q.field("blockedAt"), now - timeFilter))
        .collect()
        .then(ips => ips.length),
    ]);

    // Calculate security score based on multiple factors
    const threatScore = Math.max(0, Math.min(100, 100 - (activeThreats * 10) + (mitigatedThreats * 2)));
    const incidentScore = Math.max(0, Math.min(100, 100 - (totalIncidents * 5) + (resolvedIncidents * 3)));
    const accessScore = Math.max(0, Math.min(100, 100 - (blockedIPs * 2)));
    
    const overallScore = Math.round((threatScore + incidentScore + accessScore) / 3);
    
    let level: "excellent" | "good" | "fair" | "poor" | "critical";
    if (overallScore >= 90) level = "excellent";
    else if (overallScore >= 75) level = "good";
    else if (overallScore >= 60) level = "fair";
    else if (overallScore >= 40) level = "poor";
    else level = "critical";

    return {
      overall: {
        score: overallScore,
        level,
        trend: "stable", // Would be calculated based on historical data
      },
      threats: {
        active: activeThreats,
        mitigated: mitigatedThreats,
        falsePositives: 0, // Would be calculated from threat data
        trend: "stable", // Would be calculated based on historical data
      },
      incidents: {
        open: totalIncidents - resolvedIncidents,
        investigating: 0, // Would be calculated from incident data
        resolved: resolvedIncidents,
        averageResolutionTime: 0, // Would be calculated from incident data
      },
      compliance: {
        score: 85, // Would be calculated from compliance data
        violations: 3, // Would be calculated from compliance data
        lastAudit: now - (7 * 24 * 60 * 60 * 1000), // Mock: 7 days ago
      },
      access: {
        totalAttempts: 0, // Would be calculated from access logs
        failedAttempts: 0, // Would be calculated from access logs
        suspiciousIPs: blockedIPs,
        blockedAttempts: blockedIPs,
      },
    };
  },
});

/**
 * Get active security threats
 */
export const getActiveThreats = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("mitigating"), v.literal("resolved"), v.literal("all"))),
    category: v.optional(v.union(
      v.literal("malware"),
      v.literal("phishing"),
      v.literal("brute_force"),
      v.literal("ddos"),
      v.literal("injection"),
      v.literal("xss"),
      v.literal("social_engineering"),
      v.literal("insider_threat")
    )),
    severity: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    let threatsQuery = ctx.db
      .query("threats")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

    // Apply filters
    if (args.status && args.status !== "all") {
      threatsQuery = threatsQuery.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    if (args.category) {
      threatsQuery = threatsQuery.filter((q) => q.eq(q.field("type"), args.category));
    }

    if (args.severity) {
      threatsQuery = threatsQuery.filter((q) => q.eq(q.field("severity"), args.severity));
    }

    const threats = await threatsQuery
      .order("desc")
      .take(args.limit || 50)
      .collect();

    // Enrich with mitigations
    const threatsWithMitigations = await Promise.all(
      threats.map(async (threat) => {
        const mitigations = await ctx.db
          .query("threatMitigations")
          .withIndex("by_threatId", (q) => q.eq("threatId", threat._id))
          .collect();

        return {
          ...threat,
          mitigations,
        };
      })
    );

    return threatsWithMitigations;
  },
});

/**
 * Get security incidents
 */
export const getSecurityIncidents = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(v.union(v.literal("open"), v.literal("investigating"), v.literal("contained"), v.literal("resolved"), v.literal("closed"))),
    category: v.optional(v.union(
      v.literal("unauthorized_access"),
      v.literal("data_breach"),
      v.literal("malware"),
      v.literal("phishing"),
      v.literal("denial_of_service"),
      v.literal("vulnerability"),
      v.literal("policy_violation"),
      v.literal("other")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    let incidentsQuery = ctx.db
      .query("securityIncidents")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

    // Apply filters
    if (args.status && args.status !== "all") {
      incidentsQuery = incidentsQuery.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    if (args.category) {
      incidentsQuery = incidentsQuery.filter((q) => q.eq(q.field("category"), args.category));
    }

    const incidents = await incidentsQuery
      .order("desc")
      .take(args.limit || 20)
      .collect();

    // Enrich with timeline
    const incidentsWithTimeline = await Promise.all(
      incidents.map(async (incident) => {
        const timeline = await ctx.db
          .query("securityIncidentTimeline")
          .withIndex("by_incidentId", (q) => q.eq("incidentId", incident._id))
          .order("desc")
          .collect();

        return {
          ...incident,
          timeline,
        };
      })
    );

    return incidentsWithTimeline;
  },
});

/**
 * Get compliance status
 */
export const getComplianceStatus = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    // Mock compliance data (in real implementation, this would integrate with compliance frameworks)
    const complianceAreas = [
      {
        area: "Access Control",
        score: 95,
        status: "compliant",
        lastAssessed: Date.now() - (2 * 24 * 60 * 60 * 1000),
        requirements: [
          "Multi-factor authentication implemented",
          "Role-based access control active",
          "Regular access reviews conducted",
        ],
      },
      {
        area: "Data Protection",
        score: 88,
        status: "needs_improvement",
        lastAssessed: Date.now() - (5 * 24 * 60 * 60 * 1000),
        requirements: [
          "Data encryption at rest",
          "Data encryption in transit",
          "Data loss prevention",
        ],
        violations: [
          "Some data not encrypted",
          "Missing data classification",
        ],
      },
      {
        area: "Network Security",
        score: 92,
        status: "compliant",
        lastAssessed: Date.now() - (1 * 24 * 60 * 60 * 1000),
        requirements: [
          "Firewall configuration",
          "Intrusion detection system",
          "Network segmentation",
        ],
      },
      {
        area: "Incident Response",
        score: 78,
        status: "needs_improvement",
        lastAssessed: Date.now() - (3 * 24 * 60 * 60 * 1000),
        requirements: [
          "Incident response plan",
          "Regular security drills",
          "Post-incident reviews",
        ],
        violations: [
          "Response time exceeds SLA",
          "Incomplete incident documentation",
        ],
      },
      {
        area: "Audit Logging",
        score: 98,
        status: "compliant",
        lastAssessed: Date.now() - (7 * 24 * 60 * 60 * 1000),
        requirements: [
          "Comprehensive audit trail",
          "Log retention policy",
          "Log monitoring and alerting",
        ],
      },
    ];

    const overallScore = Math.round(
      complianceAreas.reduce((sum, area) => sum + area.score, 0) / complianceAreas.length
    );

    const totalViolations = complianceAreas.reduce(
      (sum, area) => sum + (area.violations?.length || 0), 0
    );

    let level: "excellent" | "good" | "fair" | "poor" | "critical";
    if (overallScore >= 90) level = "excellent";
    else if (overallScore >= 80) level = "good";
    else if (overallScore >= 70) level = "fair";
    else if (overallScore >= 60) level = "poor";
    else level = "critical";

    return {
      score: overallScore,
      level,
      lastAudit: Date.now() - (7 * 24 * 60 * 60 * 1000),
      violations: totalViolations,
      areas: complianceAreas,
    };
  },
});

/**
 * Get access logs
 */
export const getAccessLogs = query({
  args: {
    sessionToken: v.string(),
    timeRange: v.optional(v.union(v.literal("1h"), v.literal("24h"), v.literal("7d"), v.literal("30d"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    const timeRange = args.timeRange || "24h";
    const now = Date.now();
    let timeFilter = 0;
    
    switch (timeRange) {
      case "1h":
        timeFilter = 1 * 60 * 60 * 1000;
        break;
      case "24h":
        timeFilter = 24 * 60 * 60 * 1000;
        break;
      case "7d":
        timeFilter = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        timeFilter = 30 * 24 * 60 * 60 * 1000;
        break;
    }

    // Mock access logs (in real implementation, this would integrate with authentication systems)
    const accessLogs = [
      {
        _id: "log_1",
        timestamp: now - (30 * 60 * 1000),
        action: "login_success",
        user: "admin@edumyles.com",
        ip: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: true,
        location: "Nairobi, Kenya",
      },
      {
        _id: "log_2",
        timestamp: now - (25 * 60 * 1000),
        action: "login_failed",
        user: "unknown@edumyles.com",
        ip: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: false,
        reason: "invalid_credentials",
        location: "Unknown",
      },
      {
        _id: "log_3",
        timestamp: now - (20 * 60 * 1000),
        action: "api_access_denied",
        user: "user@edumyles.com",
        ip: "192.168.1.102",
        userAgent: "curl/7.68.0",
        success: false,
        reason: "insufficient_permissions",
        location: "Nairobi, Kenya",
      },
      {
        _id: "log_4",
        timestamp: now - (15 * 60 * 1000),
        action: "suspicious_activity",
        user: "admin@edumyles.com",
        ip: "203.0.113.45",
        userAgent: "Python-requests/2.28.1",
        success: false,
        reason: "brute_force_attempt",
        location: "Unknown",
      },
      {
        _id: "log_5",
        timestamp: now - (10 * 60 * 1000),
        action: "account_locked",
        user: "user@edumyles.com",
        ip: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: false,
        reason: "too_many_failed_attempts",
        location: "Nairobi, Kenya",
      },
    ].filter(log => log.timestamp >= now - timeFilter);

    return accessLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, args.limit || 100);
  },
});

/**
 * Get vulnerability scan results
 */
export const getVulnerabilityScan = query({
  args: {
    sessionToken: v.string(),
    scanId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    if (args.scanId) {
      // Get specific scan
      const scan = await ctx.db.get(args.scanId);
      if (!scan || scan.tenantId !== tenantId) {
        throw new Error("Scan not found");
      }

      // Get vulnerabilities for this scan
      const vulnerabilities = await ctx.db
        .query("vulnerabilities")
        .withIndex("by_scanId", (q) => q.eq("scanId", args.scanId))
        .collect();

      return {
        ...scan,
        vulnerabilities,
      };
    }

    // Get latest scan
    const latestScan = await ctx.db
      .query("vulnerabilityScans")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .order("desc")
      .first();

    if (!latestScan) {
      return {
        _id: null,
        type: null,
        status: null,
        targets: [],
        initiatedBy: null,
        startedAt: null,
        completedAt: null,
        vulnerabilitiesFound: 0,
        highRiskVulnerabilities: 0,
        mediumRiskVulnerabilities: 0,
        lowRiskVulnerabilities: 0,
        vulnerabilities: [],
      };
    }

    // Get vulnerabilities for latest scan
    const vulnerabilities = await ctx.db
      .query("vulnerabilities")
      .withIndex("by_scanId", (q) => q.eq("scanId", latestScan._id))
      .collect();

    return {
      ...latestScan,
      vulnerabilities,
    };
  },
});
