"use server";
import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";

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
    console.log(bill);
  } catch (err) {
    console.log(err);
  }
};
