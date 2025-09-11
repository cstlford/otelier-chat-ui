import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import LinkRenderer from "./LinkRenderer";
import { TableWrapper, THead, TBody, TR, TH, TD } from "./Table";
import { Download } from "lucide-react";
import { downloadURL } from "../../lib/downloads";
import styles from "../Message/Message.module.css";
import MermaidDiagram from "../Mermaid";
import { useAppState } from "../../context/useAppState";

type Props = {
  text: string;
};

export default function Markdown({ text }: Props) {
  const { url } = useAppState();
  const normalized = (url || "").replace(/\/$/, "");

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        a: LinkRenderer as any,
        img: ({ src, alt }: any) => (
          <div className={styles.imageContainer}>
            <img
              className={styles.img}
              src={`${normalized}/api/chatbot/${src}`}
              alt={alt}
            />
            <button
              className={styles.downloadButton}
              onClick={() =>
                downloadURL(
                  `${normalized}/api/chatbot/${src}` || "",
                  alt || "image"
                )
              }
              title="Download image"
            >
              <Download size={16} />
            </button>
          </div>
        ),
        table: ({ children }: any) => <TableWrapper>{children}</TableWrapper>,
        thead: ({ children }: any) => <THead>{children}</THead>,
        tbody: ({ children }: any) => <TBody>{children}</TBody>,
        tr: ({ children }: any) => <TR>{children}</TR>,
        th: ({ children }: any) => <TH>{children}</TH>,
        td: ({ children }: any) => <TD>{children}</TD>,
        ul: ({ children }: any) => <ul className={styles.list}>{children}</ul>,
        ol: ({ children }: any) => (
          <ol className={styles.orderedList}>{children}</ol>
        ),
        li: ({ children }: any) => (
          <li className={styles.listItem}>{children}</li>
        ),
        code: ({ inline, className, children, ...rest }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match && match[1] === "mermaid") {
            return (
              <MermaidDiagram code={String(children).replace(/\n$/, "")} />
            );
          }
          return (
            <code className={className} {...rest}>
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
