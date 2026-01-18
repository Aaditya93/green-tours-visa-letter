"use server";

import { VisaLetterPrice } from "@/config/docsConfig";
import { PriceEntry } from "./types";

import { ActionResponse } from "@/actions/types";

export const getVisaPrice = async (
  entryType: "singleEntry" | "multipleEntry",
  speed: string,
): Promise<ActionResponse<number>> => {
  try {
    const priceList = VisaLetterPrice[entryType];
    if (!priceList) {
      return { success: false, error: "Invalid entry type" };
    }

    const priceEntry = priceList.find(
      (entry: PriceEntry) => entry.speed === speed,
    );
    if (!priceEntry) {
      return { success: false, error: `Invalid speed type: ${speed}` };
    }

    return { success: true, data: priceEntry.price };
  } catch (error) {
    console.error("Error getting visa price:", error);
    return { success: false, error: "Error getting visa price" };
  }
};
