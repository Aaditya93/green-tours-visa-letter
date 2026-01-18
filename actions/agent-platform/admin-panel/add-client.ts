"use server";

import dbConnect from "@/db/db";
import ClientList from "@/db/models/client-list";
import { ActionResponse } from "@/actions/types";

export const addClient = async (): Promise<ActionResponse<void>> => {
  try {
    await dbConnect();
    await ClientList.findOneAndUpdate(
      { agentId: "675a67b7c39e270da1c22119" },
      {
        $push: {
          clients: {
            clientId: "677a060909e1aea984af26b5",
            addedAt: new Date(),
          },
        },
      },
    );
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error adding client:", error);
    return { success: false, error: "Internal server error" };
  }
};
