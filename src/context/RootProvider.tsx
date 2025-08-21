import { ReactNode } from "react";
import { AppProvider } from "./AppContext";
import { ChatProvider } from "./ChatContext";
import { HotelProvider } from "./HotelContext";
import { ErrorProvider } from "./ErrorContext";

export type Application = {
  name: string;
  description: string;
};

interface RootProviderProps {
  children: ReactNode;
  url: string;
  application: Application;
  organizationId: string;
  jwt: string;
}

export const RootProvider = ({
  children,
  url,
  application,
  organizationId,
  jwt,
}: RootProviderProps) => {
  return (
    <ErrorProvider>
      <AppProvider
        url={url}
        application={application}
        organizationId={organizationId}
        jwt={jwt}
      >
        <HotelProvider>
          <ChatProvider>{children}</ChatProvider>
        </HotelProvider>
      </AppProvider>
    </ErrorProvider>
  );
};
