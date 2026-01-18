"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import {
  formatString,
  capitalizeAllWords,
  removeHyphens,
  parseDate,
  getworkplace,
} from "./utils";
import { PassportDetails } from "./types";

import { ActionResponse } from "@/actions/types";

export const updateApplication = async (
  existingApplicationId: string,
  passportDetails: PassportDetails,
  file_path: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const awsurl = process.env.S3_AWS_URL;

    if (!existingApplicationId || !passportDetails) {
      return { success: false, error: "Missing required parameters" };
    }

    const country = formatString(passportDetails.country);
    const name = capitalizeAllWords(passportDetails.full_name);

    const passportInfo = {
      fullName: removeHyphens(name),
      nationalityCurrent: country,
      sex: passportDetails.sex,
      passportNumber: passportDetails.passport_number,
      dateOfExpiry: parseDate(passportDetails.dateOfExpiry),
      birthday: parseDate(passportDetails.birthday),
      image: awsurl + file_path,
      passportType: "Ordinary Passport",
      originalNationality: "",
      stage: "Submitted",
      payment: false,
    };

    const update = await Application.updateOne(
      { id: existingApplicationId },
      {
        $push: { passportDetails: passportInfo },
        $set: {
          workPlace: getworkplace(country),
          isProcessing: true,
        },
      },
    );

    if (update.modifiedCount === 0) {
      return {
        success: false,
        error: "Application not found or update failed",
      };
    }

    return { success: true, data: update };
  } catch (error) {
    console.error("Error updating application:", error);
    return { success: false, error: "Error updating application" };
  }
};
