import { NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/auth";

interface TableOptions {
  title?: string;
  tableClass?: string;
  headerClass?: string;
  rowClass?: string;
  columnWidth?: string;
}

function jsonToHtmlTable(jsonData: any[], options: TableOptions = {}) {
  const {
    tableClass = "data-table",
    headerClass = "table-header",
    rowClass = "table-row",
    columnWidth = "200px", // Fixed column width (adjust as needed)
  } = options;

  // Validate input
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return "<p>No data available</p>";
  }

  // Get column headers
  const headers = Object.keys(jsonData[0]);

  // Generate HTML
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .${tableClass} { width: 100%; border-collapse: collapse; }
        .${tableClass} th, .${tableClass} td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            width: ${columnWidth}; /* Fixed column width */
        }
        .${headerClass} { background-color: #f2f2f2; font-weight: bold; }
        .${tableClass} tr:nth-child(even) { background-color: #f9f9f9; }
        .${tableClass} tr:hover { background-color: #f5f5f5; }
    </style>
  </head>
  <body>
    <table class="${tableClass}">
        <thead>
            <tr>
                ${headers.map((header) => `<th class="${headerClass}">${header}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${jsonData
              .map(
                (row) => `
            <tr class="${rowClass}">
                ${headers.map((header) => `<td>${row[header] || ""}</td>`).join("")}
            </tr>
            `,
              )
              .join("")}
        </tbody>
    </table>
  </body>
  </html>
    `;

  return htmlContent;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format");

  try {
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const tableName = "Visa From";
    const jsonTableData = await request.json();
    const dataArray = Array.isArray(jsonTableData)
      ? jsonTableData
      : [jsonTableData];

    const worksheet = XLSX.utils.json_to_sheet(dataArray);

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet, {
        forceQuotes: true,
      });

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${tableName}.csv"`,
          "Content-Type": "text/csv",
        },
      });
    } else if (format === "txt") {
      // tab-separated values

      const txt = XLSX.utils.sheet_to_txt(worksheet, {
        forceQuotes: true,
      });

      return new Response(txt, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${tableName}.txt"`,
          "Content-Type": "text/csv",
        },
      });
    } else if (format === "xlsx") {
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");

      const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${tableName}.xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    } else if (format === "json") {
      return Response.json(dataArray);
    } else if (format === "pdf") {
      const htmlContent = jsonToHtmlTable(dataArray);

      return new Response(htmlContent, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="VisaForm.pdf"',
        },
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return new Response(e.message, {
        status: 400,
      });
    }
  }
}
