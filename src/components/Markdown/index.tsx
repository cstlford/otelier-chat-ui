import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import CodeBlock from "./CodeBlock";
import LinkRenderer from "./LinkRenderer";
import { TableWrapper, THead, TBody, TR, TH, TD } from "./Table";
import { Download } from "lucide-react";
import { downloadImage } from "../../lib/downloads";
import styles from "../Message/Message.module.css";

type Props = {
  text: string;
};

export default function Markdown({ text }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        a: LinkRenderer as any,
        img: ({ src, alt }: any) => (
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
        code: CodeBlock as any,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
