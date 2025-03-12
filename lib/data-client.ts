"use client";

import { downloadFileData } from "./data";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { SerializabledApplication } from "@/config/serialize";
import { Application } from "@/app/schemas/types";

const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("/"); // Convert slashes to hyphens
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
const formatVietnamDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }

    const vietnamFormatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });

    return vietnamFormatter.format(date);
  } catch (error) {
    console.error("Error formatting Vietnam date:", error);
    return "";
  }
};

export function convertToApplicationsClient(
  input: SerializabledApplication[]
): Application[] {
  return input.flatMap((entry) =>
    entry.passportDetails.map((passport) => {
      const applicationObject = {
        id: entry._id,
        passportId: passport._id || "",
        fullName: passport.fullName || "",
        stage: passport.stage,
        iref: passport.iref,
        birthday: formatDate(passport.birthday.toString()) || "",
        sex: passport.sex || "",
        passportType: passport.passportType || "",
        originalNationality: passport.originalNationality || "",
        nationalityCurrent: passport.nationalityCurrent || "",
        passportNumber: passport.passportNumber || "",
        code:
          input.length > 1
            ? (entry.code + entry.passportDetails.indexOf(passport)).toString()
            : entry.code.toString(),
        job: entry.job,
        workPlace: entry.workPlace,
        purpose: entry.purpose,
        placeOfIssue: entry.placeOfIssue,
        duration: entry.duration,
        fromDate: formatDate(entry.entryDetails.fromDate.toString()),
        toDate: formatDate(entry.entryDetails.toDate.toString()),
        speed: entry.processingInfo.speed,
        notes: entry.processingInfo.notes,
        creator: entry.creator.creator,
        role: entry.creator.role,
        createdDate: formatVietnamDate(entry.creator.createdDate.toString()),
        createdTime: entry.creator.createdTime,
        handleBy: entry.creator.handleBy,
        result: formatDate(entry.result.toString()),
        companyId: entry.companyId,
        cost: entry.cost / entry.passportDetails.length,
      };
      return applicationObject;
    })
  );
}

