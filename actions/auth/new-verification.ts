"use server";
import { getVerificationTokenByToken } from "@/db/models/EmailVerification";
import User, { getUserByEmail } from "@/db/models/User";
import dbConnect from "@/db/db";
import EmailVerification from "@/db/models/EmailVerification";

import { ActionResponse } from "@/actions/types";

export const newVerification = async (
  token: string,
): Promise<ActionResponse<any>> => {
  await dbConnect();
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { success: false, error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { success: false, error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { success: false, error: "Email doesn't exist" };
  }

  await User.findByIdAndUpdate(existingUser.id, { emailVerified: new Date() });
  await EmailVerification.findByIdAndDelete(existingToken.id);

  return { success: true, data: null, message: "Email verified" };
};
