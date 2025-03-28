"use server";

import * as z from "zod";
import ContactForm from "@/db/models/ContactFrom";
import { getTranslations } from "next-intl/server";
import { sendNewAgentInterestEmail } from "@/lib/mail";

export const contactUs = async (values) => {
  const t = await getTranslations("contactUs");
  const contactFormSchema = z.object({
    name: z.string().min(2, { message: t("error") }),
    email: z.string().email({ message: t("error1") }),
    mobile: z.string().min(5, { message: t("error2") }),
  });
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
    await sendNewAgentInterestEmail(name, email, mobile);

    return { success: "Form submitted successfully" };
  } catch (error) {
    console.error("Error during contact form submission", error);
    return { error: "Something went wrong" };
  }
};
