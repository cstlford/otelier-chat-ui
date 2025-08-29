import { createContext, useContext, useReducer, ReactNode } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  checkpointId?: string;
};

export type ToolCall = {
  name: string;
  args: Object;
  id: string;
  type: string;
};

export type Route = {
  destination: string;
  message: string;
};

export type ChatState = {
  messages: ChatMessage[];
  threadId: string | null;
  route: Route | null;
  loading: boolean;
  error?: string;
};

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "APPEND_TO_LAST_ASSISTANT"; payload: ChatMessage }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_ERROR"; payload: string | undefined }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_THREAD_ID"; payload: string }
  | { type: "CLEAR_THREAD_ID" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ROUTE"; payload: Route }
  | { type: "CLEAR_ROUTE" };

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "APPEND_TO_LAST_ASSISTANT":
      const updatedMessages = [...state.messages];
      const lastIndex = updatedMessages.length - 1;
      if (lastIndex >= 0 && updatedMessages[lastIndex]?.role === "assistant") {
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          text: (updatedMessages[lastIndex].text || "") + action.payload.text,
          timestamp:
            action.payload.timestamp || updatedMessages[lastIndex].timestamp,
        };
      } else {
        // Fallback: Add new assistant message if none exists
        updatedMessages.push({
          role: "assistant",
          text: action.payload.text,
          timestamp: action.payload.timestamp || new Date(),
        });
      }
      return { ...state, messages: updatedMessages };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: undefined };
    case "SET_THREAD_ID":
      return { ...state, threadId: action.payload };
    case "CLEAR_THREAD_ID":
      return { ...state, threadId: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ROUTE":
      return { ...state, route: action.payload };
    case "CLEAR_ROUTE":
      return { ...state, route: null };
    default:
      throw new Error(`Unhandled chat action type: ${(action as any).type}`);
  }
};

export const ChatProvider = ({
  children,
  initialMessages = [],
  initialThreadId = null,
  initialToolCalls = [],
}: {
  children: ReactNode;
  initialMessages?: ChatMessage[];
  initialThreadId?: string | null;
  initialToolCalls?: ToolCall[];
}) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
    threadId: initialThreadId,
    route: null,
    loading: false,
  });

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
};
