"use server";

import dbConnect from "@/db/db";
import ImmigrationCost from "@/db/models/immigration-cost";
import { ActionResponse } from "@/actions/types";

export const createImmigrationCost = async (): Promise<
  ActionResponse<void>
> => {
  try {
    await dbConnect();
    await ImmigrationCost.create({
      name: "Ho Chi Minh",
      lastUpdated: new Date(),
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error inserting ImmigrationCost data:", error);
    return { success: false, error: "Internal server error" };
  }
};
