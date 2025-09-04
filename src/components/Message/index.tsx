import Markdown from "../Markdown";

import { Route, useChat } from "../../context/ChatContext";
import RouteTool from "../RouteTool";
import { ChatMessage } from "../../context/ChatContext";
import { formatAsciiTable } from "../../lib/formatting";
import styles from "./Message.module.css";

type Props = {
  message: ChatMessage;
  route: Route | null;
  isLastMessage?: boolean;
  loading?: boolean;
};

export default function Message({
  message,
  route: propRoute,
  isLastMessage = false,
  loading: propLoading = false,
}: Props) {
  const {
    state: { messages, route: contextRoute, loading: contextLoading },
  } = useChat();

  const route = propRoute ?? contextRoute;
  const loading = propLoading ?? contextLoading;

  const isLast = isLastMessage || messages[messages.length - 1] === message;

  if (!loading && !message.text && !route) {
    return null;
  }

  // Format the message text to handle ASCII tables
  const formattedText = formatAsciiTable(message.text || "");

  return (
    <div className={styles.msgContainer}>
      <div className={`${styles.msg} ${styles[message.role]}`}>
        <Markdown text={formattedText} />
        {isLast && loading && !route && (
          <span className={styles.typingDots} aria-live="polite"></span>
        )}
        {isLast && route && <RouteTool route={route} />}
      </div>
    </div>
  );
}
