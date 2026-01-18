"use server";

import dbConnect from "@/db/db";
import ClientList from "@/db/models/client-list";

import { ActionResponse } from "@/actions/types";

export const getAllClientList = async (): Promise<
  ActionResponse<{ agentId: any; clients: any }[]>
> => {
  try {
    await dbConnect();
    const clientList = await ClientList.find({}).exec();

    const data = clientList
      .filter((agent) => agent.clients && agent.clients.length > 0)
      .map((agent) => ({
        agentId: agent.name,
        clients: agent.clients.map((client: any) => client.clientId),
      }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to get client list:", error);
    return { success: false, error: "Failed to get client list" };
  }
};
