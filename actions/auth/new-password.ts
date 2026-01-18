"use server";
import { PasswordResetSchema } from "@/app/schemas";
import * as z from "zod";
import PasswordReset, {
  getPasswordResetTokenByToken,
} from "@/db/models/PasswordToken";
import User, { getUserByEmail } from "@/db/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/db/db";

import { ActionResponse } from "@/actions/types";

export const newPassword = async (
  values: z.infer<typeof PasswordResetSchema>,
  token?: string | null,
): Promise<ActionResponse<any>> => {
  await dbConnect();
  if (!token) {
    return { success: false, error: "Missing token" };
  }

  const validatedFields = PasswordResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid input fields" };
  }

  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { success: false, error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { success: false, error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { success: false, error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.findByIdAndUpdate(existingUser.id, { password: hashedPassword });
  await PasswordReset.findByIdAndDelete(existingToken.id);

  return { success: true, data: null, message: "Password updated" };
};
