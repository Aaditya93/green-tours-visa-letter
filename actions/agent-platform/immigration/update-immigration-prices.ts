"use server";

import ImmigrationCost from "@/db/models/immigration-cost";
import { ActionResponse } from "@/actions/types";

export const updateImmigrationPrices = async (
  _id: string,
  formData: any,
): Promise<ActionResponse<boolean>> => {
  try {
    const result = await ImmigrationCost.findByIdAndUpdate(
      _id,
      {
        $set: {
          visaLetterPrices: {
            currency: formData.currency,
            prices: formData.prices,
          },
        },
      },
      { new: true },
    );
    return { success: true, data: !!result };
  } catch (error) {
    console.error("Error updating immigration visa prices:", error);
    return { success: false, error: "Internal server error" };
  }
};
