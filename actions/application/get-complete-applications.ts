"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { convertToApplications } from "@/lib/data";
import { ActionResponse } from "@/actions/types";

export const getCompleteApplications = async (): Promise<
  ActionResponse<any[]>
> => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const query: any = {
      isCompleted: true,
      createdAt: { $gte: threeMonthsAgo },
    };

    if (session.user.role !== "Admin") {
      query["creator._id"] = session.user.id;
    }

    const applications = await Application.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    const data = await convertToApplications(applications);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get complete applications:", error);
    return { success: false, error: "Failed to get complete applications" };
  }
};

export const getCompleteApplicationsTravelAgent = async (): Promise<
  ActionResponse<any[]>
> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.companyId) {
      return { success: false, error: "User has no company context" };
    }

    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session.user.companyId,
    })
      .lean()
      .sort({ createdAt: -1 })
      .limit(150)
      .exec();

    const data = await convertToApplications(applications);
    return { success: true, data };
  } catch (error) {
    console.error(
      "Failed to get complete applications for travel agent:",
      error,
    );
    return {
      success: false,
      error: "Failed to get complete applications for travel agent",
    };
  }
};
