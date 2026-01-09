import React from "react";
import { useTenant } from "src/contexts/TenantContext";
import { useAuthStore } from "src/store/useAuthStore";

/**
 * Displays current clinic/tenant information in the navbar
 */
const TenantBadge: React.FC = () => {
  const { clinicSubdomain, isPublicSchema } = useTenant();
  const user = useAuthStore((state) => state.user);

  if (isPublicSchema) {
    return (
      
        <span >
          Schéma Public
        </span>
     
    );
  }

  return (
   
        <span >
          {clinicSubdomain}
        </span>
    
  );
};

export default TenantBadge;
