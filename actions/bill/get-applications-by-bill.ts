"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

/**
 * Fetches all applications associated with a specific bill ID.
 */
export const getApplicationsByBillId = async (
  id: string,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const applications = await Application.find({
      "passportDetails.billId": id,
    }).lean();

    return { success: true, data: applications };
  } catch (error) {
    console.error("Error fetching applications by bill ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch applications",
    };
  }
};
