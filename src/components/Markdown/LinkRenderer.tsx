import CSVTable from "../CSVTable";
import { useAppState } from "../../context/useAppState";

export default function LinkRenderer({ href, children, ...props }: any) {
  const { url } = useAppState();
  const base = (url || "").replace(/\/$/, "");
  const normalized =
    typeof href === "string" ? `${base}/api/chatbot/${href}` : "";

  if (typeof href === "string" && href.endsWith(".csv")) {
    return <CSVTable csvUrl={normalized} />;
  }
  return (
    <a href={normalized} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
