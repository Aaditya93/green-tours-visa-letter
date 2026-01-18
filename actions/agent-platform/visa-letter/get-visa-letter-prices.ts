"use server";

import dbConnect from "@/db/db";
import Company from "@/db/models/company";
import { ActionResponse } from "@/actions/types";

export const getVisaLetterPrices = async (): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const result = await Company.find({});
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Error fetching all visa letter prices:", error);
    return { success: false, error: "Internal server error" };
  }
};
