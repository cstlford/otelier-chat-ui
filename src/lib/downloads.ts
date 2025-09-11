export const downloadTableAsCSV = (
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

export const downloadURL = (url: string, filename?: string) => {
  fetch(url)
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


