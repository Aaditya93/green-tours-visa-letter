"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

/**
 * Fetches applications based on a list of passport IDs.
 */
export const getApplicationsByPassportIds = async (
  passportIds: string[],
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const applications = await Application.find({
      "passportDetails._id": { $in: passportIds },
    }).lean();

    return { success: true, data: applications };
  } catch (error) {
    console.error("Failed to get applications by passport ids:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch applications",
    };
  }
};
