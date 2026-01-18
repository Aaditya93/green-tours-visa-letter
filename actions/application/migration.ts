"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { getVisaPrice } from "./get-visa-price";

import { ActionResponse } from "@/actions/types";

export const migration = async (): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();

    const applications = await Application.find({
      isCompleted: true,
      cost: { $exists: true },
    }).lean();

    let updateCount = 0;
    for (const application of applications) {
      const priceRes = await getVisaPrice(
        application.duration === "Một lần" ? "singleEntry" : "multipleEntry",
        application.processingInfo.speed,
      );

      if (priceRes.success && priceRes.data) {
        const totalCost = priceRes.data * application.noOfVisa;
        await Application.updateOne(
          { _id: application._id },
          { $set: { cost: totalCost } },
        );
        updateCount++;
      }
    }

    return { success: true, data: { updatedCount: updateCount } };
  } catch (error) {
    console.error("Failed to update cost field during migration:", error);
    return {
      success: false,
      error: "Failed to update cost field during migration",
    };
  }
};
