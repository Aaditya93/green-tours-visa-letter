"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

export const getCompleteApplicationsTravelAgentBilling = async (
  fromDate: Date,
  toDate: Date,
): Promise<ActionResponse<any[]>> => {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await dbConnect();

    const startDate = new Date(
      fromDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    );
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      toDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    );
    endDate.setHours(23, 59, 59, 999);

    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session.user.companyId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { success: true, data: JSON.parse(JSON.stringify(applications)) };
  } catch (error) {
    console.error("Failed to get billing applications:", error);
    return { success: false, error: "Internal server error" };
  }
};
