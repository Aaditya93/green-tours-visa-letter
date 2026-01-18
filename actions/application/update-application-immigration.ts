"use server";

import { Types } from "mongoose";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import ImmigrationCost, {
  IImmigrationCost,
} from "@/db/models/immigration-cost";
import { extractUniqueIds } from "./utils";

import { ActionResponse } from "@/actions/types";

async function getImmigrationPriceFromObject(
  immigrationCost: IImmigrationCost,
  days: "days15" | "days30",
  speed: string,
): Promise<{ price: number; currency: string } | null> {
  try {
    if (!immigrationCost?.visaLetterPrices?.length) {
      throw new Error("Invalid immigration cost data");
    }

    for (const visaPrice of immigrationCost.visaLetterPrices) {
      const { currency, prices } = visaPrice;
      const dayPrices = prices[days];

      if (!dayPrices) continue;

      const entry = dayPrices.find((entry) => entry.speed === speed);
      if (entry) {
        return { price: entry.price, currency };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching immigration price:", error);
    return null;
  }
}

export async function updateApplicationImmigration(
  data: any[],
  name: string,
): Promise<ActionResponse<any>> {
  try {
    if (!data?.length || !name) {
      return { success: false, error: "Invalid input parameters" };
    }

    await dbConnect();

    const { uniqueIds } = extractUniqueIds(data);
    if (uniqueIds.length === 0) {
      return { success: false, error: "No valid passport IDs provided" };
    }

    const objectIds = uniqueIds.map((id) => {
      try {
        return new Types.ObjectId(id);
      } catch {
        return id;
      }
    });

    const [applications, immigration] = await Promise.all([
      Application.find({
        "passportDetails._id": { $in: objectIds },
        "creator.role": "TravelAgent",
      }),
      ImmigrationCost.findOne({ name }),
    ]);

    if (!immigration || !applications.length) {
      return {
        success: false,
        error: !immigration
          ? `Immigration cost not found for: ${name}`
          : "No applications found",
      };
    }

    const priceUpdates = await Promise.all(
      applications.flatMap((application) => {
        const matchingPassports = application.passportDetails.filter(
          (passport) =>
            data.some(
              (item) =>
                item.passportId?.toString() === passport._id?.toString(),
            ),
        );

        return matchingPassports.map(async (passport) => {
          const priceInfo = await getImmigrationPriceFromObject(
            immigration,
            application.travelDuration === 15 ? "days15" : "days30",
            application.processingInfo.speed,
          );

          if (!priceInfo) return null;

          return {
            applicationId: application._id,
            passportId: passport._id,
            priceInfo,
          };
        });
      }),
    );

    const bulkOps = priceUpdates
      .filter((update): update is NonNullable<typeof update> => update !== null)
      .map((update) => ({
        updateOne: {
          filter: {
            _id: update.applicationId,
            "passportDetails._id": update.passportId,
          },
          update: {
            $set: {
              "passportDetails.$.immigrationFee": {
                name,
                id: immigration._id,
                amount: update.priceInfo.price,
                currency: update.priceInfo.currency,
              },
            },
          },
        },
      }));

    if (bulkOps.length === 0) {
      return { success: false, error: "No valid updates to perform" };
    }

    const result = await Application.bulkWrite(bulkOps);
    return { success: true, data: { modifiedCount: result.modifiedCount } };
  } catch (error) {
    console.error("Failed to update immigration info:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}
