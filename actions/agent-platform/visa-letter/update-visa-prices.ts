"use server";

import Company from "@/db/models/company";
import { z } from "zod";
import { ActionResponse } from "@/actions/types";

const updateSchema = z.object({
  _id: z.string(),
  Prices: z.object({
    singleEntry: z.array(
      z.object({
        speed: z.string(),
        price: z.number(),
      }),
    ),
    multipleEntry: z.array(
      z.object({
        speed: z.string(),
        price: z.number(),
      }),
    ),
  }),
  currency: z.string(),
});

export const updateVisaPrices = async (
  formData: z.infer<typeof updateSchema>,
): Promise<ActionResponse<boolean>> => {
  try {
    const validatedData = updateSchema.parse(formData);

    await Company.findByIdAndUpdate(
      validatedData._id,
      {
        $set: {
          visaLetterPrices: [
            {
              prices: validatedData.Prices,
              currency: validatedData.currency,
            },
          ],
        },
      },
      { new: true },
    );

    return { success: true, data: true };
  } catch (error) {
    console.error("Error updating visa prices:", error);
    return { success: false, error: "Internal server error" };
  }
};
