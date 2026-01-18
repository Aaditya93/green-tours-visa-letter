"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

/**
 * Marks applications as 'Delivered' once the visa letter is sent.
 */
export const markApplicationsAsSent = async (
  passportIds: string[],
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();

    await Application.updateMany(
      { "passportDetails._id": { $in: passportIds } },
      { $set: { "passportDetails.$[elem].stage": "Delivered" } },
      { arrayFilters: [{ "elem._id": { $in: passportIds } }] },
    );

    return {
      success: true,
      data: "Applications have been marked as sent.",
    };
  } catch (error) {
    console.error("Failed to mark applications as sent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark applications as sent.",
    };
  }
};
