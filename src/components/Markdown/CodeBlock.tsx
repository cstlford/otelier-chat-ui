import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import MermaidDiagram from "../Mermaid";

export default function CodeBlock(props: any) {
  const { inline, className, children, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");
  if (!inline && match && match[1] === "mermaid") {
    return <MermaidDiagram code={String(children).replace(/\n$/, "")} />;
  }
  return !inline && match ? (
    <SyntaxHighlighter
      style={a11yDark as any}
      language={match[1]}
      PreTag="div"
      {...rest}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
