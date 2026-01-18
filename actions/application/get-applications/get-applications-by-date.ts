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

export const getCompleteApplicationsDate = async (
  fromDate: Date,
  toDate: Date,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user) return { success: false, error: "Unauthorized" };

    const { startDate, endDate } = getTimeBoundaries(fromDate, toDate);

    const query: any = {
      isCompleted: true,
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (session.user.role !== "Admin") {
      query["creator._id"] = session.user.id;
    }

    const applications = await Application.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const data = await convertToApplications(applications);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get applications by date:", error);
    return { success: false, error: "Failed to get applications by date" };
  }
};

export const getCompleteApplicationsDateTravelAgent = async (
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
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const data = await convertToApplications(applications);
    return { success: true, data };
  } catch (error) {
    console.error(
      "Failed to get applications by date for travel agent:",
      error,
    );
    return {
      success: false,
      error: "Failed to get applications by date for travel agent",
    };
  }
};
