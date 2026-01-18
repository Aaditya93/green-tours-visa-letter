"use server";

import { auth } from "@/auth";
import User from "@/db/models/User";
import dbConnect from "@/db/db";

import { ActionResponse } from "@/actions/types";

export const getUserTravelAgent = async (): Promise<
  ActionResponse<{ username: string | null | undefined }[]>
> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user.companyId) return { success: true, data: [] };

    const users = await User.find({
      role: "TravelAgent",
      companyId: session.user.companyId,
    }).exec();

    return {
      success: true,
      data: users.map((user) => ({ username: user.name })),
    };
  } catch (error) {
    console.error("Error getting travel agent users:", error);
    return { success: false, error: "Error getting travel agent users" };
  }
};
