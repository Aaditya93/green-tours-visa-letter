"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import ClientList from "@/db/models/client-list";
import Company from "@/db/models/company";
import TravelAgentUser from "@/db/models/travelAgentUser";
import User from "@/db/models/User";
import { sendTravelAgentApprovalEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/actions/types";

export const approveTravelAgent = async (
  id: string,
  staff: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const travelAgentUser = await TravelAgentUser.findById(id);
    if (!travelAgentUser) {
      return { success: false, error: "Travel agent user not found" };
    }

    const existingCompany = await Company.findOne({
      name: travelAgentUser.company,
    });

    if (!existingCompany) {
      const company = await Company.create({
        name: travelAgentUser.company,
        email: travelAgentUser.email,
        phoneNumber: travelAgentUser.phoneNumber,
        address: travelAgentUser.address,
        country: travelAgentUser.country,
        clientManager: staff,
      });

      const newUser = new User({
        name: travelAgentUser.name,
        email: travelAgentUser.email,
        password: travelAgentUser.password,
        role: "TravelAgent",
        image: null,
        emailVerified: new Date(),
        companyId: company._id,
      });
      await newUser.save();

      await ClientList.findOneAndUpdate(
        { name: staff },
        { $push: { clients: { clientId: company._id, addedAt: new Date() } } },
      );

      await Company.findOneAndUpdate(
        { _id: company._id },
        { $push: { employeeIds: newUser._id } },
      );

      await sendTravelAgentApprovalEmail(
        travelAgentUser.name,
        travelAgentUser.email,
      );
      await travelAgentUser.deleteOne();

      revalidatePath("/agent-platform/admin-panel");
      return {
        success: true,
        data: `Add Visa Letter Prices for ${company.name}`,
      };
    } else {
      const newUser = new User({
        name: travelAgentUser.name,
        email: travelAgentUser.email,
        password: travelAgentUser.password,
        role: "TravelAgent",
        image: null,
        emailVerified: new Date(),
        companyId: existingCompany._id,
      });
      await newUser.save();

      await Company.findOneAndUpdate(
        { _id: existingCompany._id },
        { $push: { employeeIds: newUser._id } },
      );

      await sendTravelAgentApprovalEmail(
        travelAgentUser.name,
        travelAgentUser.email,
      );
      await travelAgentUser.deleteOne();

      revalidatePath("/agent-platform/admin-panel");
      return { success: true, data: "Travel agent approved successfully" };
    }
  } catch (error) {
    console.error("Error approving travel agent:", error);
    return { success: false, error: "Internal server error" };
  }
};
