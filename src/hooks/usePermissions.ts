import { useMemo } from "react";
import { useAuthStore } from "src/store/useAuthStore";
import { useSubscription } from "src/contexts/SubscriptionContext";
import {
  Permission,
  ROLE_PERMISSIONS,
  TIER_FEATURES,
} from "src/types/permissions";

/**
 * Hook to check user permissions based on role and subscription tier
 * 
 * Usage:
 * const { hasPermission, hasAnyPermission, role, tier } = usePermissions();
 * 
 * if (hasPermission(Permission.DELETE_PATIENTS)) {
 *   // Show delete button
 * }
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);
  const { tier: currentTier } = useSubscription();

  const userPermissions = useMemo(() => {
    if (!user) return [];

    // Get base permissions from role
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];

    // Filter by tier availability
    const tierPerms = TIER_FEATURES[currentTier] || [];

    // User has permission only if both role allows it AND tier includes it
    return rolePerms.filter((perm) => tierPerms.includes(perm));
  }, [user, currentTier]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((perm) => userPermissions.includes(perm));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((perm) => userPermissions.includes(perm));
  };

  const isRole = (role: "DOCTOR" | "ASSISTANT" | "ADMIN"): boolean => {
    return user?.role === role;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    role: user?.role,
    tier: currentTier,
    permissions: userPermissions,
  };
};
