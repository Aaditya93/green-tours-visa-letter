"use server";

import dbConnect from "@/db/db";
import Application, { IApplication } from "@/db/models/application";
import { ActionResponse } from "@/actions/types";

export const getApplicationById = async (
  id: string,
): Promise<ActionResponse<IApplication>> => {
  try {
    await dbConnect();
    const application = await Application.findById(id);

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(application)),
    };
  } catch (error) {
    console.error("Failed to get application by ID:", error);
    return { success: false, error: "Failed to get application by ID" };
  }
};
