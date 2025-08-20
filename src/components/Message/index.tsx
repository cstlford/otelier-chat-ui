import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSanitize from "rehype-sanitize";
import MermaidDiagram from "../Mermaid";
import { Download } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import RouteTool from "../RouteTool";
import { ChatMessage, ToolCall } from "../../context/ChatContext";
import { formatAsciiTable } from "../../lib/formatting";
import styles from "./Message.module.css";

type Props = {
  message: ChatMessage;
  toolCalls?: ToolCall[];
  isLastMessage?: boolean;
  loading?: boolean;
};

// Function to download table as CSV
const downloadTableAsCSV = (
  tableElement: HTMLTableElement,
  filename: string = "table.csv"
) => {
  const rows = Array.from(tableElement.querySelectorAll("tr"));
  const csvContent = rows
    .map((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      return cells
        .map((cell) => {
          const text = cell.textContent || "";
          // Escape quotes and wrap in quotes if contains comma
          return text.includes(",") ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(",");
    })
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to download image
const downloadImage = (imageUrl: string, filename?: string) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading image:", error);
    });
};

export default function Message({
  message,
  toolCalls: propToolCalls,
  isLastMessage = false,
  loading: propLoading = false,
}: Props) {
  const {
    state: { messages, toolCalls: contextToolCalls, loading: contextLoading },
  } = useChat();

  const toolCalls = propToolCalls ?? contextToolCalls;
  const loading = propLoading ?? contextLoading;

  const isLast = isLastMessage || messages[messages.length - 1] === message;

  if (!loading && !message.text && (!toolCalls || toolCalls.length === 0)) {
    return null;
  }

  // Format the message text to handle ASCII tables
  const formattedText = formatAsciiTable(message.text || "");

  return (
    <div className={styles.msgContainer}>
      <div className={`${styles.msg} ${styles[message.role]}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            img: ({ src, alt }) => (
              <div className={styles.imageContainer}>
                <img className={styles.img} src={src} alt={alt} />
                <button
                  className={styles.downloadButton}
                  onClick={() => downloadImage(src || "", alt || "image")}
                  title="Download image"
                >
                  <Download size={16} />
                </button>
              </div>
            ),
            table: ({ children }) => (
              <div className={styles.tableWrapper}>
                <div className={styles.tableToolbar}>
                  <button
                    className={styles.downloadButton}
                    onClick={(e) => {
                      const tableElement = e.currentTarget
                        .closest(".tableWrapper")
                        ?.querySelector("table") as HTMLTableElement;
                      if (tableElement) {
                        downloadTableAsCSV(
                          tableElement,
                          `table-${Date.now()}.csv`
                        );
                      }
                    }}
                    title="Download as CSV"
                  >
                    <Download size={16} />
                  </button>
                </div>
                <table className={styles.table}>{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={styles.tableHead}>{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className={styles.tableBody}>{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className={styles.tableRow}>{children}</tr>
            ),
            th: ({ children }) => (
              <th className={styles.tableHeader}>{children}</th>
            ),
            td: ({ children }) => (
              <td className={styles.tableCell}>{children}</td>
            ),
            ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
            ol: ({ children }) => (
              <ol className={styles.orderedList}>{children}</ol>
            ),
            li: ({ children }) => (
              <li className={styles.listItem}>{children}</li>
            ),
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              if (!inline && match && match[1] === "mermaid") {
                return (
                  <MermaidDiagram code={String(children).replace(/\n$/, "")} />
                );
              }
              return !inline && match ? (
                <SyntaxHighlighter
                  style={a11yDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {formattedText}
        </ReactMarkdown>
        {isLast && loading && toolCalls.length === 0 && (
          <span className={styles.typingDots} aria-live="polite"></span>
        )}
        {isLast &&
          toolCalls.length > 0 &&
          toolCalls.map((tc) => <RouteTool key={tc.id} args={tc.args} />)}
      </div>
    </div>
  );
}
