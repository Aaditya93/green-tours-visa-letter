"use server";

import * as z from "zod";
import ContactForm from "@/db/models/ContactFrom";
import dbConnect from "@/db/db";
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z
    .string()
    .min(10, { message: "Please enter a valid mobile number." }),
});
export const contactUs = async (values: z.infer<typeof contactFormSchema>) => {
  await dbConnect();
  try {
    const validatedFields = contactFormSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new Error("Invalid input");
    }

    const { name, email, mobile } = validatedFields.data;

    await ContactForm.create({
      name,
      email,
      mobile,
      date: new Date(),
    });
    // Send admin mail
    //send user mail about how to apply for visa

    return { success: "Form submitted successfully" };
  } catch (error) {
    console.error("Error during contact form submission", error);
    return { error: "Something went wrong" };
  }
};
