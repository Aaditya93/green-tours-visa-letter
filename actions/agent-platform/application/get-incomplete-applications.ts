"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

export const getIncompleteApplicationsTravelAgent = async (): Promise<
  ActionResponse<any[]>
> => {
  try {
    const session = await auth();
    if (!session?.user?.companyId)
      return { success: false, error: "Unauthorized or company ID missing" };

    await dbConnect();

    const applications = await Application.find({
      isCompleted: false,
      isProcessing: true,
      "creator.companyId": session.user.companyId,
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return { success: true, data: JSON.parse(JSON.stringify(applications)) };
  } catch (error) {
    console.error("Failed to get incomplete applications:", error);
    return { success: false, error: "Internal server error" };
  }
};
