"use server";

import dbConnect from "@/db/db";
import Company, { ICompany } from "@/db/models/company";
import { ActionResponse } from "@/actions/types";

/**
 * Fetches the visa letter pricing configurations for a specific company.
 *
 * @param companyId - The unique identifier of the company
 * @returns A promise resolving to an ActionResponse containing the company document or an error
 */
export async function getVisaLetterPriceByCompany(
  companyId: string | undefined,
): Promise<ActionResponse<ICompany>> {
  if (!companyId) {
    return { success: false, error: "Company ID is required" };
  }

  try {
    await dbConnect();

    // Find company and explicitly select necessary fields for pricing
    const company = await Company.findById(companyId).lean();

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Explicitly casting and serializing to ensure RSC compatibility
    return {
      success: true,
      data: JSON.parse(JSON.stringify(company)) as ICompany,
    };
  } catch (error) {
    console.error(`[GET_VISA_LETTER_PRICE_BY_COMPANY] Error:`, error);
    return { success: false, error: "Failed to fetch company pricing data" };
  }
}
