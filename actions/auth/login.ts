"use server";

import { LoginSchema } from "@/app/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import generateToken from "@/lib/token";
import { getUserByEmail } from "@/db/models/User";
import { sendVerificationEmail } from "@/lib/mail";

import { ActionResponse } from "@/actions/types";
import dbConnect from "@/db/db";

export const login = async (
  values: z.infer<typeof LoginSchema>,
): Promise<ActionResponse<any>> => {
  await dbConnect();

  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid input fields" };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { success: false, error: "User not found" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateToken(existingUser.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: true, data: null, message: "Confirmation email sent" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: true, data: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { success: false, error: "Invalid credentials" };
        }
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    throw error;
  }
};
