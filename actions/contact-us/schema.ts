import { z } from "zod";

export const getContactFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, { message: t("error") }),
    email: z.string().email({ message: t("error1") }),
    mobile: z.string().min(5, { message: t("error2") }),
  });

export type ContactFormData = z.infer<ReturnType<typeof getContactFormSchema>>;
