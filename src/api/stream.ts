import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Application } from "../context/AppContext";
import { ChatMessage } from "../context/ChatContext";
import { Hotel } from "../context/HotelContext";

export async function stream(
  message: ChatMessage,
  url: string,
  application: Application,
  jwt: string,
  selectedHotels: Hotel[],
  threadId: string | null,
  organizationId: number,
  database: string | null,
  dispatch: React.Dispatch<any>,
  signal: AbortSignal
) {
  dispatch({ type: "ADD_MESSAGE", payload: message });
  dispatch({ type: "CLEAR_ERROR" });
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({
    type: "APPEND_TO_LAST_ASSISTANT",
    payload: {
      text: "",
      role: "assistant",
      timestamp: new Date(),
    },
  });
  try {
    await fetchEventSource(`${url}/api/chatbot/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        message,
        selectedHotels,
        organizationId,
        threadId,
        application,
        database,
      }),
      signal,
      onmessage: (event) => {
        switch (event.event) {
          case "message":
            dispatch({
              type: "APPEND_TO_LAST_ASSISTANT",
              payload: {
                text: event.data,
                role: "assistant",
                timestamp: new Date(),
              },
            });
            break;
          case "route":
            dispatch({
              type: "SET_ROUTE",
              payload: JSON.parse(event.data),
            });
            break;
          case "done":
            const data = JSON.parse(event.data);
            dispatch({ type: "SET_THREAD_ID", payload: data.threadId });
            dispatch({ type: "SET_DATABASE", payload: data.database });
            dispatch({ type: "SET_LOADING", payload: false });
            break;
          case "error":
            dispatch({
              type: "SET_ERROR",
              payload: event.data,
            });
            dispatch({ type: "SET_LOADING", payload: false });
            break;
        }
      },
      onerror(err) {
        throw err;
      },
    });
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: error });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "CLEAR_ROUTE" });
  }
}
