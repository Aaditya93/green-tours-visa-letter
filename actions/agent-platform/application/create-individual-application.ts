"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import {
  generateFiveDigitNumber,
  getCompletionDate,
  getWorkplace,
  formatString,
  capitalizeAllWords,
  removeHyphens,
  parseDate,
} from "../utils";
import { ActionResponse } from "@/actions/types";

interface PassportDetails {
  full_name: string;
  country: string;
  birthday: string;
  dateOfExpiry: string;
  sex: string;
  passport_number: string;
}

export const createApplicationIndiviualTravelAgent = async (
  groupId: string,
  noOfVisa: number,
  passportDetails: PassportDetails,
  file_path: string,
  cost: number,
  currency: string,
  speed: string,
  entryType: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return { success: false, error: "Unauthorized" };

    const country = formatString(passportDetails.country);
    const awsurl = process.env.S3_AWS_URL;
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
      stage: "Submitted",
      payment: false,
    };

    const newApplication = await Application.create({
      id: groupId,
      noOfVisa,
      passportDetails: [passportInfo],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: true,
      workPlace: getWorkplace(country),
      purpose: "Travel",
      job: "Freelancer",
      cost,
      currency,
      processingInfo: { speed },
      result,
      travelDuration: entryType === "singleEntry" ? 15 : 30,
      creator: {
        _id: session.user.id,
        companyId: session.user.companyId,
        creator: session.user.name,
        role: session.user.role,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return { success: true, data: newApplication._id.toString() };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Internal server error" };
  }
};
