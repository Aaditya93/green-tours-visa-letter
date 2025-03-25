"use server";
import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";
import Application from "@/db/models/application";
export const createBill = async (
  companyId: string,
  companyName: string,
  applicationIds: string[],
  currency: string,
  amount: number
) => {
  try {
    await dbConnect();
    const bill = await Bill.create({
      companyId: companyId,
      companyName: companyName,
      applicationIds: applicationIds,
      amount: amount,
      currency: currency,
      payment: false,
      createdDate: new Date(),
    });
    const updateApplication = await Application.updateMany(
      { "passportDetails.applicationId": { $in: applicationIds } },
      { $set: { bill: true } }
    );
    console.log(updateApplication);
    console.log(bill);
  } catch (err) {
    console.log(err);
  }
};
