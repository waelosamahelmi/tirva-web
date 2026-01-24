import { createContext, useContext, useState, useEffect } from "react";
import { type RestaurantConfig, tirvan_kahvila_CONFIG } from "@/config/restaurant-config";
import { useRestaurantConfig, convertRestaurantConfigToDatabaseConfig } from "@/hooks/use-restaurant-config";

interface RestaurantContextType {
  config: RestaurantConfig;
  updateConfig: (updates: RestaurantConfig) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { config: dbConfig, loading, error, updateConfig: updateDbConfig } = useRestaurantConfig();

  // Always use a valid config - fallback to hardcoded if database config not available
  const config = dbConfig || tirvan_kahvila_CONFIG;

  // Wrapper function to convert RestaurantConfig to DatabaseRestaurantConfig before saving
  const updateConfig = async (updates: RestaurantConfig) => {
    const dbUpdates = convertRestaurantConfigToDatabaseConfig(updates);
    await updateDbConfig(dbUpdates);
  };

  // Always render children immediately with fallback config
  // This prevents any loading state from blocking the UI
  return (
    <RestaurantContext.Provider value={{
      config,
      updateConfig,
      loading,
      error
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}