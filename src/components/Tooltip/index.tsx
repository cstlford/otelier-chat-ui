import { ReactNode, useState, useEffect } from "react";
import styles from "./Tooltip.module.css";

type Props = {
  children: ReactNode;
  content: string;
  autoHideDelay?: number;
};

export default function Tooltip({
  children,
  content,
  autoHideDelay = 2000,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible && autoHideDelay > 0) {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, autoHideDelay]);

  if (!content) return children;

  return (
    <div
      className={styles.tooltip}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={styles.content}>
          {content}
          <div className={styles.pointer} />
        </div>
      )}
    </div>
  );
}
