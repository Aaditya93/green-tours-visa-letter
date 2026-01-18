"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ManualInfo } from "./types";

import { ActionResponse } from "@/actions/types";

export const updateApplicationManualInfo = async (
  existingApplicationId: string,
  manualInfo: ManualInfo,
): Promise<ActionResponse<boolean>> => {
  try {
    await dbConnect();

    const response = await Application.findByIdAndUpdate(
      existingApplicationId,
      {
        $set: {
          duration: manualInfo.duration,
          "processingInfo.speed": manualInfo.speed,
          "processingInfo.notes": manualInfo.note,
          "creator.handleBy": manualInfo.handled_by,
          "entryDetails.fromDate": manualInfo.from_date,
          "entryDetails.toDate": manualInfo.to_date,
          result: manualInfo.result,
          placeOfIssue: manualInfo.airport || manualInfo.embassy,
          isCompleted: true,
          "passportDetails.$[].stage": manualInfo.stage,
        },
      },
      { new: true },
    );

    if (!response) {
      return { success: false, error: "Application not found" };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error updating manual application info:", error);
    return { success: false, error: "Error updating manual application info" };
  }
};
