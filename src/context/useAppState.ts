import { useChat } from "./ChatContext";
import { useHotels } from "./HotelContext";
import { useApp } from "./AppContext";

export const useAppState = () => {
  const chat = useChat();
  const hotels = useHotels();
  const app = useApp();

  return {
    // Chat state
    messages: chat.state.messages,
    threadId: chat.state.threadId,
    route: chat.state.route,
    loading: chat.state.loading,
    error: chat.state.error,

    // Hotel state
    hotels: hotels.state.hotels,
    selectedHotels: hotels.state.selectedHotels,

    // App config
    url: app.config.url,
    application: app.config.application,
    organizationId: app.config.organizationId,
    jwt: app.config.jwt,

    // Actions
    chatDispatch: chat.dispatch,
    hotelDispatch: hotels.dispatch,
  };
};
