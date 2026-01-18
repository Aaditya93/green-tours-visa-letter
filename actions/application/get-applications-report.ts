"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { convertToApplications } from "@/lib/data";

import { ActionResponse } from "@/actions/types";

const getTimeBoundaries = (fromDate: Date, toDate: Date) => {
  const startDate = new Date(
    fromDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(
    toDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

export const getCompleteApplicationsReportPage = async (
  fromDate: Date,
  toDate: Date,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (session?.user.role === "Admin" || session?.user.role === "Employee") {
      const { startDate, endDate } = getTimeBoundaries(fromDate, toDate);

      const applications = await Application.find({
        isCompleted: true,
        createdAt: { $gte: startDate, $lte: endDate },
      })
        .lean()
        .sort({ createdAt: -1 })
        .exec();

      const data = await convertToApplications(applications);
      return { success: true, data };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error("Failed to get report page applications:", error);
    return { success: false, error: "Failed to get report page applications" };
  }
};

export const getCompleteApplicationsReportPageTravelAgent = async (
  fromDate: Date,
  toDate: Date,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.companyId)
      return { success: false, error: "No company context" };

    const { startDate, endDate } = getTimeBoundaries(fromDate, toDate);

    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session.user.companyId,
      "creator.role": "TravelAgent",
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const data = await convertToApplications(applications);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get report page for travel agent:", error);
    return {
      success: false,
      error: "Failed to get report page for travel agent",
    };
  }
};
