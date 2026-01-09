import React, { createContext, useContext, useState, useEffect } from "react";
import { SubscriptionTier } from "src/types/permissions";
import { useAuthStore } from "src/store/useAuthStore";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

/**
 * Subscription/Tier Context Provider
 * 
 * Manages clinic subscription tier for feature gating.
 * In production, this would fetch from backend based on clinic_id.
 * 
 * TODO: Integrate with backend API to fetch actual subscription tier
 */
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);
  const [tier, setTier] = useState<SubscriptionTier>(SubscriptionTier.TIER_1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch subscription tier from backend when user logs in
    // For now, default to TIER_1 (MVP)
    
    if (user?.clinic_id) {
      setIsLoading(true);
      
      // Placeholder for API call:
      // fetchClinicSubscription(user.clinic_id)
      //   .then(data => setTier(data.tier))
      //   .finally(() => setIsLoading(false));

      // Mock: Set tier based on clinic_id for testing
      // Clinic 1 = Tier 1, Clinic 2 = Tier 2, etc.
      const mockTier = 
        user.clinic_id === 1 ? SubscriptionTier.TIER_1 :
        user.clinic_id === 2 ? SubscriptionTier.TIER_2 :
        user.clinic_id === 3 ? SubscriptionTier.TIER_3 :
        SubscriptionTier.TIER_1;

      setTimeout(() => {
        setTier(mockTier);
        setIsLoading(false);
      }, 100);

      console.log("📊 Subscription Tier:", mockTier, "for clinic", user.clinic_id);
    }
  }, [user?.clinic_id]);

  return (
    <SubscriptionContext.Provider value={{ tier, setTier, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
