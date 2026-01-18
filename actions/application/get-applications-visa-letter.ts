"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { convertToApplications } from "@/lib/data";
import { convertToPassportBillings } from "./utils";
import { ActionResponse } from "@/actions/types";

export const getApplicationsVisaLetter = async (
  companyId: string,
  startDate: Date,
  endDate: Date,
): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();

    const formattedStartDate = new Date(startDate);
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = new Date(endDate);
    formattedEndDate.setHours(23, 59, 59, 999);

    const applications = await Application.find({
      "creator.companyId": companyId,
      passportDetails: {
        $elemMatch: {
          stage: "Processing",
        },
      },
      isCompleted: true,
      createdAt: {
        $gte: formattedStartDate,
        $lte: formattedEndDate,
      },
    })
      .lean()
      .sort({ createdAt: -1 });

    const formattedApplications = await convertToApplications(applications);
    const data = await convertToPassportBillings(formattedApplications);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to get applications for visa letter:", error);
    return {
      success: false,
      error: "Failed to get applications for visa letter",
    };
  }
};
