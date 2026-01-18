"use server";

import dbConnect from "@/db/db";
import TravelAgentUser from "@/db/models/travelAgentUser";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/actions/types";

export const rejectTravelAgent = async (
  id: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const travelAgentUser = await TravelAgentUser.findById(id);
    if (!travelAgentUser) {
      return { success: false, error: "Travel agent user not found" };
    }

    await travelAgentUser.deleteOne();
    revalidatePath("/agent-platform/admin-panel");

    return { success: true, data: "Travel agent rejected successfully" };
  } catch (error) {
    console.error("Error rejecting travel agent:", error);
    return { success: false, error: "Internal server error" };
  }
};
