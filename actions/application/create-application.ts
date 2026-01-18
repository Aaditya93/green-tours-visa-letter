"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { generateFiveDigitNumber } from "./utils";
import { ActionResponse } from "@/actions/types";

export const createApplication = async (
  groupId: string,
  noOfVisa: number,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const newApplication = await Application.create({
      id: groupId,
      noOfVisa: noOfVisa,
      passportDetails: [],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: false,
      purpose: "Travel",
      job: "Freelancer",
      creator: {
        _id: session.user.id,
        role: session.user.role,
        creator: session.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    return { success: true, data: newApplication._id.toString() };
  } catch (error) {
    console.error("Failed to create application", error);
    return { success: false, error: "Failed to create application" };
  }
};
