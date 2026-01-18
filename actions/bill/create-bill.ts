"use server";

import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";
import Application from "@/db/models/application";
import { sendBillReadyEmail } from "@/lib/mail";
import { ActionResponse } from "@/actions/types";

/**
 * Creates a new bill for a company and links applications to it.
 */
export const createBill = async (
  company: {
    id: string;
    name: string;
    companyAddress: string;
    companyEmail: string;
  },
  applicationIds: string[],
  currency: string,
  amount: number,
  link: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();

    const bill = await Bill.create({
      companyId: company.id,
      companyName: company.name,
      companyAddress: company.companyAddress,
      companyEmail: company.companyEmail,
      applicationIds,
      amount,
      currency,
      payment: false,
      onePay: link,
      createdDate: new Date().setHours(0, 0, 0, 0),
    });

    // Update individual applications to link with the bill
    await Application.updateMany(
      { "passportDetails._id": { $in: applicationIds } },
      { $set: { "passportDetails.$[elem].billId": bill._id } },
      { arrayFilters: [{ "elem._id": { $in: applicationIds } }] },
    );

    // Send notification email
    await sendBillReadyEmail(
      company.name,
      company.companyEmail,
      bill._id.toString(),
      amount,
      currency,
      applicationIds.length,
    );

    return { success: true, data: bill._id.toString() };
  } catch (error) {
    console.error("Error creating bill:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create bill",
    };
  }
};