export const downloadFile = async (format: string, data: Application[]) => {
  const fileData = downloadFileData(data);
  try {
    const response = await fetch(`/api/tables?format=${format}`, {
      method: "POST",
      body: JSON.stringify(fileData),
    });

    if (!response.ok) {
      throw new Error("Download failed");
    }

    // For PDF format

    if (format === "pdf") {
      const htmlContent = await response.text();
      const element = document.createElement("div");
      element.innerHTML = htmlContent;

      // Set fixed width and add styles
      element.style.width = "1100px";
      element.style.maxWidth = "100%";
      element.style.margin = "0 auto";

      // Add table styles
      const table = element.querySelector("table");
      if (table) {
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.tableLayout = "fixed";
      }

      document.body.appendChild(element);

      // Calculate scale based on content
      const rowCount = element.querySelectorAll("tr").length;
      const scale = rowCount <= 2 ? 1 : 2; // Reduce scale for fewer rows

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "tabloid",
        compress: true,
      });

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        width: 3000, // Match element width
        windowWidth: 3100,
      });

      document.body.removeChild(element);

      // Calculate aspect ratio
      const aspectRatio = canvas.height / canvas.width;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdfWidth * aspectRatio;

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save("VisaForm.pdf");
    } else {
      // For other formats, directly download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = data[0].iref
        ? `${data[0].iref}.${format}`
        : `VisaFrom.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download the file. Please try again.");
  }
};
interface DurationData {
  count: number;
  totalAmount: number;
}

interface DateGroup {
  totalCount: { [key: string]: number };
  totalAmount: { [key: string]: number };
  totalPax: number;
}

interface RawDataStructure {
  data: Array<{
    date: string;
    durations: { [key: string]: DurationData };
  }>;
  summary: { totalAmount: number };
}

function formatImmigrationData(rawData: RawDataStructure, currency: string) {
  const { data, summary } = rawData;

  // Initialize objects to store totals and counts across all dates
  const combinedTotals: { [key: string]: number } = {};
  const combinedCounts: { [key: string]: number } = {};
  const dateGrouped: { [key: string]: DateGroup } = {};
  let totalPax = 0;

  // Iterate through the data to calculate totals and counts per date
  data.forEach(({ date, durations }) => {
    if (!dateGrouped[date]) {
      dateGrouped[date] = { totalCount: {}, totalAmount: {}, totalPax: 0 };
      Object.keys(durations).forEach((duration) => {
        dateGrouped[date].totalCount[duration] = 0;
        dateGrouped[date].totalAmount[duration] = 0;
      });
    }

    Object.keys(durations).forEach((duration) => {
      dateGrouped[date].totalCount[duration] += durations[duration].count;
      dateGrouped[date].totalAmount[duration] +=
        durations[duration].totalAmount;

      if (!combinedTotals[duration]) {
        combinedTotals[duration] = 0;
        combinedCounts[duration] = 0;
      }

      combinedTotals[duration] += durations[duration].totalAmount;
      combinedCounts[duration] += durations[duration].count;
    });

    dateGrouped[date].totalPax += 1; // Increment total pax for the date
    totalPax += 1;
  });

  // Create the rows for the table
  const rows = [];

  // Average price row
  const avgPriceRow: { DATE: string; [key: string]: string } = {
    DATE: `Avg. Price (${currency})`,
  };
  Object.keys(combinedTotals).forEach((duration) => {
    const avgPrice =
      combinedCounts[duration] > 0
        ? (combinedTotals[duration] / combinedCounts[duration]).toFixed(2)
        : "0.00";
    avgPriceRow[duration] = parseFloat(avgPrice) > 0 ? ` ${avgPrice}` : " 0.00";
  });
  rows.push(avgPriceRow);

  // Rows for each date
  Object.entries(dateGrouped).forEach(([date, group]) => {
    const dateRow: { DATE: string; [key: string]: string | number } = {
      DATE: date,
    };

    Object.keys(group.totalCount).forEach((duration) => {
      dateRow[duration] = group.totalCount[duration] || 0;
    });

    rows.push(dateRow);
  });

  // Add "Number of pax" row only once
  const paxRow: { DATE: string; [key: string]: string | number } = {
    DATE: "Number of pax",
  };
  Object.keys(combinedCounts).forEach((duration) => {
    paxRow[duration] = combinedCounts[duration] || 0;
  });
  rows.push(paxRow);

  // Add "Total (VND)" row
  const totalRow = {
    DATE: `Total (${currency})`,
    ...Object.keys(combinedTotals).reduce<{ [key: string]: string }>(
      (acc, duration) => {
        acc[duration] = combinedTotals[duration]
          ? `${currency} ${combinedTotals[duration].toLocaleString()}`
          : `${currency} 0`;
        return acc;
      },
      {}
    ),
  };
  rows.push(totalRow);

  // Add final pax count row
  const summaryRow1 = {
    DATE: `Total (Pax): ${totalPax} Pax`,
  };
  const summaryRow2 = {
    DATE: `Total: ${currency} ${summary.totalAmount.toLocaleString()} `,
  };
  rows.push(summaryRow1);
  rows.push(summaryRow2);

  return rows;
}
export const downloadFileImmigration = async (
  format: string,
  data: any,
  days: string,
  currency: string
) => {
  try {
    const formattedData = formatImmigrationData(data, currency);

    const response = await fetch(`/api/tables?format=${format}`, {
      method: "POST",
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      throw new Error("Download failed");
    }

    // For PDF format

    if (format === "pdf") {
      const htmlContent = await response.text();
      const element = document.createElement("div");
      element.innerHTML = htmlContent;

      // Set fixed width and add styles
      element.style.width = "1100px";
      element.style.maxWidth = "100%";
      element.style.margin = "0 auto";

      // Add table styles
      const table = element.querySelector("table");
      if (table) {
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.tableLayout = "fixed";
      }

      document.body.appendChild(element);

      // Calculate scale based on content
      const rowCount = element.querySelectorAll("tr").length;
      const scale = rowCount <= 2 ? 1 : 2; // Reduce scale for fewer rows

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "tabloid",
        compress: true,
      });

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        width: 3000, // Match element width
        windowWidth: 3100,
      });

      document.body.removeChild(element);

      // Calculate aspect ratio
      const aspectRatio = canvas.height / canvas.width;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdfWidth * aspectRatio;

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save("VisaForm.pdf");
    } else {
      // For other formats, directly download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${days} Days`
        ? `${days} Days.${format}`
        : `VisaFrom.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download the file. Please try again.");
  }
};
