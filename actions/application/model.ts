"use server";
import Application from "@/db/models/application";
import dbConnect from "@/db/db";
import { revalidatePath } from "next/cache";
import { deleteS3Folder } from "../upload/aws";

export const getApplicationById = async (id: string) => {
  try {
    await dbConnect();
    const application = await Application.findById(id);
    if (application) {
      return application;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to get application", error);
  }
};

export const deleteApplication = async (id: string, key: string) => {
  try {
    await dbConnect();
    await Application.findByIdAndDelete(id);
    await deleteS3Folder(key);
    revalidatePath("/application");
    return true;
  } catch (error) {
    console.error("Failed to delete application ", error);
    return false;
  }
};
