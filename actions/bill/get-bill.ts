"use server";

import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";
import { ActionResponse } from "@/actions/types";
import { IBill } from "@/db/models/bill";

/**
 * Fetches a single bill by its ID.
 */
export const getBillById = async (
  id: string,
): Promise<ActionResponse<IBill>> => {
  try {
    await dbConnect();
    const bill = await Bill.findById(id).lean<IBill>();

    if (!bill) {
      return { success: false, error: "Bill not found" };
    }

    return { success: true, data: bill };
  } catch (error) {
    console.error("Error fetching bill by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bill",
    };
  }
};
