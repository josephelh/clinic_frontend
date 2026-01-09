import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { useAuthStore } from "src/store/useAuthStore";
import { TenantProvider } from "src/contexts/TenantContext";
import { SubscriptionProvider } from "src/contexts/SubscriptionContext";
import ProtectedRoute from "src/components/auth/ProtectedRoute";
import PageLoader from "src/components/loader/PageLoader";
import { AnimatePresence } from "framer-motion";
import RouteProgress from "src/components/loader/RouteProgress";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjGyl/VkR+XU9Ff1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3hTd0VnW3xbcHBUQ2hdVU91XQ=="
);

const App = () => {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  return (
    <TenantProvider>
      <SubscriptionProvider>
        <AnimatePresence mode="wait">
          {!hasHydrated ? (
            <PageLoader key="global-loader" />
          ) : (
            <>
              <RouteProgress />
              <Routes key="main-app">
                {/* Public Routes */}
                <Route path="auth/*" element={<AuthLayout />} />

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="admin/*" element={<AdminLayout />} />
                </Route>

                {/* Root Redirect */}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/auth/sign-in" replace />}
                />
              </Routes>
            </>
          )}
        </AnimatePresence>
      </SubscriptionProvider>
    </TenantProvider>
  );
};

export default App;