"use server";

import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { extractUniqueIds } from "../utils";

import { ActionResponse } from "@/actions/types";

export const updateApplicationStagesIref = async (
  data: any[],
  stage: string,
  iref: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const { uniqueIds } = extractUniqueIds(data);

    const applications = await Application.find({
      "passportDetails._id": { $in: uniqueIds },
    });

    const bulkOps = applications.flatMap((application) => {
      return application.passportDetails
        .filter((passport) =>
          data.some((item) => item.passportId === passport._id.toString()),
        )
        .map((passport) => ({
          updateOne: {
            filter: {
              _id: application._id,
              "passportDetails._id": passport._id,
            },
            update: {
              $set: {
                "passportDetails.$.stage": stage,
                "passportDetails.$.iref":
                  !passport.iref || passport.iref === "" ? iref : passport.iref,
              },
            },
          },
        }));
    });

    if (bulkOps.length === 0) {
      return { success: false, error: "No matching passport IDs found" };
    }

    const result = await Application.bulkWrite(bulkOps);
    return { success: true, data: { modifiedCount: result.modifiedCount } };
  } catch (error) {
    console.error("Failed to update passport iref details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
};

export const updateApplicationStages = async (
  data: any[],
  stage: string,
): Promise<ActionResponse<any>> => {
  try {
    await dbConnect();
    const { uniqueIds } = extractUniqueIds(data);

    const applications = await Application.find({
      "passportDetails._id": { $in: uniqueIds },
    });

    const bulkOps = applications.flatMap((application) => {
      return application.passportDetails
        .filter((passport) =>
          data.some((item) => item.passportId === passport._id.toString()),
        )
        .map((passport) => ({
          updateOne: {
            filter: {
              _id: application._id,
              "passportDetails._id": passport._id,
              "passportDetails.stage": "Processing",
            },
            update: {
              $set: { "passportDetails.$.stage": stage },
            },
          },
        }));
    });

    if (bulkOps.length === 0) {
      return {
        success: false,
        error: "No matching passport IDs found in Processing stage",
      };
    }

    const result = await Application.bulkWrite(bulkOps);
    return { success: true, data: { modifiedCount: result.modifiedCount } };
  } catch (error) {
    console.error("Failed to update passport stages:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
};
