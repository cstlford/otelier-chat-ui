import { useEffect, useState } from "react";
import { TableWrapper, THead, TBody, TR, TH, TD } from "../Markdown/Table";
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

type Props = {
  csvUrl: string;
  maxRows?: number; // max data rows to display (excludes header)
};

export default function CSVTable({ csvUrl, maxRows = 20 }: Props) {
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
  const limit = Math.max(1, maxRows);
  const limited = body.length > limit;
  const visibleBody = limited ? body.slice(0, limit) : body;

  return (
    <>
      <TableWrapper
        onDownload={() => downloadImage(csvUrl, `table-${Date.now()}.csv`)}
      >
        <THead>
          <TR>
            {header.map((h, idx) => (
              <TH key={idx}>{h}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {visibleBody.map((r, ri) => (
            <TR key={ri}>
              {r.map((c, ci) => (
                <TD key={ci}>{c}</TD>
              ))}
            </TR>
          ))}
        </TBody>
      </TableWrapper>
      {limited && (
        <div style={{ padding: "8px 0" }}>
          Showing first {limit.toLocaleString()} of{" "}
          {body.length.toLocaleString()} rows.
        </div>
      )}
    </>
  );
}
