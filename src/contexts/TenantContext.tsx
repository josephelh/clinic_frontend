import React, { createContext, useContext, useEffect, useState } from "react";

interface TenantContextType {
  clinicSubdomain: string | null;
  isPublicSchema: boolean;
  clinicId: number | null;
  setClinicInfo: (subdomain: string, clinicId: number) => void;
  clearClinicInfo: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * Extracts subdomain from hostname
 * Examples:
 * - clinic1.localhost -> "clinic1"
 * - atlas.localhost -> "atlas"
 * - localhost -> null (public schema)
 * - clinic1.example.com -> "clinic1"
 */
const extractSubdomain = (hostname: string): string | null => {
  // Remove port if present
  const cleanHost = hostname.split(":")[0];

  // For localhost, check if there's a subdomain
  if (cleanHost.includes("localhost")) {
    const parts = cleanHost.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0]; // Return subdomain like "clinic1" or "atlas"
    }
    return null; // Plain localhost = public schema
  }

  // For production domains (e.g., clinic1.example.com)
  const parts = cleanHost.split(".");
  if (parts.length > 2) {
    return parts[0]; // Return first part as subdomain
  }

  return null; // No subdomain = public schema
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clinicSubdomain, setClinicSubdomain] = useState<string | null>(null);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [isPublicSchema, setIsPublicSchema] = useState<boolean>(true);

  useEffect(() => {
    // Detect subdomain on mount
    const subdomain = extractSubdomain(window.location.hostname);
    setClinicSubdomain(subdomain);
    setIsPublicSchema(subdomain === null);

    // Try to restore clinic info from localStorage
    const storedClinicId = localStorage.getItem("clinic_id");
    if (storedClinicId) {
      setClinicId(parseInt(storedClinicId, 10));
    }

    console.log("🏥 Tenant Detection:", {
      hostname: window.location.hostname,
      subdomain: subdomain || "public",
      isPublic: subdomain === null,
    });
  }, []);

  const setClinicInfo = (subdomain: string, id: number) => {
    setClinicSubdomain(subdomain);
    setClinicId(id);
    setIsPublicSchema(false);
    localStorage.setItem("clinic_id", id.toString());
    localStorage.setItem("clinic_subdomain", subdomain);
  };

  const clearClinicInfo = () => {
    setClinicSubdomain(null);
    setClinicId(null);
    setIsPublicSchema(true);
    localStorage.removeItem("clinic_id");
    localStorage.removeItem("clinic_subdomain");
  };

  return (
    <TenantContext.Provider
      value={{
        clinicSubdomain,
        isPublicSchema,
        clinicId,
        setClinicInfo,
        clearClinicInfo,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
