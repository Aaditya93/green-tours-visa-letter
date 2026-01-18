"use server";

import { RegisterSchema } from "@/app/schemas";
import * as z from "zod";
import { registerUser } from "@/db/models/User";
import generateToken from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

import dbConnect from "@/db/db";
import { ActionResponse } from "@/actions/types";

export const register = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<ActionResponse<any>> => {
  await dbConnect();

  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid input fields" };
  }

  const { name, email, password } = validatedFields.data;

  const result = await registerUser({ name, email, password });

  if (result.error) {
    return { success: false, error: result.error };
  }

  const verificationToken = await generateToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: true, data: null, message: "Confirmation email sent" };
};
