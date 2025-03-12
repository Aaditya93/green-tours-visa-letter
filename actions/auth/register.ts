"use server";

import { RegisterSchema } from "@/app/schemas";
import * as z from "zod";
import { registerUser } from "@/db/models/User";
import generateToken from "@/lib/token";
import { sendVarificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate input with Zod schema

  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid input");
  }

  const { name, email, password } = validatedFields.data;


  const result = await registerUser({ name, email, password });

  // if(result.success){
  //   await login({ email, password });
  // }
  const verificationToken = await generateToken(email);

  await sendVarificationEmail(verificationToken.email, verificationToken.token);

  return result;
};
