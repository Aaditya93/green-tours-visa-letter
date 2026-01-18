"use server";

import dbConnect from "@/db/db";
import Company from "@/db/models/company";
import { ActionResponse } from "@/actions/types";

export const getVisaLetterPriceByCompany = async (
  id: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const result = await Company.findById(id);
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Error fetching visa letter price by company:", error);
    return { success: false, error: "Internal server error" };
  }
};
