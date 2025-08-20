import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ChatToggle from "./components/ChatToggle";
import { RootProvider } from "./context/RootProvider";

const queryClient = new QueryClient();

export default function Otelia({
  url,
  application,
  organizationId,
  jwt,
}: {
  url: string;
  application: "intellisight" | "tpx";
  organizationId: string;
  jwt: string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <RootProvider
        url={url}
        application={application}
        organizationId={organizationId}
        jwt={jwt}
      >
        <ChatToggle />
      </RootProvider>
    </QueryClientProvider>
  );
}
