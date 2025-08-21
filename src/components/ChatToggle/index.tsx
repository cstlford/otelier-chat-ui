import { useState } from "react";
import styles from "./ChatToggle.module.css";
import bot from "../../assets/bot.svg";
import hoverBot from "../../assets/bot-hover.svg";
import closeBot from "../../assets/bot-close.svg";
import ChatInterface from "../ChatInterface";

export default function ChatToggle() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.chatToggle}>
      <div
        className={`${styles.chatContainer} ${
          isOpen ? styles.open : styles.closed
        }`}
      >
        <ChatInterface onClose={() => setIsOpen(false)} />
      </div>

      <div
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isOpen ? closeBot : isHovered ? hoverBot : bot}
          className={styles.icon}
          alt="Chat toggle"
        />
      </div>
    </div>
  );
}
