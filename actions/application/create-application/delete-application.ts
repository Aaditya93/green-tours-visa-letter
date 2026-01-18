"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { deleteS3Folder } from "../delete-application/delete-folder";

import { ActionResponse } from "@/actions/types";

export const deleteApplication = async (
  id: string,
  key: string,
): Promise<ActionResponse<boolean>> => {
  try {
    await dbConnect();
    await Application.findByIdAndDelete(id);
    await deleteS3Folder(key);
    revalidatePath("/application");
    return { success: true, data: true };
  } catch (error) {
    console.error("Failed to delete application:", error);
    return { success: false, error: "Failed to delete application" };
  }
};

export const deleteTravelAgentApplications = async (): Promise<
  ActionResponse<boolean>
> => {
  try {
    await dbConnect();
    await Application.deleteMany({
      "creator.role": "TravelAgent",
    });
    return { success: true, data: true };
  } catch (error) {
    console.error("Failed to delete travel agent applications:", error);
    return {
      success: false,
      error: "Failed to delete travel agent applications",
    };
  }
};
