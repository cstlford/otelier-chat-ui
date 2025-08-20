import { SendHorizonal, CircleStopIcon } from "lucide-react";
import HotelSelector from "../HotelSelector";
import styles from "./ChatComposer.module.css";
import { FormEvent, useRef, useState, useCallback } from "react";
import Button from "../Button";
import { useAppState } from "../../context/useAppState";
import { ChatMessage } from "../../context/ChatContext";
import { stream } from "../../api/stream";

export default function ChatComposer() {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const {
    selectedHotels,
    organizationId,
    threadId,
    url,
    application,
    jwt,
    chatDispatch,
    loading,
  } = useAppState();

  const canSend = text.trim().length > 0;

  const startStream = useCallback(
    async (message: ChatMessage) => {
      chatDispatch({ type: "CLEAR_ERROR" });
      chatDispatch({ type: "SET_LOADING", payload: true });
      const controller = new AbortController();
      controllerRef.current = controller;

      chatDispatch({
        type: "ADD_MESSAGE",
        payload: { role: "assistant", text: "", timestamp: new Date() },
      });

      const handleEvent = (eventType: string, data: any) => {
        switch (eventType) {
          case "open":
            break;
          case "message":
            chatDispatch({
              type: "APPEND_TO_LAST_ASSISTANT",
              payload: {
                text: data,
                role: "assistant",
                timestamp: new Date(),
              },
            });
            break;
          case "tool-calls":
            chatDispatch({ type: "SET_TOOL_CALLS", payload: JSON.parse(data) });
            // Don't set loading to false here - the stream might continue with more text
            break;
          case "done":
            chatDispatch({ type: "SET_THREAD_ID", payload: data });
            chatDispatch({ type: "SET_LOADING", payload: false });
            break;
          case "error":
            chatDispatch({
              type: "SET_ERROR",
              payload:
                typeof data === "object" && data?.message
                  ? data.message
                  : "Stream error",
            });
            chatDispatch({ type: "SET_LOADING", payload: false });
            break;
          case "abort":
            break;
          case "close":
            chatDispatch({ type: "SET_LOADING", payload: false });
            break;
          case "heartbeat":
          case "retry":
          case "idle":
          default:
            break;
        }
      };

      try {
        await stream(
          url,
          message,
          selectedHotels,
          organizationId!,
          application,
          threadId!,
          jwt,
          controller.signal,
          handleEvent
        );
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          chatDispatch({
            type: "SET_ERROR",
            payload: `Failed to send message: ${
              err instanceof Error ? err.message : "Unknown error"
            }`,
          });
        }
      } finally {
        controllerRef.current = null;
        chatDispatch({ type: "CLEAR_TOOL_CALLS" });
        chatDispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [
      application,
      chatDispatch,
      organizationId,
      selectedHotels,
      threadId,
      url,
      jwt,
    ]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: ChatMessage = {
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    if (!loading && canSend) {
      chatDispatch({
        type: "ADD_MESSAGE",
        payload,
      });
      startStream(payload);
      setText("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      inputRef.current?.focus();
    }
  }

  function handleAbort() {
    const controller = controllerRef.current;
    if (controller) {
      controller.abort();
      controllerRef.current = null;
    }
  }

  // Shift + Enter = newline & Enter = Send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        if (canSend && !loading) {
          handleSubmit(e);
        }
      }
    }
  };

  return (
    <div className={styles.chatInputArea}>
      <form
        className={styles.chatInput}
        onSubmit={handleSubmit}
        data-streaming={loading ? "true" : "false"}
        id="chat-form"
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          autoFocus={true}
          className={styles.textarea}
          disabled={loading}
          rows={1}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
        />
        <div className={styles.actions}>
          <HotelSelector />
          <Button
            type={loading ? "button" : "submit"}
            onClick={loading ? handleAbort : undefined}
            disabled={!loading && !canSend}
            variant="purplePink"
            size="sm"
          >
            {loading ? (
              <CircleStopIcon size={16} />
            ) : (
              <SendHorizonal size={16} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
