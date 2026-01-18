"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { ActionResponse } from "@/actions/types";
import {
  serializeIApplication,
  SerializabledApplication,
} from "@/config/serialize";

export const getApplicationById = async (
  id: string,
): Promise<ActionResponse<SerializabledApplication>> => {
  try {
    await dbConnect();
    const application = await Application.findById(id);

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    return {
      success: true,
      data: serializeIApplication(application) as SerializabledApplication,
    };
  } catch (error) {
    console.error("Failed to get application by ID:", error);
    return { success: false, error: "Failed to get application by ID" };
  }
};
