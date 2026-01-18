"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { generateFiveDigitNumber, getCompletionDate } from "../utils";
import { ActionResponse } from "@/actions/types";

export const createApplicationTravelAgent = async (
  groupId: string,
  noOfVisa: number,
  cost: number,
  currency: string,
  speed: string,
  entryType: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return { success: false, error: "Unauthorized" };

    const result = getCompletionDate(speed);

    const newApplication = await Application.create({
      id: groupId,
      noOfVisa,
      passportDetails: [],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: false,
      purpose: "Travel",
      job: "Freelancer",
      cost,
      currency,
      processingInfo: { speed },
      result,
      travelDuration: entryType === "singleEntry" ? 15 : 30,
      creator: {
        _id: session.user.id,
        role: session.user.role,
        companyId: session.user.companyId,
        creator: session.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return { success: true, data: newApplication._id.toString() };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Internal server error" };
  }
};
