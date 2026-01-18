"use server";

import dbConnect from "@/db/db";
import Company from "@/db/models/company";
import { ActionResponse } from "@/actions/types";

export interface SimplifiedCompany {
  name: string;
  id: string;
  companyAddress: string;
  companyEmail: string;
}

/**
 * Fetches all companies simplified for billing selections.
 */
export const getAllCompaniesForBilling = async (): Promise<
  ActionResponse<SimplifiedCompany[]>
> => {
  try {
    await dbConnect();
    const companies = await Company.find({}).lean().exec();

    const formattedCompanies = companies.map((company: any) => ({
      name: company.name,
      id: company._id.toString(),
      companyAddress: company.address,
      companyEmail: company.email,
    }));

    return { success: true, data: formattedCompanies };
  } catch (error) {
    console.error("Error fetching companies for billing:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch companies",
    };
  }
};
