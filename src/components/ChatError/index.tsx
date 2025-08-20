import { AlertCircle } from "lucide-react";
import styles from "./ChatError.module.css";

export default function ChatError({ error }: { error: string }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <AlertCircle size={24} />
      </div>
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>Something went wrong</h3>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    </div>
  );
}
