import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatToggle } from "./components/chat-assistant/ChatToggle";
import { BIAppConfigProvider } from "./context/BIAppConfig";
import { UserStateProvider } from "./context/UserState";
import { BIAppConfig } from "./types/BITypes";

export const BIApp = ({ url, token }: BIAppConfig) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BIAppConfigProvider token={token} url={url}>
        <UserStateProvider>
          <ChatToggle />
        </UserStateProvider>
      </BIAppConfigProvider>
    </QueryClientProvider>
  );
};
