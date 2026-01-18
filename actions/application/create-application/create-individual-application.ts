"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import {
  generateFiveDigitNumber,
  formatString,
  capitalizeAllWords,
  removeHyphens,
  parseDate,
  getworkplace,
} from "../utils";
import { PassportDetails } from "../types";
import { ActionResponse } from "@/actions/types";

export const createApplicationIndiviual = async (
  groupId: string,
  noOfVisa: number,
  passportDetails: PassportDetails,
  file_path: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const country = formatString(passportDetails.country);
    const awsurl = process.env.S3_AWS_URL;
    const name = capitalizeAllWords(passportDetails.full_name);

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
      creator: {
        _id: session.user.id,
        role: session.user.role,
        creator: session.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return { success: true, data: newApplication._id.toString() };
  } catch (error) {
    console.error("Failed to create individual application", error);
    return { success: false, error: "Failed to create individual application" };
  }
};
