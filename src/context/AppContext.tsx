import { createContext, useContext, ReactNode } from "react";

export type Application = {
  name: string;
  description: string;
};

export type AppConfig = {
  url: string;
  application: Application;
  organizationId: number;
  jwt: string;
};

interface AppContextType {
  config: AppConfig;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({
  children,
  url,
  application,
  organizationId,
  jwt,
}: {
  children: ReactNode;
  url: string;
  application: Application;
  organizationId: number;
  jwt: string;
}) => {
  const config: AppConfig = {
    url,
    application,
    organizationId,
    jwt,
  };

  return (
    <AppContext.Provider value={{ config }}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
};
