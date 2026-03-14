import { CORE_MODULE_IDS } from "./moduleDefinitions";

/**
 * Single source of truth for which modules are available per subscription tier.
 * Core modules (sis, communications, users) are always included in every tier.
 * Imported by queries.ts and mutations.ts — never duplicate this mapping.
 */

/** Optional modules available per tier (core modules are always included) */
const TIER_OPTIONAL_MODULES: Record<string, string[]> = {
  free: ["tickets"],
  starter: ["admissions", "tickets"],
  standard: ["admissions", "academics", "finance", "timetable", "tickets"],
  growth: ["admissions", "academics", "finance", "timetable", "tickets"],
  pro: ["admissions", "academics", "finance", "timetable", "hr", "library", "transport", "tickets"],
  enterprise: [
    "admissions", "academics", "finance", "timetable",
    "hr", "library", "transport",
    "ewallet", "ecommerce", "tickets",
  ],
};

/** Full tier modules = core + optional for that tier */
export const TIER_MODULES: Record<string, string[]> = Object.fromEntries(
  Object.entries(TIER_OPTIONAL_MODULES).map(([tier, optional]) => [
    tier,
    [...CORE_MODULE_IDS, ...optional],
  ])
);
