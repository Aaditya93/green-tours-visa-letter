"use server";

import dbConnect from "@/db/db";
import VisaLetter from "@/db/models/visaLetter";
import { ActionResponse } from "@/actions/types";

/**
 * Fetches a visa letter by ID.
 */
export const getVisaLetterById = async (
  id: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const visaLetter = await VisaLetter.findById(id).lean();

    if (!visaLetter) {
      return { success: false, error: "Visa letter not found" };
    }

    return { success: true, data: visaLetter };
  } catch (error) {
    console.error("Failed to get visa letter:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get visa letter",
    };
  }
};
