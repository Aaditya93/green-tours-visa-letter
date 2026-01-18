"use server";

import TravelAgentUser from "@/db/models/travelAgentUser";
import * as z from "zod";
import dbConnect from "@/db/db";
import { TravelAgentRegisterSchema } from "@/app/schemas";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { ActionResponse } from "@/actions/types";

export const registerTravelAgent = async (
  values: z.infer<typeof TravelAgentRegisterSchema>,
): Promise<ActionResponse<string>> => {
  const t = await getTranslations("registerTravelAgent");
  try {
    await dbConnect();
    const validatedFields = TravelAgentRegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid input",
      };
    }

    const { name, email, password, company, phoneNumber, address, country } =
      validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return {
        success: false,
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
    });

    return {
      success: true,
      data: t("success"),
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};
