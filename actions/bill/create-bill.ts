"use server";
import dbConnect from "@/db/db";
import Bill from "@/db/models/bill";
import Application from "@/db/models/application";
import Company from "@/db/models/company";
import { sendBillReadyEmail, sendPaymentConfirmationEmail } from "@/lib/mail";

export const createBill = async (
  company: any,
  applicationIds: string[],
  currency: string,
  amount: number,
  link: string
) => {
  try {
    await dbConnect();
    const bill = await Bill.create({
      companyId: company.id,
      companyName: company.name,
      companyAddress: company.companyAddress,
      companyEmail: company.companyEmail,
      applicationIds: applicationIds,
      amount: amount,
      currency: currency,
      payment: false,
      onePay: link,
      createdDate: new Date().setHours(0, 0, 0, 0),
    });
    await Application.updateMany(
      { "passportDetails._id": { $in: applicationIds } },
      { $set: { "passportDetails.$[elem].billId": bill._id } },
      { arrayFilters: [{ "elem._id": { $in: applicationIds } }] }
    );
    await sendBillReadyEmail(
      company.name,
      company.companyEmail,
      bill._id.toString(),
      amount,
      currency,
      applicationIds.length
    );
    return bill._id.toString();
  } catch (err) {
    console.log(err);
  }
};

export const getBillById = async (id: string) => {
  try {
    await dbConnect();
    const bill = Bill.findById(id).lean();
    return bill;
  } catch (err) {
    console.log(err);
  }
};

export const getApplicationByBillId = async (id: string) => {
  try {
    await dbConnect();
    const application = Application.find({
      "passportDetails.billId": id,
    }).lean();
    return application;
  } catch (err) {
    console.log(err);
  }
};

export interface SimplifiedCompany {
  name: string;
  id: string;
  companyAddress: string;
  companyEmail: string;
}
export const getAllCompaniesBill = async (): Promise<
  SimplifiedCompany[] | undefined
> => {
  try {
    await dbConnect();
    const companies = await Company.find({}).lean().exec();

    return companies.map((company) => ({
      name: company.name,
      id: company._id.toString(),
      companyAddress: company.address,
      companyEmail: company.email,
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

export const markBillAsPaid = async (
  bill: any,
  noOfApplications: number,
  invoiceNumber: string
) => {
  try {
    await dbConnect();

    const updateBill = await Bill.findByIdAndUpdate(
      bill._id,
      {
        payment: true,
        paymentDate: new Date(),
      },
      { new: true } // Return the updated document
    ).lean();

    const result = await Application.updateMany(
      { "passportDetails.billId": bill._id.toString() },
      {
        $set: {
          "passportDetails.$[elem].payment": true,
          "passportDetails.$[elem].stage": "Processing",
        },
      },
      { arrayFilters: [{ "elem.billId": bill._id.toString() }] }
    );

    await sendPaymentConfirmationEmail(
      bill.companyName,
      bill.companyEmail,
      invoiceNumber,
      bill.amount,
      bill.currency,
      noOfApplications
    );
  } catch (err) {
    console.error("Error marking bill as paid:", err);
    throw err;
  }
};

export const getBills = async (companyId: string, from: Date, to: Date) => {
  try {
    await dbConnect();
    const bills = await Bill.find({
      companyId: companyId,
      createdDate: { $gte: from, $lte: to },
    }).lean();
    return bills;
  } catch (err) {
    console.log(err);
  }
};
