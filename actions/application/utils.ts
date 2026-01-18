export function generateFiveDigitNumber(): string {
  const min = 10000;
  const max = 99999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export function formatString(str: string): string {
  if (!str?.trim()) return "";

  return str.toLowerCase().replace(/\b\w+\b|\(([^)]+)\)/g, (match, group) => {
    if (group) {
      return `(${group
        .split(" ")
        .map(
          (word: string): string =>
            word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ")})`;
    }
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
}

export function capitalizeAllWords(str: string): string {
  if (!str?.trim()) return "";
  return str
    .toUpperCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .join(" ");
}

export function removeHyphens(str: string): string {
  if (!str?.trim()) return "";
  return str.replace(/-/g, " ");
}

export function parseDate(dateString: string): Date {
  try {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Failed to parse date", error);
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY`);
  }
}

export function getworkplace(country: string): string {
  const countryMap: Record<string, string> = {
    China: "Shanghai",
    India: "Mumbai",
    Bangladesh: "Dhaka",
    Thailand: "Bangkok",
    "China(taiwan)": "Taipei",
    Australia: "Sydney",
  };
  return countryMap[country] || "Other";
}

export function extractUniqueIds(data: any[]) {
  const ids = new Set<string>();
  data.forEach((item) => {
    if (item.passportId) {
      ids.add(item.passportId.toString());
    }
  });
  return {
    uniqueIds: Array.from(ids),
  };
}

export const convertToPassportBillings = async (
  passportsData: any[],
): Promise<any[]> => {
  if (!Array.isArray(passportsData)) return [];

  return passportsData.map((passport) => ({
    name: passport.fullName || "",
    cost: passport.cost || 0,
    currency: passport.currency || "USD",
    passportId: passport.passportId?.toString() || "",
    applicationId: passport.id?.toString() || "",
    nationality: passport.nationalityCurrent || "",
    bill: passport.bill || false,
    payment: passport.payment || false,
    passportNumber: passport.passportNumber || "",
    applicationCode: passport.code || "",
    duration: passport.duration || "",
    speed: passport.speed || "",
  }));
};
