import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { downloadImage } from "../../lib/downloads";
import styles from "../Message/Message.module.css";

const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let i = 0;
  const len = text.length;
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  while (i < len) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < len && text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      } else {
        cell += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ",") {
        row.push(cell);
        cell = "";
        i++;
        continue;
      }
      if (ch === "\r") {
        i++;
        continue;
      }
      if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        i++;
        continue;
      }
      cell += ch;
      i++;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
};

export default function CSVTable({ csvUrl }: { csvUrl: string }) {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(csvUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        setRows(parseCSV(text));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  if (error)
    return <div className={styles.tableError}>Error loading CSV: {error}</div>;
  if (!rows) return <div className={styles.tableLoading}>Loading CSV…</div>;

  const header = rows[0] ?? [];
  const body = rows.slice(1);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableToolbar}>
        <button
          className={styles.downloadButton}
          onClick={() => {
            downloadImage(csvUrl, `table-${Date.now()}.csv`);
          }}
          title="Download as CSV"
        >
          <Download size={16} />
        </button>
      </div>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableRow}>
            {header.map((h, idx) => (
              <th key={idx} className={styles.tableHeader}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {body.map((r, ri) => (
            <tr key={ri} className={styles.tableRow}>
              {r.map((c, ci) => (
                <td key={ci} className={styles.tableCell}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
