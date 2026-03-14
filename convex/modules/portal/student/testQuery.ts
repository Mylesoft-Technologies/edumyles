import { v } from "convex/values";
import { query } from "../../../_generated/server";

/**
 * Simple test query to debug student profile issues
 */
export const testStudentProfile = query({
    args: {},
    handler: async (ctx) => {
        console.log("=== TEST STUDENT PROFILE QUERY ===");
        
        try {
            // Just return basic session info without complex auth
            const identity = await ctx.auth.getUserIdentity();
            console.log("Auth identity:", identity);
            
            if (!identity) {
                console.log("No identity found");
                return { error: "No identity found" };
            }
            
            console.log("Identity found:", {
                tokenIdentifier: identity.tokenIdentifier || "",
                tenantId: identity.tenantId,
                userId: identity.userId,
                role: identity.role
            });
            
            // Try a simple database query
            const students = await ctx.db
                .query("students")
                .withIndex("by_tenant", (q) => q.eq("tenantId", identity.tenantId))
                .collect();
            
            console.log(`Found ${students.length} students for tenant ${identity.tenantId}`);
            
            return {
                identity: identity,
                studentCount: students.length,
                students: students.map(s => ({
                    _id: s._id,
                    firstName: s.firstName,
                    lastName: s.lastName,
                    userId: s.userId,
                    tenantId: s.tenantId
                }))
            };
            
        } catch (error: any) {
            console.error("Test query error:", error);
            return { error: (error as Error).message };
        }
    },
});
