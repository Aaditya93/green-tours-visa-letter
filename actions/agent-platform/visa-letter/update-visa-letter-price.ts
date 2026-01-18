"use server";

import dbConnect from "@/db/db";
import VisaLetterPrice, {
  IVisaLetterPrice,
} from "@/db/models/visa-letter-price";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/actions/types";

export const updateVisaLetterPrice = async (
  Country: string,
  data: Partial<IVisaLetterPrice>,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();
    await VisaLetterPrice.findOneAndUpdate({ Country }, { ...data });

    revalidatePath(`/agent-platform/visa-letter-price/${Country}`);

    return {
      success: true,
      data: "VisaLetterPrice data updated successfully",
    };
  } catch (error) {
    console.error("Error updating VisaLetterPrice data:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};
