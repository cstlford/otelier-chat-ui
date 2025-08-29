import styles from "./ChatInterface.module.css";
import bot from "../../assets/bot-hover.svg";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import Draggable from "react-draggable";
import ChatComposer from "../ChatComposer";
import Message from "../Message";
import CircleButton from "../Button";
import Tooltip from "../Tooltip";

import { useAppState } from "../../context/useAppState";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/hotels";
import newThread from "../../api/newThread";
import ChatError from "../ChatError";

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const nodeRef = useRef(null);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    loading,
    error,
    url,
    jwt,
    toolCalls,
    organizationId,
    chatDispatch,
    hotelDispatch,
  } = useAppState();

  const {
    data: hotelData,
    error: responseError,
    isLoading,
  } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(url, organizationId, jwt),
  });

  useEffect(() => {
    if (hotelData) {
      hotelDispatch({
        type: "SET_HOTELS",
        payload: hotelData.hotels,
      });
      hotelDispatch({ type: "CLEAR_SELECTED_HOTELS" });
    }
  }, [hotelData, hotelDispatch]);

  useEffect(() => {
    if (responseError) {
      alert("Failed to load user context. Please try again later.");
      onClose();
    }
  }, [responseError]);

  const { data: newThreadData, refetch } = useQuery({
    queryKey: ["newThread"],
    queryFn: () => newThread(url, jwt),
    enabled: false,
  });

  useEffect(() => {
    if (newThreadData) {
      chatDispatch({ type: "SET_THREAD_ID", payload: newThreadData.threadId });
      chatDispatch({ type: "CLEAR_MESSAGES" });
    }
  }, [newThreadData, chatDispatch]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (chatWindow && messages.length > 0) {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div ref={nodeRef} className={styles.chatInterface}>
        <div className={`${styles.chatHeader} drag-handle`}>
          <div className={styles.iconContainer}>
            <img src={bot} alt="" />
            <div
              className={`${styles.status} ${isLoading ? styles.loading : ""}`}
            ></div>
          </div>
          <h3>Othelia</h3>
          <Tooltip content="New chat">
            <CircleButton
              variant="semiTransparent"
              size="sm"
              onClick={() => refetch()}
            >
              <Plus size={20} className={styles.clear} />
            </CircleButton>
          </Tooltip>
        </div>
        {isLoading ? (
          <div className={styles.loadingText}>Loading...</div>
        ) : (
          <div className={styles.main}>
            <div className={styles.chatWindow} ref={chatWindowRef}>
              {messages.length > 0 ? (
                <>
                  {messages.map((msg, index) => (
                    <Message
                      message={msg}
                      key={
                        msg.checkpointId ??
                        `${msg.timestamp.toISOString()}-${index}`
                      }
                      isLastMessage={index === messages.length - 1}
                      loading={loading}
                      toolCalls={index === messages.length - 1 ? toolCalls : []}
                    />
                  ))}
                  {error && <ChatError error={error} />}
                </>
              ) : (
                <div className={styles.welcomeMessage}>
                  <p>How can I help you today?</p>
                </div>
              )}
            </div>
            <ChatComposer />
          </div>
        )}
      </div>
    </Draggable>
  );
}
