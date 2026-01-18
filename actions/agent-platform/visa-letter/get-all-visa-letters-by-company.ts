"use server";

import dbConnect from "@/db/db";
import VisaLetter from "@/db/models/visaLetter";
import { ActionResponse } from "@/actions/types";

export const getAllVisaLettersByCompany = async (
  id: string,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const visaLetter = await VisaLetter.find({ companyId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { success: true, data: JSON.parse(JSON.stringify(visaLetter)) };
  } catch (error) {
    console.error("Error fetching visa letters by company:", error);
    return { success: false, error: "Internal server error" };
  }
};
