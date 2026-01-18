"use server";

import dbConnect from "@/db/db";
import VisaLetterPrice from "@/db/models/visa-letter-price";
import { ActionResponse } from "@/actions/types";

export const getVisaLetterPrice = async (
  Code: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const result = await VisaLetterPrice.findOne({ Code });
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Error fetching VisaLetterPrice data:", error);
    return { success: false, error: "Internal server error" };
  }
};
