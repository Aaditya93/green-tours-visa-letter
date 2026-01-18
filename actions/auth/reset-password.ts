"use server";

import { ResetSchema } from "@/app/schemas";
import { getUserByEmail } from "@/db/models/User";
import * as z from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordToken } from "@/lib/token";
import dbConnect from "@/db/db";

import { ActionResponse } from "@/actions/types";

export const resetPassword = async (
  values: z.infer<typeof ResetSchema>,
): Promise<ActionResponse<any>> => {
  await dbConnect();

  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid input fields" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { success: false, error: "User not found" };
  }

  const passwordToken = await generatePasswordToken(email);
  await sendPasswordResetEmail(passwordToken.email, passwordToken.token);

  return { success: true, data: null, message: "Password reset email sent" };
};
