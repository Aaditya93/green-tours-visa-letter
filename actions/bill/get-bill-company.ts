"use server";

import dbConnect from "@/db/db";
import Bill, { IBill } from "@/db/models/bill";
import { ActionResponse } from "@/actions/types";

/**
 * Fetches bills for a specific company within a date range.
 */
export const getBillsByCompany = async (
  companyId: string,
  from: Date,
  to: Date,
): Promise<ActionResponse<IBill[]>> => {
  try {
    await dbConnect();
    const bills = await Bill.find({
      companyId: companyId,
      createdDate: { $gte: from, $lte: to },
    }).lean<IBill[]>();

    return { success: true, data: bills };
  } catch (error) {
    console.error("Error fetching bills:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bills",
    };
  }
};
