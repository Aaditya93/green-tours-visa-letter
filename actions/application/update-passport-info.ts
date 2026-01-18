"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { UpdatePassportDetails } from "./types";

import { ActionResponse } from "@/actions/types";

export const updateApplicationPassportInfo = async (
  existingApplicationId: string,
  passportId: string,
  passportDetails: UpdatePassportDetails,
): Promise<ActionResponse<boolean>> => {
  try {
    await dbConnect();

    const result = await Application.findOneAndUpdate(
      {
        _id: existingApplicationId,
        "passportDetails._id": passportId,
      },
      {
        $set: {
          "passportDetails.$.fullName": passportDetails.full_name,
          "passportDetails.$.birthday": passportDetails.birthday,
          "passportDetails.$.sex": passportDetails.sex,
          "passportDetails.$.nationalityCurrent":
            passportDetails.current_nationality,
          "passportDetails.$.passportNumber": passportDetails.passport_number,
          "passportDetails.$.originalNationality":
            passportDetails.original_nationality,
          "passportDetails.$.dateOfExpiry": passportDetails.dateOfExpiry,
        },
      },
      { new: true },
    );

    if (!result) {
      return { success: false, error: "Application or passport not found" };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error updating passport info:", error);
    return { success: false, error: "Error updating passport info" };
  }
};
