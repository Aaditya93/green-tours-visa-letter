"use server";
import TravelAgentUser from "@/db/models/travelAgentUser";
import dbConnect from "@/db/db";
import { revalidatePath } from "next/cache";
import User from "@/db/models/User";
import { sendTravelAgentApprovalEmail } from "@/lib/mail";
import ClientList from "@/db/models/client-list";
import { auth } from "@/auth";
import Company from "@/db/models/company";
export const getTravelAgentUsers = async () => {
  try {
    await dbConnect();
    const travelAgentUsers = await TravelAgentUser.find({});
    return travelAgentUsers;
  } catch (error) {
    console.error("Error during fetching travel agent users:", error);
    return { error: "Internal server error" };
  }
};

export const regjectTravelAgent = async (id: string) => {
  try {
    await dbConnect();
    const travelAgentUser = await TravelAgentUser.findById(id);
    if (!travelAgentUser) {
      return { error: "Travel agent user not found" };
    }

    await travelAgentUser.deleteOne();
    revalidatePath("/agent-platform/admin-panel");
    return { success: "Travel agent rejected successfully" };
  } catch (error) {
    console.error("Error during rejecting travel agent user:", error);
    return { error: "Internal server error" };
  }
};

export const approveTravelAgent = async (id: string, staff: string) => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const travelAgentUser = await TravelAgentUser.findById(id);

    if (!travelAgentUser) {
      return { error: "Travel agent user not found" };
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
        { $push: { clients: { clientId: company._id, addedAt: new Date() } } }
      );

      await Company.findOneAndUpdate(
        { _id: company._id },
        { $push: { employeeIds: newUser._id } }
      );

      await sendTravelAgentApprovalEmail(
        travelAgentUser.name,
        travelAgentUser.email
      );
      await travelAgentUser.deleteOne();

      revalidatePath("/agent-platform/admin-panel");
      return { success: `Add Visa Letter Prices for ${company.name} ` };
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
        { $push: { employeeIds: newUser._id } }
      );
      await sendTravelAgentApprovalEmail(
        travelAgentUser.name,
        travelAgentUser.email
      );
      await travelAgentUser.deleteOne();

      revalidatePath("/agent-platform/admin-panel");
      return { success: "Travel agent approved successfully" };
    }
  } catch (error) {
    console.error("Error during approving travel agent user:", error);
    return { error: "Internal server error" };
  }
};

export const addClient = async () => {
  try {
    await dbConnect();
    const result = await ClientList.findOneAndUpdate(
      { agentId: "675a67b7c39e270da1c22119" },
      {
        $push: {
          clients: {
            clientId: "677a060909e1aea984af26b5",
            addedAt: new Date(),
          },
        },
      }
    );
    console.log(result);
  } catch (error) {
    console.error("Error during adding client:", error);
    return { error: "Internal server error" };
  }
};

export const createClientList = async () => {
  try {
    await dbConnect();
    const result = await ClientList.create({
      name: "Olivia",
    });
    console.log(result);
  } catch (error) {
    console.error("Error during creating client list:", error);
    return { error: "Internal server error" };
  }
};
