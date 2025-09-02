import { SendHorizonal, CircleStopIcon } from "lucide-react";
import HotelSelector from "../HotelSelector";
import styles from "./ChatComposer.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";
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
    database,
    chatDispatch,
    loading,
  } = useAppState();

  const canSend = text.trim().length > 0;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message: ChatMessage = {
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    if (!loading && canSend) {
      controllerRef.current = new AbortController();
      stream(
        message,
        url,
        application,
        jwt,
        selectedHotels,
        threadId,
        organizationId,
        database,
        chatDispatch,
        controllerRef.current.signal
      );
      setText("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      inputRef.current?.focus();
    }
  }

  function handleAbort() {
    if (controllerRef.current) {
      controllerRef.current.abort();
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
