import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import styles from "./Mermaid.module.css";

export default function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

  useEffect(() => {
    if (ref.current) {
      mermaid
        .render(id, code)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch((error: Error) => {
          if (ref.current) {
            ref.current.innerHTML = `<pre>Error rendering diagram</pre>`;
          }
        });
    }
  }, [code]);

  return <div ref={ref} className={styles.mermaid} />;
}
