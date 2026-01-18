"use server";

import dbConnect from "@/db/db";
import ImmigrationCost from "@/db/models/immigration-cost";
import { ActionResponse } from "@/actions/types";

export const getImmigrationCostById = async (
  id: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const response = await ImmigrationCost.findById(id).lean();
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (error) {
    console.error("Error getting ImmigrationCost data by ID:", error);
    return { success: false, error: "Internal server error" };
  }
};
