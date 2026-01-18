"use server";

import dbConnect from "@/db/db";
import ClientList from "@/db/models/client-list";
import { ActionResponse } from "@/actions/types";

export const createClientList = async (): Promise<ActionResponse<void>> => {
  try {
    await dbConnect();
    await ClientList.create({
      name: "Olivia",
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error creating client list:", error);
    return { success: false, error: "Internal server error" };
  }
};
