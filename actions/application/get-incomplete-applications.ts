"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";
import {
  serializeIApplication,
  SerializabledApplication,
} from "@/config/serialize";

export const getIncompleteApplications = async (): Promise<
  ActionResponse<SerializabledApplication[]>
> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const query: any = {
      isCompleted: false,
      isProcessing: true,
    };

    if (session.user.role !== "Admin") {
      query["creator._id"] = session.user.id;
    }

    const applications = await Application.find(query)
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      data: serializeIApplication(applications) as SerializabledApplication[],
    };
  } catch (error) {
    console.error("Failed to get incomplete applications:", error);
    return { success: false, error: "Failed to get incomplete applications" };
  }
};
