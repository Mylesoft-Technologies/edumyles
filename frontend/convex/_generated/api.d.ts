/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_auth_password from "../actions/auth/password.js";
import type * as actions_auth_twoFactor from "../actions/auth/twoFactor.js";
import type * as actions_communications_email from "../actions/communications/email.js";
import type * as actions_communications_sms from "../actions/communications/sms.js";
import type * as actions_payments_mpesa from "../actions/payments/mpesa.js";
import type * as actions_payments_stripe from "../actions/payments/stripe.js";
import type * as auth from "../auth.js";
import type * as convex__generated_api from "../convex/_generated/api.js";
import type * as convex__generated_server from "../convex/_generated/server.js";
import type * as helpers_auditLog from "../helpers/auditLog.js";
import type * as helpers_authorize from "../helpers/authorize.js";
import type * as helpers_idGenerator from "../helpers/idGenerator.js";
import type * as helpers_moduleGuard from "../helpers/moduleGuard.js";
import type * as helpers_platformGuard from "../helpers/platformGuard.js";
import type * as helpers_tenantGuard from "../helpers/tenantGuard.js";
import type * as http from "../http.js";
import type * as modules_academics_mutations from "../modules/academics/mutations.js";
import type * as modules_academics_queries from "../modules/academics/queries.js";
import type * as modules_admissions_mutations from "../modules/admissions/mutations.js";
import type * as modules_admissions_queries from "../modules/admissions/queries.js";
import type * as modules_auth_loginAttempts from "../modules/auth/loginAttempts.js";
import type * as modules_auth_passwordHelpers from "../modules/auth/passwordHelpers.js";
import type * as modules_auth_passwordPolicy from "../modules/auth/passwordPolicy.js";
import type * as modules_auth_twoFactorHelpers from "../modules/auth/twoFactorHelpers.js";
import type * as modules_communications_mutations from "../modules/communications/mutations.js";
import type * as modules_communications_platform from "../modules/communications/platform.js";
import type * as modules_communications_queries from "../modules/communications/queries.js";
import type * as modules_ecommerce_mutations from "../modules/ecommerce/mutations.js";
import type * as modules_ecommerce_queries from "../modules/ecommerce/queries.js";
import type * as modules_ewallet_mutations from "../modules/ewallet/mutations.js";
import type * as modules_ewallet_queries from "../modules/ewallet/queries.js";
import type * as modules_finance_actions from "../modules/finance/actions.js";
import type * as modules_finance_mutations from "../modules/finance/mutations.js";
import type * as modules_finance_queries from "../modules/finance/queries.js";
import type * as modules_hr_mutations from "../modules/hr/mutations.js";
import type * as modules_hr_queries from "../modules/hr/queries.js";
import type * as modules_library_mutations from "../modules/library/mutations.js";
import type * as modules_library_queries from "../modules/library/queries.js";
import type * as modules_marketplace_moduleDefinitions from "../modules/marketplace/moduleDefinitions.js";
import type * as modules_marketplace_mutations from "../modules/marketplace/mutations.js";
import type * as modules_marketplace_platform from "../modules/marketplace/platform.js";
import type * as modules_marketplace_queries from "../modules/marketplace/queries.js";
import type * as modules_marketplace_seed from "../modules/marketplace/seed.js";
import type * as modules_marketplace_tierModules from "../modules/marketplace/tierModules.js";
import type * as modules_portal_alumni_mutations from "../modules/portal/alumni/mutations.js";
import type * as modules_portal_alumni_queries from "../modules/portal/alumni/queries.js";
import type * as modules_portal_parent_index from "../modules/portal/parent/index.js";
import type * as modules_portal_parent_mutations from "../modules/portal/parent/mutations.js";
import type * as modules_portal_parent_queries from "../modules/portal/parent/queries.js";
import type * as modules_portal_partner_index from "../modules/portal/partner/index.js";
import type * as modules_portal_partner_mutations from "../modules/portal/partner/mutations.js";
import type * as modules_portal_partner_queries from "../modules/portal/partner/queries.js";
import type * as modules_portal_student_index from "../modules/portal/student/index.js";
import type * as modules_portal_student_mutations from "../modules/portal/student/mutations.js";
import type * as modules_portal_student_queries from "../modules/portal/student/queries.js";
import type * as modules_portal_student_testQuery from "../modules/portal/student/testQuery.js";
import type * as modules_sis_mutations from "../modules/sis/mutations.js";
import type * as modules_sis_queries from "../modules/sis/queries.js";
import type * as modules_timetable_mutations from "../modules/timetable/mutations.js";
import type * as modules_timetable_queries from "../modules/timetable/queries.js";
import type * as modules_transport_mutations from "../modules/transport/mutations.js";
import type * as modules_transport_queries from "../modules/transport/queries.js";
import type * as notifications from "../notifications.js";
import type * as organizations from "../organizations.js";
import type * as platform_analytics_index from "../platform/analytics/index.js";
import type * as platform_analytics_mutations from "../platform/analytics/mutations.js";
import type * as platform_analytics_queries from "../platform/analytics/queries.js";
import type * as platform_audit_index from "../platform/audit/index.js";
import type * as platform_audit_queries from "../platform/audit/queries.js";
import type * as platform_automation_index from "../platform/automation/index.js";
import type * as platform_automation_mutations from "../platform/automation/mutations.js";
import type * as platform_automation_queries from "../platform/automation/queries.js";
import type * as platform_billing_index from "../platform/billing/index.js";
import type * as platform_billing_mutations from "../platform/billing/mutations.js";
import type * as platform_billing_queries from "../platform/billing/queries.js";
import type * as platform_communications_index from "../platform/communications/index.js";
import type * as platform_communications_mutations from "../platform/communications/mutations.js";
import type * as platform_communications_queries from "../platform/communications/queries.js";
import type * as platform_dashboard_index from "../platform/dashboard/index.js";
import type * as platform_dashboard_queries from "../platform/dashboard/queries.js";
import type * as platform_files_index from "../platform/files/index.js";
import type * as platform_files_mutations from "../platform/files/mutations.js";
import type * as platform_files_queries from "../platform/files/queries.js";
import type * as platform_health_index from "../platform/health/index.js";
import type * as platform_health_queries from "../platform/health/queries.js";
import type * as platform_impersonation_index from "../platform/impersonation/index.js";
import type * as platform_impersonation_mutations from "../platform/impersonation/mutations.js";
import type * as platform_impersonation_queries from "../platform/impersonation/queries.js";
import type * as platform_index from "../platform/index.js";
import type * as platform_integration_index from "../platform/integration/index.js";
import type * as platform_integration_mutations from "../platform/integration/mutations.js";
import type * as platform_integration_queries from "../platform/integration/queries.js";
import type * as platform_marketplace_index from "../platform/marketplace/index.js";
import type * as platform_marketplace_mutations from "../platform/marketplace/mutations.js";
import type * as platform_marketplace_payments from "../platform/marketplace/payments.js";
import type * as platform_marketplace_queries from "../platform/marketplace/queries.js";
import type * as platform_notifications_index from "../platform/notifications/index.js";
import type * as platform_notifications_mutations from "../platform/notifications/mutations.js";
import type * as platform_notifications_queries from "../platform/notifications/queries.js";
import type * as platform_operations_index from "../platform/operations/index.js";
import type * as platform_operations_mutations from "../platform/operations/mutations.js";
import type * as platform_operations_queries from "../platform/operations/queries.js";
import type * as platform_security_index from "../platform/security/index.js";
import type * as platform_security_mutations from "../platform/security/mutations.js";
import type * as platform_security_queries from "../platform/security/queries.js";
import type * as platform_settings_index from "../platform/settings/index.js";
import type * as platform_settings_maintenanceCheck from "../platform/settings/maintenanceCheck.js";
import type * as platform_settings_mutations from "../platform/settings/mutations.js";
import type * as platform_settings_queries from "../platform/settings/queries.js";
import type * as platform_support_index from "../platform/support/index.js";
import type * as platform_support_mutations from "../platform/support/mutations.js";
import type * as platform_support_queries from "../platform/support/queries.js";
import type * as platform_tenantSuccess_index from "../platform/tenantSuccess/index.js";
import type * as platform_tenantSuccess_mutations from "../platform/tenantSuccess/mutations.js";
import type * as platform_tenantSuccess_queries from "../platform/tenantSuccess/queries.js";
import type * as platform_tenants_index from "../platform/tenants/index.js";
import type * as platform_tenants_mutations from "../platform/tenants/mutations.js";
import type * as platform_tenants_queries from "../platform/tenants/queries.js";
import type * as platform_users_index from "../platform/users/index.js";
import type * as platform_users_mutations from "../platform/users/mutations.js";
import type * as platform_users_queries from "../platform/users/queries.js";
import type * as sessions from "../sessions.js";
import type * as tenants from "../tenants.js";
import type * as tickets from "../tickets.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/auth/password": typeof actions_auth_password;
  "actions/auth/twoFactor": typeof actions_auth_twoFactor;
  "actions/communications/email": typeof actions_communications_email;
  "actions/communications/sms": typeof actions_communications_sms;
  "actions/payments/mpesa": typeof actions_payments_mpesa;
  "actions/payments/stripe": typeof actions_payments_stripe;
  auth: typeof auth;
  "convex/_generated/api": typeof convex__generated_api;
  "convex/_generated/server": typeof convex__generated_server;
  "helpers/auditLog": typeof helpers_auditLog;
  "helpers/authorize": typeof helpers_authorize;
  "helpers/idGenerator": typeof helpers_idGenerator;
  "helpers/moduleGuard": typeof helpers_moduleGuard;
  "helpers/platformGuard": typeof helpers_platformGuard;
  "helpers/tenantGuard": typeof helpers_tenantGuard;
  http: typeof http;
  "modules/academics/mutations": typeof modules_academics_mutations;
  "modules/academics/queries": typeof modules_academics_queries;
  "modules/admissions/mutations": typeof modules_admissions_mutations;
  "modules/admissions/queries": typeof modules_admissions_queries;
  "modules/auth/loginAttempts": typeof modules_auth_loginAttempts;
  "modules/auth/passwordHelpers": typeof modules_auth_passwordHelpers;
  "modules/auth/passwordPolicy": typeof modules_auth_passwordPolicy;
  "modules/auth/twoFactorHelpers": typeof modules_auth_twoFactorHelpers;
  "modules/communications/mutations": typeof modules_communications_mutations;
  "modules/communications/platform": typeof modules_communications_platform;
  "modules/communications/queries": typeof modules_communications_queries;
  "modules/ecommerce/mutations": typeof modules_ecommerce_mutations;
  "modules/ecommerce/queries": typeof modules_ecommerce_queries;
  "modules/ewallet/mutations": typeof modules_ewallet_mutations;
  "modules/ewallet/queries": typeof modules_ewallet_queries;
  "modules/finance/actions": typeof modules_finance_actions;
  "modules/finance/mutations": typeof modules_finance_mutations;
  "modules/finance/queries": typeof modules_finance_queries;
  "modules/hr/mutations": typeof modules_hr_mutations;
  "modules/hr/queries": typeof modules_hr_queries;
  "modules/library/mutations": typeof modules_library_mutations;
  "modules/library/queries": typeof modules_library_queries;
  "modules/marketplace/moduleDefinitions": typeof modules_marketplace_moduleDefinitions;
  "modules/marketplace/mutations": typeof modules_marketplace_mutations;
  "modules/marketplace/platform": typeof modules_marketplace_platform;
  "modules/marketplace/queries": typeof modules_marketplace_queries;
  "modules/marketplace/seed": typeof modules_marketplace_seed;
  "modules/marketplace/tierModules": typeof modules_marketplace_tierModules;
  "modules/portal/alumni/mutations": typeof modules_portal_alumni_mutations;
  "modules/portal/alumni/queries": typeof modules_portal_alumni_queries;
  "modules/portal/parent/index": typeof modules_portal_parent_index;
  "modules/portal/parent/mutations": typeof modules_portal_parent_mutations;
  "modules/portal/parent/queries": typeof modules_portal_parent_queries;
  "modules/portal/partner/index": typeof modules_portal_partner_index;
  "modules/portal/partner/mutations": typeof modules_portal_partner_mutations;
  "modules/portal/partner/queries": typeof modules_portal_partner_queries;
  "modules/portal/student/index": typeof modules_portal_student_index;
  "modules/portal/student/mutations": typeof modules_portal_student_mutations;
  "modules/portal/student/queries": typeof modules_portal_student_queries;
  "modules/portal/student/testQuery": typeof modules_portal_student_testQuery;
  "modules/sis/mutations": typeof modules_sis_mutations;
  "modules/sis/queries": typeof modules_sis_queries;
  "modules/timetable/mutations": typeof modules_timetable_mutations;
  "modules/timetable/queries": typeof modules_timetable_queries;
  "modules/transport/mutations": typeof modules_transport_mutations;
  "modules/transport/queries": typeof modules_transport_queries;
  notifications: typeof notifications;
  organizations: typeof organizations;
  "platform/analytics/index": typeof platform_analytics_index;
  "platform/analytics/mutations": typeof platform_analytics_mutations;
  "platform/analytics/queries": typeof platform_analytics_queries;
  "platform/audit/index": typeof platform_audit_index;
  "platform/audit/queries": typeof platform_audit_queries;
  "platform/automation/index": typeof platform_automation_index;
  "platform/automation/mutations": typeof platform_automation_mutations;
  "platform/automation/queries": typeof platform_automation_queries;
  "platform/billing/index": typeof platform_billing_index;
  "platform/billing/mutations": typeof platform_billing_mutations;
  "platform/billing/queries": typeof platform_billing_queries;
  "platform/communications/index": typeof platform_communications_index;
  "platform/communications/mutations": typeof platform_communications_mutations;
  "platform/communications/queries": typeof platform_communications_queries;
  "platform/dashboard/index": typeof platform_dashboard_index;
  "platform/dashboard/queries": typeof platform_dashboard_queries;
  "platform/files/index": typeof platform_files_index;
  "platform/files/mutations": typeof platform_files_mutations;
  "platform/files/queries": typeof platform_files_queries;
  "platform/health/index": typeof platform_health_index;
  "platform/health/queries": typeof platform_health_queries;
  "platform/impersonation/index": typeof platform_impersonation_index;
  "platform/impersonation/mutations": typeof platform_impersonation_mutations;
  "platform/impersonation/queries": typeof platform_impersonation_queries;
  "platform/index": typeof platform_index;
  "platform/integration/index": typeof platform_integration_index;
  "platform/integration/mutations": typeof platform_integration_mutations;
  "platform/integration/queries": typeof platform_integration_queries;
  "platform/marketplace/index": typeof platform_marketplace_index;
  "platform/marketplace/mutations": typeof platform_marketplace_mutations;
  "platform/marketplace/payments": typeof platform_marketplace_payments;
  "platform/marketplace/queries": typeof platform_marketplace_queries;
  "platform/notifications/index": typeof platform_notifications_index;
  "platform/notifications/mutations": typeof platform_notifications_mutations;
  "platform/notifications/queries": typeof platform_notifications_queries;
  "platform/operations/index": typeof platform_operations_index;
  "platform/operations/mutations": typeof platform_operations_mutations;
  "platform/operations/queries": typeof platform_operations_queries;
  "platform/security/index": typeof platform_security_index;
  "platform/security/mutations": typeof platform_security_mutations;
  "platform/security/queries": typeof platform_security_queries;
  "platform/settings/index": typeof platform_settings_index;
  "platform/settings/maintenanceCheck": typeof platform_settings_maintenanceCheck;
  "platform/settings/mutations": typeof platform_settings_mutations;
  "platform/settings/queries": typeof platform_settings_queries;
  "platform/support/index": typeof platform_support_index;
  "platform/support/mutations": typeof platform_support_mutations;
  "platform/support/queries": typeof platform_support_queries;
  "platform/tenantSuccess/index": typeof platform_tenantSuccess_index;
  "platform/tenantSuccess/mutations": typeof platform_tenantSuccess_mutations;
  "platform/tenantSuccess/queries": typeof platform_tenantSuccess_queries;
  "platform/tenants/index": typeof platform_tenants_index;
  "platform/tenants/mutations": typeof platform_tenants_mutations;
  "platform/tenants/queries": typeof platform_tenants_queries;
  "platform/users/index": typeof platform_users_index;
  "platform/users/mutations": typeof platform_users_mutations;
  "platform/users/queries": typeof platform_users_queries;
  sessions: typeof sessions;
  tenants: typeof tenants;
  tickets: typeof tickets;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workOSAuthKit: {
    lib: {
      enqueueWebhookEvent: FunctionReference<
        "mutation",
        "internal",
        {
          apiKey: string;
          event: string;
          eventId: string;
          eventTypes?: Array<string>;
          logLevel?: "DEBUG";
          onEventHandle?: string;
          updatedAt?: string;
        },
        any
      >;
      getAuthUser: FunctionReference<
        "query",
        "internal",
        { id: string },
        {
          createdAt: string;
          email: string;
          emailVerified: boolean;
          externalId?: null | string;
          firstName?: null | string;
          id: string;
          lastName?: null | string;
          lastSignInAt?: null | string;
          locale?: null | string;
          metadata: Record<string, any>;
          profilePictureUrl?: null | string;
          updatedAt: string;
        } | null
      >;
    };
  };
};
