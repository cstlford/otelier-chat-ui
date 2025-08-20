import { createContext, useContext, useReducer, ReactNode } from "react";
import type { AppError } from "../lib/errors";

type ErrorState = {
  current?: AppError;
  queue: AppError[];
};

type ErrorAction =
  | { type: "PUSH_ERROR"; payload: AppError }
  | { type: "POP_ERROR" }
  | { type: "CLEAR_ERRORS" };

const ErrorContext = createContext<{
  state: ErrorState;
  dispatch: React.Dispatch<ErrorAction>;
} | null>(null);

const reducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case "PUSH_ERROR": {
      if (!state.current) {
        return { current: action.payload, queue: state.queue };
      }
      return {
        current: state.current,
        queue: [...state.queue, action.payload],
      };
    }
    case "POP_ERROR": {
      if (state.queue.length === 0) return { current: undefined, queue: [] };
      const [next, ...rest] = state.queue;
      return { current: next, queue: rest };
    }
    case "CLEAR_ERRORS":
      return { current: undefined, queue: [] };
    default:
      return state;
  }
};

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    current: undefined,
    queue: [],
  });
  return (
    <ErrorContext.Provider value={{ state, dispatch }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used within ErrorProvider");
  return ctx;
}
