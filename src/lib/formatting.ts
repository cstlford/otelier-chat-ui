/**
 * Utility functions for formatting text content in messages
 */

/**
 * Detects and formats ASCII tables in text content
 * Converts ASCII tables to proper markdown table format
 */
export const formatAsciiTable = (text: string): string => {
  const lines = text.split("\n");
  const tableLines = [];
  let inTable = false;
  let tableStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if this line looks like a table header (contains | and has separator line below)
    if (line.includes("|") && nextLine && nextLine.match(/^[\s\-|:]+$/)) {
      if (!inTable) {
        inTable = true;
        tableStart = i;
      }
    } else if (inTable && !line.includes("|")) {
      // End of table
      inTable = false;
      tableLines.push({ start: tableStart, end: i - 1 });
    }
  }

  // Handle table that ends at the end of text
  if (inTable) {
    tableLines.push({ start: tableStart, end: lines.length - 1 });
  }

  // Format detected tables
  let formattedText = text;
  for (let i = tableLines.length - 1; i >= 0; i--) {
    const { start, end } = tableLines[i];
    const tableContent = lines.slice(start, end + 1).join("\n");
    const formattedTable = formatTableContent(tableContent);

    // Replace the original table with formatted version
    const beforeTable = lines.slice(0, start).join("\n");
    const afterTable = lines.slice(end + 1).join("\n");
    formattedText = [beforeTable, formattedTable, afterTable]
      .filter(Boolean)
      .join("\n");
  }

  return formattedText;
};

/**
 * Formats table content with proper markdown structure
 */
const formatTableContent = (tableText: string): string => {
  const lines = tableText.split("\n");
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^[\s\-|:]+$/)) {
      // This is a separator line, format it properly
      const cellCount = (line.match(/\|/g) || []).length - 1;
      const separator = "|" + "---|".repeat(cellCount);
      formattedLines.push(separator);
    } else if (line.includes("|")) {
      // This is a data row, ensure proper formatting
      let formattedLine = line.trim();
      if (!formattedLine.startsWith("|")) {
        formattedLine = "|" + formattedLine;
      }
      if (!formattedLine.endsWith("|")) {
        formattedLine = formattedLine + "|";
      }
      formattedLines.push(formattedLine);
    } else {
      formattedLines.push(line);
    }
  }

  return formattedLines.join("\n");
};
