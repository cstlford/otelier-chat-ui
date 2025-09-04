import CSVTable from "../CSVTable";

export default function LinkRenderer({ href, children, ...props }: any) {
  const isCSV =
    typeof href === "string" &&
    (href.endsWith(".csv") || href.includes("/files/temp/"));
  if (isCSV) {
    return <CSVTable csvUrl={href || ""} />;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
