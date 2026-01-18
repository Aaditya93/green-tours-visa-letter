"use server";

import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";
import Application from "@/db/models/application";
import { sendPaymentConfirmationEmail } from "@/lib/mail";
import { ActionResponse } from "@/actions/types";

/**
 * Marks a bill as paid, updates associated applications, and sends a confirmation email.
 */
export const markBillAsPaid = async (
  billId: string,
  noOfApplications: number,
  invoiceNumber: string,
): Promise<ActionResponse<boolean>> => {
  try {
    await dbConnect();

    const bill = await Bill.findById(billId);
    if (!bill) {
      return { success: false, error: "Bill not found" };
    }

    await Bill.findByIdAndUpdate(billId, {
      payment: true,
      paymentDate: new Date(),
    });

    // Update all applications linked to this bill
    await Application.updateMany(
      { "passportDetails.billId": billId },
      {
        $set: {
          "passportDetails.$[elem].payment": true,
          "passportDetails.$[elem].stage": "Processing",
        },
      },
      { arrayFilters: [{ "elem.billId": billId }] },
    );

    // Send confirmation email
    await sendPaymentConfirmationEmail(
      bill.companyName,
      bill.companyEmail,
      invoiceNumber,
      bill.amount,
      bill.currency,
      noOfApplications,
    );

    return { success: true, data: true };
  } catch (error) {
    console.error("Error marking bill as paid:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to mark bill as paid",
    };
  }
};
