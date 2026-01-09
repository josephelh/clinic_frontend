# Role-Based Access Control (RBAC) - Implementation Guide

## 🎯 Overview

Multi-tier, role-based permission system designed for SaaS scalability:

- **Tier 1 (MVP)**: Basic clinic management
- **Tier 2**: Advanced features (billing, analytics, reports)
- **Tier 3**: Premium features (AI, multi-clinic)

## 🏗️ System Architecture

### Permission Flow
```
User Login
    ↓
Role (DOCTOR/ASSISTANT/ADMIN) + Subscription Tier (1/2/3)
    ↓
Calculate Permissions (Role ∩ Tier Features)
    ↓
Guard Routes & UI Elements
```

### Key Files Created

1. **[types/permissions.ts](src/types/permissions.ts)** - Permission definitions & tier features
2. **[hooks/usePermissions.ts](src/hooks/usePermissions.ts)** - Permission checking hook
3. **[components/auth/RoleGuard.tsx](src/components/auth/RoleGuard.tsx)** - Route protection
4. **[contexts/SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx)** - Tier management

---

## 📚 Usage Examples

### 1. Protect Routes

```tsx
import { RoleGuard } from "src/components/auth/RoleGuard";
import { Permission } from "src/types/permissions";

// In your route configuration:
<Route 
  element={<RoleGuard requiredPermissions={[Permission.MANAGE_USERS]} />}
>
  <Route path="users" element={<UserManagement />} />
</Route>

// Admin-only route shorthand:
<Route element={<AdminOnlyGuard />}>
  <Route path="settings" element={<Settings />} />
</Route>
```

### 2. Show/Hide UI Elements

```tsx
import { usePermissions } from "src/hooks/usePermissions";
import { Permission } from "src/types/permissions";

function PatientCard({ patient }) {
  const { hasPermission, isRole } = usePermissions();

  return (
    <div>
      <h3>{patient.name}</h3>
      
      {/* Only doctors and admins see delete button */}
      {hasPermission(Permission.DELETE_PATIENTS) && (
        <button onClick={handleDelete}>Delete</button>
      )}

      {/* Only admins see export button */}
      {hasPermission(Permission.EXPORT_DATA) && (
        <button onClick={handleExport}>Export</button>
      )}

      {/* Role-specific UI */}
      {isRole("ASSISTANT") && (
        <p>Note: Contact doctor to delete patients</p>
      )}
    </div>
  );
}
```

### 3. Protect Component Sections

```tsx
import { RoleGuard } from "src/components/auth/RoleGuard";
import { Permission } from "src/types/permissions";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Everyone sees appointments */}
      <AppointmentList />

      {/* Only if user has billing permission (Tier 2+) */}
      <RoleGuard 
        requiredPermissions={[Permission.VIEW_BILLING]}
        fallback={<UpgradeTier2Banner />}
      >
        <BillingWidget />
      </RoleGuard>

      {/* Admins only */}
      <RoleGuard requiredPermissions={[Permission.VIEW_ANALYTICS]}>
        <AnalyticsDashboard />
      </RoleGuard>
    </div>
  );
}
```

### 4. Filter Navigation Based on Permissions

```tsx
import { usePermissions } from "src/hooks/usePermissions";
import { routes } from "src/routes";

function Sidebar() {
  const { hasAnyPermission } = usePermissions();

  const visibleRoutes = routes.filter(route => {
    // If no permissions defined, show to everyone
    if (!route.requiredPermissions) return true;
    
    // Check if user has any of the required permissions
    return hasAnyPermission(route.requiredPermissions);
  });

  return (
    <nav>
      {visibleRoutes.map(route => (
        <NavLink to={route.path}>{route.name}</NavLink>
      ))}
    </nav>
  );
}
```

### 5. Conditional Actions

```tsx
import { usePermissions } from "src/hooks/usePermissions";
import { Permission } from "src/types/permissions";

function AppointmentForm() {
  const { hasPermission } = usePermissions();

  const handleSubmit = (data) => {
    if (!hasPermission(Permission.CREATE_APPOINTMENTS)) {
      toast.error("You don't have permission to create appointments");
      return;
    }

    // Proceed with creation
    createAppointment(data);
  };

  const canDelete = hasPermission(Permission.DELETE_APPOINTMENTS);
  const canEdit = hasPermission(Permission.EDIT_APPOINTMENTS);

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      
      <button type="submit" disabled={!canEdit}>
        Save
      </button>

      {canDelete && (
        <button onClick={handleDelete} className="danger">
          Delete
        </button>
      )}
    </form>
  );
}
```

---

## 🔧 Adding New Features (Tier 2/3)

### Step 1: Define Permission in [types/permissions.ts](src/types/permissions.ts)

```typescript
export enum Permission {
  // ... existing permissions
  
  // New Tier 2 feature
  USE_XRAY_INTEGRATION = "USE_XRAY_INTEGRATION",
}
```

### Step 2: Add to Role Permissions

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  DOCTOR: [
    // ... existing permissions
    Permission.USE_XRAY_INTEGRATION, // Doctors can use it
  ],
  ASSISTANT: [
    // ... assistants cannot use it
  ],
  ADMIN: [
    ...Object.values(Permission), // Admins get everything
  ],
};
```

### Step 3: Add to Tier Features

```typescript
export const TIER_FEATURES: Record<SubscriptionTier, Permission[]> = {
  [SubscriptionTier.TIER_1]: [
    // ... MVP features only
  ],
  
  [SubscriptionTier.TIER_2]: [
    ...TIER_FEATURES[SubscriptionTier.TIER_1],
    Permission.USE_XRAY_INTEGRATION, // Available in Tier 2+
  ],
  
  [SubscriptionTier.TIER_3]: [
    ...Object.values(Permission),
  ],
};
```

### Step 4: Use in Component

```tsx
import { usePermissions } from "src/hooks/usePermissions";
import { Permission } from "src/types/permissions";

