"use server";

import TravelAgentUser from "@/db/models/travelAgentUser";
import * as z from "zod";
import dbConnect from "@/db/db";
import { TravelAgentRegisterSchema } from "@/app/schemas";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";

export const registerTravelAgent = async (
  values: z.infer<typeof TravelAgentRegisterSchema>
) => {
  try {
    await dbConnect();
    const validatedFields = TravelAgentRegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
      };
    }

    const { name, email, password, company, phoneNumber, address, country } =
      validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return {
        error: "Email already registered",
      };
    }

    await TravelAgentUser.create({
      name,
      email,
      password: hashedPassword,
      isAprrove: false,
      company,
      address,
      phoneNumber,
      country,
      isApprove: false,
    });

    return {
      success:
        "Our team will verify your details and notify you via email once approved.",
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      error: "Internal server error",
    };
  }
};
