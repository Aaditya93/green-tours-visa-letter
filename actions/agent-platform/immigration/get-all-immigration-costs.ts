"use server";

import dbConnect from "@/db/db";
import ImmigrationCost from "@/db/models/immigration-cost";
import { ActionResponse } from "@/actions/types";

export const getImmigrationCostAll = async (): Promise<
  ActionResponse<any[]>
> => {
  try {
    await dbConnect();
    const result = await ImmigrationCost.find({}).lean();
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Error getting all ImmigrationCost data:", error);
    return { success: false, error: "Internal server error" };
  }
};
