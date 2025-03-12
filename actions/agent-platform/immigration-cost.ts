"use server";

import dbConnect from "@/db/db";
import ImmigrationCost from "@/db/models/immigration-cost";

export const createImmigrationCost = async () => {
  try {
    await dbConnect();
    await ImmigrationCost.create({
      name: "Hanoi",
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error inserting ImmigrationCost data:", error);
    throw error;
  }
};

export const getImmigrationCostAll = async () => {
  try {
    await dbConnect();
    const result = await ImmigrationCost.find({}).lean();
    return result;
  } catch (error) {
    console.error("Error getting ImmigrationCost data:", error);
  }
};

export const getImmigrationCostById = async (id: string) => {
  try {
    await dbConnect();
    const response = await ImmigrationCost.findById(id).lean();
    return response;
  } catch (error) {
    console.error("Error getting ImmigrationCost data:", error);
  }
};

export const updateImmigrationPrices = async (_id: string, formData: any) => {
  try {
    const result = await ImmigrationCost.findByIdAndUpdate(
      _id,
      {
        $set: {
          visaLetterPrices: {
            currency: formData.currency,
            prices: formData.prices,
          },
        },
      },
      { new: true }
    );
    return !!result;
  } catch (error) {
    console.error("Error updating visa prices:", error);
    return false;
  }
};
