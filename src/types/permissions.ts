/**
 * Role-Based Access Control & Feature Tier System
 * 
 * Designed for multi-tier SaaS:
 * - Tier 1 (MVP): Basic clinic management
 * - Tier 2: Advanced features (to be defined)
 * - Tier 3: Premium features (to be defined)
 */

export type UserRole = "DOCTOR" | "ASSISTANT" | "ADMIN";

export enum SubscriptionTier {
  FREE = "FREE",
  TIER_1 = "TIER_1", // MVP - Basic features
  TIER_2 = "TIER_2", // Add advanced features
  TIER_3 = "TIER_3", // Premium features
}

/**
 * Feature permissions mapped to roles and tiers
 */
export enum Permission {
  // === PATIENT MANAGEMENT ===
  VIEW_PATIENTS = "VIEW_PATIENTS",
  CREATE_PATIENTS = "CREATE_PATIENTS",
  EDIT_PATIENTS = "EDIT_PATIENTS",
  DELETE_PATIENTS = "DELETE_PATIENTS",
  VIEW_PATIENT_HISTORY = "VIEW_PATIENT_HISTORY",

  // === APPOINTMENTS ===
  VIEW_APPOINTMENTS = "VIEW_APPOINTMENTS",
  CREATE_APPOINTMENTS = "CREATE_APPOINTMENTS",
  EDIT_APPOINTMENTS = "EDIT_APPOINTMENTS",
  DELETE_APPOINTMENTS = "DELETE_APPOINTMENTS",
  VIEW_ALL_DOCTORS_APPOINTMENTS = "VIEW_ALL_DOCTORS_APPOINTMENTS", // Admin only

  // === BILLING (TIER 2 Feature Example) ===
  VIEW_BILLING = "VIEW_BILLING",
  CREATE_INVOICES = "CREATE_INVOICES",
  EDIT_INVOICES = "EDIT_INVOICES",
  VIEW_FINANCIAL_REPORTS = "VIEW_FINANCIAL_REPORTS", // Admin only

  // === SETTINGS & ADMIN ===
  MANAGE_USERS = "MANAGE_USERS", // Add/remove doctors/assistants
  MANAGE_CLINIC_SETTINGS = "MANAGE_CLINIC_SETTINGS",
  VIEW_ANALYTICS = "VIEW_ANALYTICS", // Admin dashboard
  EXPORT_DATA = "EXPORT_DATA",

  // === ADVANCED FEATURES (TIER 2/3 - To be defined) ===
  USE_AI_DIAGNOSIS = "USE_AI_DIAGNOSIS", // Tier 3 example
  USE_ADVANCED_REPORTING = "USE_ADVANCED_REPORTING", // Tier 2 example
  INTEGRATION_XRAY = "INTEGRATION_XRAY", // Tier 2 example
  MULTI_CLINIC_MANAGEMENT = "MULTI_CLINIC_MANAGEMENT", // Tier 3 for clinic chains
}

/**
 * Role-based permission matrix
 * Define what each role can do by default (Tier 1)
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  DOCTOR: [
    Permission.VIEW_PATIENTS,
    Permission.CREATE_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.VIEW_PATIENT_HISTORY,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    Permission.DELETE_APPOINTMENTS,
    Permission.VIEW_BILLING,
    Permission.CREATE_INVOICES,
  ],

  ASSISTANT: [
    Permission.VIEW_PATIENTS,
    Permission.CREATE_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    // Note: Cannot delete, no billing access
  ],

  ADMIN: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],
};

/**
 * Tier-based feature availability
 * Controls which features are available per subscription tier
 */

// Define base features for each tier separately to avoid circular reference
const FREE_FEATURES: Permission[] = [
  // Very limited for demo/trial
  Permission.VIEW_PATIENTS,
  Permission.VIEW_APPOINTMENTS,
];

const TIER_1_FEATURES: Permission[] = [
  // MVP - All basic features
  Permission.VIEW_PATIENTS,
  Permission.CREATE_PATIENTS,
  Permission.EDIT_PATIENTS,
  Permission.DELETE_PATIENTS,
  Permission.VIEW_PATIENT_HISTORY,
  Permission.VIEW_APPOINTMENTS,
  Permission.CREATE_APPOINTMENTS,
  Permission.EDIT_APPOINTMENTS,
  Permission.DELETE_APPOINTMENTS,
  Permission.VIEW_ALL_DOCTORS_APPOINTMENTS,
  Permission.MANAGE_USERS,
  Permission.MANAGE_CLINIC_SETTINGS,
];

const TIER_2_FEATURES: Permission[] = [
  // Tier 1 + Advanced features
  ...TIER_1_FEATURES,
  Permission.VIEW_BILLING,
  Permission.CREATE_INVOICES,
  Permission.EDIT_INVOICES,
  Permission.VIEW_FINANCIAL_REPORTS,
  Permission.VIEW_ANALYTICS,
  Permission.EXPORT_DATA,
  Permission.USE_ADVANCED_REPORTING,
  Permission.INTEGRATION_XRAY,
];

const TIER_3_FEATURES: Permission[] = [
  // All features
  ...Object.values(Permission),
];

export const TIER_FEATURES: Record<SubscriptionTier, Permission[]> = {
  [SubscriptionTier.FREE]: FREE_FEATURES,
  [SubscriptionTier.TIER_1]: TIER_1_FEATURES,
  [SubscriptionTier.TIER_2]: TIER_2_FEATURES,
  [SubscriptionTier.TIER_3]: TIER_3_FEATURES,
};

/**
 * Route access configuration
 * Maps routes to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/admin/default": [Permission.VIEW_APPOINTMENTS],
  "/admin/agenda": [Permission.VIEW_APPOINTMENTS],
  "/admin/data-tables": [Permission.VIEW_PATIENTS],
  "/admin/profile": [], // Everyone can view their own profile
  
  // Admin-only routes
  "/admin/settings": [Permission.MANAGE_CLINIC_SETTINGS],
  "/admin/users": [Permission.MANAGE_USERS],
  "/admin/analytics": [Permission.VIEW_ANALYTICS],
  
  // Tier 2+ routes (example)
  "/admin/billing": [Permission.VIEW_BILLING],
  "/admin/reports": [Permission.USE_ADVANCED_REPORTING],
  
  // Tier 3 routes (example)
  "/admin/ai-diagnosis": [Permission.USE_AI_DIAGNOSIS],
};

/**
 * Feature flags for UI elements
 * Use these to show/hide features based on tier
 */
export const FEATURE_FLAGS = {
  SHOW_BILLING_TAB: [Permission.VIEW_BILLING],
  SHOW_ANALYTICS: [Permission.VIEW_ANALYTICS],
  SHOW_AI_FEATURES: [Permission.USE_AI_DIAGNOSIS],
  SHOW_DELETE_BUTTONS: [Permission.DELETE_PATIENTS, Permission.DELETE_APPOINTMENTS],
  SHOW_USER_MANAGEMENT: [Permission.MANAGE_USERS],
} as const;
