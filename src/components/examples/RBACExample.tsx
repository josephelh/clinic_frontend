import { usePermissions } from "src/hooks/usePermissions";
import { Permission } from "src/types/permissions";
import { RoleGuard } from "src/components/auth/RoleGuard";

/**
 * Example component showing RBAC implementation
 * 
 * This demonstrates:
 * 1. Conditional rendering based on permissions
 * 2. Role-specific UI
 * 3. Tier-locked features
 * 4. Using RoleGuard for sections
 */
export default function ExampleRBACComponent() {
  const { hasPermission, isRole, role, tier } = usePermissions();

  const handleDelete = () => {
    if (!hasPermission(Permission.DELETE_PATIENTS)) {
      alert("You don't have permission to delete patients");
      return;
    }
    // Proceed with deletion
    console.log("Deleting patient...");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">RBAC Example</h1>

      {/* Display current user info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p><strong>Your Role:</strong> {role}</p>
        <p><strong>Subscription Tier:</strong> {tier}</p>
      </div>

      {/* === EXAMPLE 1: Simple Permission Check === */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Patient Actions</h2>
        
        <div className="space-x-2">
          {/* Everyone can view */}
          {hasPermission(Permission.VIEW_PATIENTS) && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              View Patients
            </button>
          )}

          {/* Only certain roles can create */}
          {hasPermission(Permission.CREATE_PATIENTS) && (
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Add Patient
            </button>
          )}

          {/* Only doctors/admins can delete */}
          {hasPermission(Permission.DELETE_PATIENTS) ? (
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete Patient
            </button>
          ) : (
            <button 
              disabled 
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
              title="You don't have permission to delete"
            >
              Delete Patient 🔒
            </button>
          )}
        </div>
      </section>

      {/* === EXAMPLE 2: Role-Specific UI === */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Role-Specific Messages</h2>
        
        {isRole("ASSISTANT") && (
          <div className="bg-yellow-50 p-3 rounded">
            <p>👋 <strong>Assistant Mode:</strong> You can manage patients but need a doctor for deletions.</p>
          </div>
        )}

        {isRole("DOCTOR") && (
          <div className="bg-green-50 p-3 rounded">
            <p>👨‍⚕️ <strong>Doctor Mode:</strong> You have full patient management access.</p>
          </div>
        )}

        {isRole("ADMIN") && (
          <div className="bg-purple-50 p-3 rounded">
            <p>⚡ <strong>Admin Mode:</strong> You have complete system access.</p>
          </div>
        )}
      </section>

      {/* === EXAMPLE 3: Tier-Locked Features === */}
      <section className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Advanced Features</h2>

        {/* Billing - Tier 2+ */}
        <RoleGuard 
          requiredPermissions={[Permission.VIEW_BILLING]}
          fallback={
            <div className="bg-orange-50 p-4 rounded border-2 border-orange-200">
              <h3 className="font-semibold">🔒 Billing Module</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upgrade to Tier 2 to access billing and invoicing
              </p>
              <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded text-sm">
                Upgrade to Tier 2
              </button>
            </div>
          }
        >
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold">✅ Billing Module</h3>
            <p className="text-sm text-gray-600">Access invoices, payments, and financial reports</p>
          </div>
        </RoleGuard>

        {/* Analytics - Admin + Tier 2+ */}
        <RoleGuard 
          requiredPermissions={[Permission.VIEW_ANALYTICS]}
          fallback={
            <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 mt-3">
              <h3 className="font-semibold">🔒 Analytics Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">
                {!isRole("ADMIN") 
                  ? "Admin access required"
                  : `Upgrade to Tier 2+ for analytics`}
              </p>
            </div>
          }
        >
          <div className="bg-blue-50 p-4 rounded mt-3">
            <h3 className="font-semibold">✅ Analytics Dashboard</h3>
            <p className="text-sm text-gray-600">View clinic performance metrics</p>
          </div>
        </RoleGuard>

        {/* AI Features - Tier 3 only */}
        <RoleGuard 
          requiredPermissions={[Permission.USE_AI_DIAGNOSIS]}
          fallback={
            <div className="bg-purple-50 p-4 rounded border-2 border-purple-200 mt-3">
              <h3 className="font-semibold">🔒 AI Diagnosis Assistant</h3>
              <p className="text-sm text-gray-600 mt-1">
                Premium Tier 3 feature - Coming soon!
              </p>
              <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded text-sm">
                Upgrade to Tier 3
              </button>
            </div>
          }
        >
          <div className="bg-purple-50 p-4 rounded mt-3">
            <h3 className="font-semibold">✅ AI Diagnosis Assistant</h3>
            <p className="text-sm text-gray-600">AI-powered treatment recommendations</p>
          </div>
        </RoleGuard>
      </section>

      {/* === EXAMPLE 4: Admin-Only Section === */}
      <RoleGuard requiredPermissions={[Permission.MANAGE_USERS]}>
        <section className="border-2 border-red-500 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3 text-red-600">Admin Controls</h2>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Manage Users
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Clinic Settings
            </button>
          </div>
        </section>
      </RoleGuard>
    </div>
  );
}
