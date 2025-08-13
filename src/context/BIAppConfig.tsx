import { BIAppConfig } from "@/types/BITypes";
import { createContext, useContext } from "react";

const BIAppConfigContext = createContext<BIAppConfig | undefined>(undefined);

export const BIAppConfigProvider = ({
  children,
  url,
  token,
}: BIAppConfig & { children: React.ReactNode }) => {
  return (
    <BIAppConfigContext.Provider value={{ url, token }}>
      {children}
    </BIAppConfigContext.Provider>
  );
};

export const useBIAppConfig = () => {
  const ctx = useContext(BIAppConfigContext);
  if (!ctx)
    throw new Error("useBIAppConfig must be used within BIAppConfigProvider");
  return ctx;
};
