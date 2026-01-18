"use server";

import dbConnect from "@/db/db";
import TravelAgentUser from "@/db/models/travelAgentUser";
import { ActionResponse } from "@/actions/types";

export const getTravelAgentUsers = async (): Promise<ActionResponse<any[]>> => {
  try {
    await dbConnect();
    const travelAgentUsers = await TravelAgentUser.find({});
    return {
      success: true,
      data: JSON.parse(JSON.stringify(travelAgentUsers)),
    };
  } catch (error) {
    console.error("Error fetching travel agent users:", error);
    return { success: false, error: "Internal server error" };
  }
};