function AppointmentView() {
  const { hasPermission, tier } = usePermissions();

  return (
    <div>
      {hasPermission(Permission.USE_XRAY_INTEGRATION) ? (
        <XRayViewer />
      ) : (
        <UpgradePrompt 
          feature="X-Ray Integration"
          requiredTier="TIER_2"
          currentTier={tier}
        />
      )}
    </div>
  );
}
```

---

## 🎭 Role Definitions

### ASSISTANT
- View patients/appointments
- Create/edit patients
- Create/edit appointments
- **Cannot**: Delete, access billing, manage users

### DOCTOR
- All assistant permissions
- Delete appointments
- View/create billing
- **Cannot**: Manage users, view analytics

### ADMIN
- Full access to everything
- Manage users
- Clinic settings
- Analytics dashboard

---

## 📊 Tier Features Matrix

| Feature | Free | Tier 1 | Tier 2 | Tier 3 |
|---------|------|--------|--------|--------|
| Patient Management | ❌ | ✅ | ✅ | ✅ |
| Appointments | View Only | ✅ | ✅ | ✅ |
| Billing | ❌ | ❌ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| Advanced Reports | ❌ | ❌ | ✅ | ✅ |
| X-Ray Integration | ❌ | ❌ | ✅ | ✅ |
| AI Diagnosis | ❌ | ❌ | ❌ | ✅ |
| Multi-Clinic | ❌ | ❌ | ❌ | ✅ |

---

## 🧪 Testing RBAC

### Test as Different Roles

```typescript
// In your test setup or dev tools:
import { useAuthStore } from "src/store/useAuthStore";

// Login as assistant
useAuthStore.getState().setAuth({
  username: "assistant_test",
  role: "ASSISTANT",
  clinic_id: 1,
  access: "token",
  refresh: "token",
});

// Login as doctor
useAuthStore.getState().setAuth({
  username: "doctor_test",
  role: "DOCTOR",
  clinic_id: 1,
  access: "token",
  refresh: "token",
});
```

### Test Different Tiers

Currently mocked in [SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx):
- Clinic ID 1 → Tier 1
- Clinic ID 2 → Tier 2
- Clinic ID 3 → Tier 3

---

## 🚀 Production Integration

### Backend API Integration

Update [contexts/SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx):

```typescript
useEffect(() => {
  if (user?.clinic_id) {
    // Replace mock with actual API call
    fetch(`/api/clinics/${user.clinic_id}/subscription/`)
      .then(res => res.json())
      .then(data => setTier(data.tier))
      .catch(err => {
        console.error("Failed to fetch subscription:", err);
        setTier(SubscriptionTier.TIER_1); // Fallback
      })
      .finally(() => setIsLoading(false));
  }
}, [user?.clinic_id]);
```

### Django Backend Model (Example)

```python
# clinics/models.py
class Clinic(TenantMixin):
    subscription_tier = models.CharField(
        max_length=10,
        choices=[
            ('TIER_1', 'Tier 1 - MVP'),
            ('TIER_2', 'Tier 2 - Advanced'),
            ('TIER_3', 'Tier 3 - Premium'),
        ],
        default='TIER_1'
    )
    subscription_expires = models.DateField(null=True, blank=True)
```

---

## 🎨 Upgrade Prompts

Create upgrade prompts for tier-locked features:

```tsx
function UpgradePrompt({ feature, requiredTier, currentTier }) {
  return (
    <div className="upgrade-banner">
      <h3>🔒 {feature} is a {requiredTier} feature</h3>
      <p>Upgrade from {currentTier} to unlock this feature</p>
      <button onClick={handleUpgrade}>Upgrade Now</button>
    </div>
  );
}
```

---

## 🔐 Security Notes

1. **Frontend checks are UX only** - Always enforce permissions on backend
2. **Token validation** - Backend must validate role in JWT
3. **Tier verification** - Backend checks subscription status on every request
4. **Audit logs** - Track permission changes and access attempts

---

## 📝 Next Steps for Your Team

1. **Define Tier 2/3 features** - Decide what goes in each tier
2. **Backend API** - Create subscription endpoint
3. **Payment integration** - Stripe/Paddle for tier upgrades
4. **Admin panel** - Manage clinic subscriptions
5. **Feature usage tracking** - Analytics on feature adoption per tier

---

## 🐛 Debugging

Check permissions in browser console:

```typescript
import { usePermissions } from "src/hooks/usePermissions";

function DebugPermissions() {
  const { permissions, role, tier } = usePermissions();
  
  console.log("Current Role:", role);
  console.log("Current Tier:", tier);
  console.log("Permissions:", permissions);
  
  return null;
}
```

---

## 📚 References

- Permission definitions: [types/permissions.ts](src/types/permissions.ts)
- Hook usage: [hooks/usePermissions.ts](src/hooks/usePermissions.ts)
- Route guards: [components/auth/RoleGuard.tsx](src/components/auth/RoleGuard.tsx)
- Tier context: [contexts/SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx)
