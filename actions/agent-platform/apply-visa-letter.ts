"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { auth } from "@/auth";
import { addDays, addHours } from "date-fns";
function generateFiveDigitNumber(): string {
  const min = 10000;
  const max = 99999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}
export const createApplicationTravelAgent = async (
  groupId: string,
  noOfVisa: number,
  cost: number,
  currency: string,
  speed: string,
  entryType: string
) => {
  try {
    await dbConnect();
    const session = await auth();
    const result = getCompletionDate(speed);
    const newApplication = await Application.create({
      id: groupId,
      noOfVisa: noOfVisa,
      passportDetails: [],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: false,
      purpose: "Travel",
      job: "Freelancer",
      cost: cost,
      currency: currency,
      processingInfo: { speed: speed },
      result: result,
      travelDuration: entryType === "singleEntry" ? 15 : 30,
      creator: {
        _id: session?.user.id,
        role: session?.user.role,
        companyId: session?.user.companyId,

        creator: session?.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });
    return newApplication._id.toString();
  } catch (error) {
    console.error("Failed to create application", error);
  }
};

interface PassportDetails {
  full_name: string;
  country: string;
  birthday: string;
  dateOfExpiry: string;
  sex: string;
  passport_number: string;
}

function getworkplace(country: string): string {
  switch (country) {
    case "China":
      return "Shanghai";
    case "India":
      return "Mumbai";
    case "Bangladesh":
      return "Dhaka";
    case "Thailand":
      return "Bangkok";
    case "China(taiwan)":
      return "Taipei";
    case "Australia":
      return "Sydney";
    default:
      return "Other";
  }
}

function formatString(str: string): string {
  if (!str?.trim()) return "";

  return str.toLowerCase().replace(/\b\w+\b|\(([^)]+)\)/g, (match, group) => {
    if (group) {
      // Handle text inside parentheses
      return `(${group
        .split(" ")
        .map(
          (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")})`;
    }
    // Handle regular words
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
}

function capitalizeAllWords(str: string): string {
  // Handle empty or null strings
  if (!str?.trim()) return "";

  // Convert to uppercase and handle multiple spaces
  return str
    .toUpperCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .join(" ");
}

function removeHyphens(str: string): string {
  if (!str?.trim()) return "";
  return str.replace(/-/g, " ");
}

function parseDate(dateString: string) {
  try {
    const [day, month, year] = dateString.split("/").map(Number);
    // Note: month is 0-based in JavaScript Date
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Failed to parse date", error);
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY`);
  }
}

export const createApplicationIndiviualTravelAgent = async (
  groupId: string,
  noOfVisa: number,
  passportDetails: PassportDetails,
  file_path: string,
  cost: number,
  currency: string,
  speed: string,
  entryType: string
) => {
  const country = formatString(passportDetails.country);
  const awsurl = process.env.S3_AWS_URL;
  const session = await auth();
  const name = capitalizeAllWords(passportDetails.full_name);
  const result = getCompletionDate(speed);

  const passportInfo = {
    fullName: removeHyphens(name),
    nationalityCurrent: country,
    sex: passportDetails.sex,
    dateOfExpiry: parseDate(passportDetails.dateOfExpiry),
    passportNumber: passportDetails.passport_number,
    birthday: parseDate(passportDetails.birthday),
    image: awsurl + file_path,
    originalNationality: "",
    passportType: "Ordinary Passport",
    stage: "Not Processed",
  };
  try {
    // create application

    const newApplication = await Application.create({
      id: groupId,
      noOfVisa: noOfVisa,
      passportDetails: [passportInfo],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: true,
      workPlace: getworkplace(country),
      purpose: "Travel",
      job: "Freelancer",
      cost: cost,
      currency: currency,
      processingInfo: { speed: speed },
      result: result,
      travelDuration: entryType === "singleEntry" ? 15 : 30,
      creator: {
        _id: session?.user.id,
        companyId: session?.user.companyId,
        creator: session?.user.name,
        role: session?.user.role,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return newApplication._id.toString();
  } catch (error) {
    console.error("Failed to create application", error);
  }
};

interface ManualInfo {
  from_date: Date;
  to_date: Date;
  airport?: string;
  embassy?: string;
  duration: string;
}

export const updateApplicationManualInfoTravelAgent = async (
  existingApplicationId: string,
  manualInfo: ManualInfo
) => {
  try {
    await dbConnect();

    const response = await Application.findByIdAndUpdate(
      existingApplicationId,
      {
        $set: {
          "entryDetails.fromDate": manualInfo.from_date,
          "entryDetails.toDate": manualInfo.to_date,
          placeOfIssue: manualInfo.airport || manualInfo.embassy,
          isCompleted: true,
          duration: manualInfo.duration,
        },
      },
      { new: true }
    );
    return !!response;
  } catch (error) {
    console.error("Error updating application:", error);
  }
};
const getCompletionDate = (speed: string): Date => {
  const today = new Date();

  // For "NO" speed, add 5 business days
  if (speed === "NO") {
    return addDays(today, 5);
  }

  const [, value, unit] = speed.match(/(\d+)([HD])/) || [];

  if (!value || !unit) {
    return today;
  }

  const numValue = parseInt(value);

  if (unit === "H") {
    return addHours(today, numValue);
  } else if (unit === "D") {
    return addDays(today, numValue);
  }

  return today;
};
