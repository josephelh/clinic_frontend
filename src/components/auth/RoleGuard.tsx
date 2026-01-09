import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "src/hooks/usePermissions";
import { Permission } from "src/types/permissions";

interface RoleGuardProps {
  /**
   * Required permissions - user needs at least ONE of these
   */
  requiredPermissions?: Permission[];

  /**
   * Require ALL permissions (instead of any)
   */
  requireAll?: boolean;

  /**
   * Redirect path if access denied (default: /admin/default)
   */
  redirectTo?: string;

  /**
   * Custom fallback component
   */
  fallback?: React.ReactNode;

  /**
   * Children to render if access granted
   */
  children?: React.ReactNode;
}

/**
 * Route guard component for role and tier-based access control
 * 
 * Usage in routes:
 * 
 * // Protect single route
 * <Route element={<RoleGuard requiredPermissions={[Permission.MANAGE_USERS]} />}>
 *   <Route path="users" element={<UserManagement />} />
 * </Route>
 * 
 * // Protect inline
 * <RoleGuard requiredPermissions={[Permission.DELETE_PATIENTS]}>
 *   <button>Delete Patient</button>
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredPermissions = [],
  requireAll = false,
  redirectTo = "/admin/default",
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions } = usePermissions();

  // If no permissions required, allow access
  if (requiredPermissions.length === 0) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check permissions
  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : requiredPermissions.some((perm) => hasPermission(perm));

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Shorthand guards for common scenarios
 */
export const AdminOnlyGuard: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { isRole } = usePermissions();

  if (!isRole("ADMIN")) {
    return <Navigate to="/admin/default" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const DoctorOrAdminGuard: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { isRole } = usePermissions();

  if (!isRole("DOCTOR") && !isRole("ADMIN")) {
    return <Navigate to="/admin/default" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
