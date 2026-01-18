"use server";

import { z } from "zod";
import dbConnect from "@/db/db";
import ContactForm from "@/db/models/ContactFrom";
import { getTranslations } from "next-intl/server";
import { sendNewAgentInterestEmail } from "@/lib/mail";
import { ActionResponse } from "@/actions/types";
import { getContactFormSchema } from "./schema";

/**
 * Validates and submits the contact form.
 * Stores the lead in the database and sends an internal notification email.
 */
export async function submitContactForm(
  values: unknown,
): Promise<ActionResponse<null>> {
  const t = await getTranslations("contactUs");

  const contactFormSchema = getContactFormSchema(t);

  try {
    await dbConnect();

    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid input fields",
      };
    }

    const { name, email, mobile } = validatedFields.data;

    // Save lead to database
    await ContactForm.create({
      name,
      email,
      mobile,
      date: new Date(),
    });

    // Send email notification
    await sendNewAgentInterestEmail(name, email, mobile);

    return {
      success: true,
      data: null,
      message: "Form submitted successfully",
    };
  } catch (error) {
    console.error("Error during contact form submission:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
