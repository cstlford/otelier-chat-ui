import { Download } from "lucide-react";
import { downloadTableAsCSV } from "../../lib/downloads";
import styles from "../Message/Message.module.css";

export function TableWrapper({ children }: any) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableToolbar}>
        <button
          className={styles.downloadButton}
          onClick={(e) => {
            const tableElement =
              (e.currentTarget
                .closest(`.${styles.tableWrapper}`)
                ?.querySelector("table") as HTMLTableElement) || null;
            if (tableElement) {
              downloadTableAsCSV(tableElement, `table-${Date.now()}.csv`);
            }
          }}
          title="Download as CSV"
        >
          <Download size={16} />
        </button>
      </div>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

export const THead = ({ children }: any) => (
  <thead className={styles.tableHead}>{children}</thead>
);

export const TBody = ({ children }: any) => (
  <tbody className={styles.tableBody}>{children}</tbody>
);

export const TR = ({ children }: any) => (
  <tr className={styles.tableRow}>{children}</tr>
);

export const TH = ({ children }: any) => (
  <th className={styles.tableHeader}>{children}</th>
);

export const TD = ({ children }: any) => (
  <td className={styles.tableCell}>{children}</td>
);
