import { addDays, addHours } from "date-fns";

/**
 * Generates a random 5-digit number as a string.
 */
export function generateFiveDigitNumber(): string {
  const min = 10000;
  const max = 99999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}

/**
 * Maps a country to its corresponding workplace city.
 */
export function getWorkplace(country: string): string {
  const workplaceMap: Record<string, string> = {
    China: "Shanghai",
    India: "Mumbai",
    Bangladesh: "Dhaka",
    Thailand: "Bangkok",
    "China(taiwan)": "Taipei",
    Australia: "Sydney",
  };
  return workplaceMap[country] || "Other";
}

/**
 * Formats a string to title case, handling text inside parentheses.
 */
export function formatString(str: string): string {
  if (!str?.trim()) return "";

  return str.toLowerCase().replace(/\b\w+\b|\(([^)]+)\)/g, (match, group) => {
    if (group) {
      return `(${group
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")})`;
    }
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
}

/**
 * Capitalizes all words in a string and removes extra spaces.
 */
export function capitalizeAllWords(str: string): string {
  if (!str?.trim()) return "";

  return str
    .toUpperCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .join(" ");
}

/**
 * Removes hyphens from a string.
 */
export function removeHyphens(str: string): string {
  if (!str?.trim()) return "";
  return str.replace(/-/g, " ");
}

/**
 * Parses a date string in DD/MM/YYYY format.
 */
export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split("/").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY`);
  }
  return new Date(year, month - 1, day);
}

/**
 * Calculates the completion date based on the processing speed.
 */
export function getCompletionDate(speed: string): Date {
  const today = new Date();

  if (speed === "NO") {
    return addDays(today, 5);
  }

  const match = speed.match(/(\d+)([HD])/);
  if (!match) return today;

  const [, value, unit] = match;
  const numValue = parseInt(value);

  if (unit === "H") {
    return addHours(today, numValue);
  } else if (unit === "D") {
    return addDays(today, numValue);
  }

  return today;
}
