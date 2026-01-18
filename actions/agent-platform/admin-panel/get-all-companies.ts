"use server";

import dbConnect from "@/db/db";
import Company from "@/db/models/company";
import { ActionResponse } from "@/actions/types";

export interface SimplifiedCompany {
  name: string;
  id: string;
}

export const getAllCompanies = async (): Promise<
  ActionResponse<SimplifiedCompany[]>
> => {
  try {
    await dbConnect();
    const companies = await Company.find({}).select("_id name").lean().exec();

    return {
      success: true,
      data: companies.map((company) => ({
        name: company.name,
        id: (company as any)._id.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching all companies:", error);
    return { success: false, error: "Internal server error" };
  }
};
