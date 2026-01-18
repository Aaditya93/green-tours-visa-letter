"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

export const getCompleteApplicationsTravelAgent = async (): Promise<
  ActionResponse<any[]>
> => {
  try {
    const session = await auth();
    if (!session?.user?.companyId)
      return { success: false, error: "Unauthorized or company ID missing" };

    await dbConnect();

    const applications = await Application.find({
      isCompleted: true,
      isProcessing: true,
      "passportDetails.0.stage": "Delivered",
      "creator.companyId": session.user.companyId,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { success: true, data: JSON.parse(JSON.stringify(applications)) };
  } catch (error) {
    console.error("Failed to get complete applications:", error);
    return { success: false, error: "Internal server error" };
  }
};
