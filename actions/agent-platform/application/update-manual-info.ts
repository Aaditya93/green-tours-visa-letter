"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

interface ManualInfo {
  from_date: Date;
  to_date: Date;
  airport?: string;
  embassy?: string;
  duration: string;
}

export const updateApplicationManualInfoTravelAgent = async (
  existingApplicationId: string,
  manualInfo: ManualInfo,
): Promise<ActionResponse<boolean>> => {
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
      { new: true },
    );
    return { success: true, data: !!response };
  } catch (error) {
    console.error("Error updating application:", error);
    return { success: false, error: "Internal server error" };
  }
};
