import styles from "./RouteTool.module.css";
export default function RouteTool({
  args,
}: {
  args: { destination?: string; route?: string; message?: string };
}) {
  return (
    <div className={styles.container}>
      {/* Animated routing icon */}
      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerCenter}></div>
        </div>
      </div>

      {/* Routing message */}
      <div className={styles.content}>
        <p className={styles.mainText}>
          <span className={styles.routeLabel}>Routing to:</span>{" "}
          <span className={styles.destination}>
            {String(args?.destination || args?.route || "destination")}
          </span>
        </p>
        {args?.message && (
          <p className={styles.message}>{String(args.message)}</p>
        )}
      </div>

      {/* Animated arrow */}
      <div className={styles.arrowContainer}>
        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
        </div>
      </div>
    </div>
  );
}
