"use server";
import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import { convertToApplications } from "@/lib/data";
import User from "@/db/models/User";

import { VisaLetterPrice } from "@/config/docsConfig";
import ClientList from "@/db/models/client-list";
import ImmigrationCost, {
  IImmigrationCost,
} from "@/db/models/immigration-cost";

function generateFiveDigitNumber(): string {
  const min = 10000;
  const max = 99999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}
interface UpdatePassportDetails {
  full_name: string;
  birthday: Date;
  sex: string;
  current_nationality: string;
  passport_number: string;
  original_nationality: string;
  dateOfExpiry: Date;
  passport_type: string;
}

function formatString(str: string): string {
  if (!str?.trim()) return "";

  return str.toLowerCase().replace(/\b\w+\b|\(([^)]+)\)/g, (match, group) => {
    if (group) {
      // Handle text inside parentheses
      return `(${group
        .split(" ")
        .map(
          (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")})`;
    }
    // Handle regular words
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
}

function capitalizeAllWords(str: string): string {
  // Handle empty or null strings
  if (!str?.trim()) return "";

  // Convert to uppercase and handle multiple spaces
  return str
    .toUpperCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .join(" ");
}

function removeHyphens(str: string): string {
  if (!str?.trim()) return "";
  return str.replace(/-/g, " ");
}

function parseDate(dateString: string) {
  try {
    const [day, month, year] = dateString.split("/").map(Number);
    // Note: month is 0-based in JavaScript Date
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Failed to parse date", error);
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY`);
  }
}

export const createApplication = async (groupId: string, noOfVisa: number) => {
  try {
    await dbConnect();

    const session = await auth();
    const newApplication = await Application.create({
      id: groupId,
      noOfVisa: noOfVisa,
      passportDetails: [],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: false,
      purpose: "Travel",
      job: "Freelancer",
      creator: {
        _id: session?.user.id,
        role: session?.user.role,
        creator: session?.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });
    return newApplication._id.toString();
  } catch (error) {
    console.error("Failed to create application", error);
  }
};
interface PassportDetails {
  full_name: string;
  country: string;
  birthday: string;
  dateOfExpiry: string;
  sex: string;
  passport_number: string;
}

function getworkplace(country: string): string {
  switch (country) {
    case "China":
      return "Shanghai";
    case "India":
      return "Mumbai";
    case "Bangladesh":
      return "Dhaka";
    case "Thailand":
      return "Bangkok";
    case "China(taiwan)":
      return "Taipei";
    case "Australia":
      return "Sydney";
    default:
      return "Other";
  }
}

export const createApplicationIndiviual = async (
  groupId: string,
  noOfVisa: number,
  passportDetails: PassportDetails,
  file_path: string
) => {
  const country = formatString(passportDetails.country);
  const awsurl = process.env.S3_AWS_URL;
  const session = await auth();
  const name = capitalizeAllWords(passportDetails.full_name);

  const passportInfo = {
    fullName: removeHyphens(name),
    nationalityCurrent: country,
    sex: passportDetails.sex,
    dateOfExpiry: parseDate(passportDetails.dateOfExpiry),
    passportNumber: passportDetails.passport_number,
    birthday: parseDate(passportDetails.birthday),
    image: awsurl + file_path,
    originalNationality: "",
    passportType: "Ordinary Passport",
    stage: "Not Processed",
  };
  try {
    // create application

    const newApplication = await Application.create({
      id: groupId,
      noOfVisa: noOfVisa,
      passportDetails: [passportInfo],
      code: generateFiveDigitNumber(),
      isCompleted: false,
      isProcessing: true,
      workPlace: getworkplace(country),
      purpose: "Travel",
      job: "Freelancer",
      creator: {
        _id: session?.user.id,
        role: session?.user.role,
        creator: session?.user.name,
        createdDate: new Date(),
        createdTime: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });
    return newApplication._id.toString();
  } catch (error) {
    console.error("Failed to create application", error);
  }
};

export const updateApplication = async (
  existingApplicationId: string,
  passportDetails: PassportDetails,
  file_path: string
) => {
  try {
    const awsurl = process.env.S3_AWS_URL;

    const country = formatString(passportDetails.country);
    const name = capitalizeAllWords(passportDetails.full_name);

    if (!existingApplicationId || !passportDetails) {
      throw new Error("Missing required parameters");
    }

    const passportInfo = {
      fullName: removeHyphens(name),
      nationalityCurrent: country,
      sex: passportDetails.sex,
      passportNumber: passportDetails.passport_number,
      dateOfExpiry: parseDate(passportDetails.dateOfExpiry),
      birthday: parseDate(passportDetails.birthday),
      image: awsurl + file_path,
      passportType: "Ordinary Passport",
      originalNationality: "",
      stage: "Not Processed",
      bill: false,
      payment: false,
    };

    const update = await Application.updateOne(
      { id: existingApplicationId },
      {
        $push: { passportDetails: passportInfo },
        $set: {
          workPlace: getworkplace(country),
          isProcessing: true,
        },
      }
    );

    if (update.modifiedCount === 0) {
      throw new Error("Application not found or update failed");
    }

    return update;
  } catch (error) {
    console.error("Error adding visa:", error);
    throw error;
  }
};

export const getIncompleteApplications = async () => {
  try {
    const session = await auth();

    await dbConnect();
    if (session?.user.role === "Admin") {
      const applications = await Application.find({
        isCompleted: false,
        isProcessing: true,
      })
        .lean()
        .sort({ createdAt: -1 })
        .exec();

      return applications;
    } else {
      const applications = await Application.find({
        isCompleted: false,
        isProcessing: true,
        "creator._id": session?.user.id,
      })
        .lean()
        .sort({ createdAt: -1 })
        .exec();

      return applications;
    }
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

interface ManualInfo {
  duration: string;
  speed: string;
  note?: string;
  handled_by: string;
  from_date: Date;
  to_date: Date;
  airport?: string;
  embassy?: string;
  result: Date;
  stage: string;
}

interface PriceEntry {
  speed: string;
  price: number;
}

export const getVisaPrice = async (
  entryType: "singleEntry" | "multipleEntry",
  speed: string
): Promise<number> => {
  try {
    const priceList = VisaLetterPrice[entryType];
    if (!priceList) {
      throw new Error("Invalid entry type");
    }

    const priceEntry = priceList.find(
      (entry: PriceEntry) => entry.speed === speed
    );
    if (!priceEntry) {
      throw new Error("Invalid speed type");
    }

    return priceEntry.price;
  } catch (error) {
    console.error("Error getting visa price:", error);
    return 0;
  }
};
export const updateApplicationManualInfo = async (
  existingApplicationId: string,
  manualInfo: ManualInfo
) => {
  try {
    await dbConnect();

    const response = await Application.findByIdAndUpdate(
      existingApplicationId,
      {
        $set: {
          duration: manualInfo.duration,
          "processingInfo.speed": manualInfo.speed,
          "processingInfo.notes": manualInfo.note,
          "creator.handleBy": manualInfo.handled_by,
          "entryDetails.fromDate": manualInfo.from_date,
          "entryDetails.toDate": manualInfo.to_date,
          result: manualInfo.result,
          placeOfIssue: manualInfo.airport || manualInfo.embassy,
          isCompleted: true,
          "passportDetails.$[].stage": manualInfo.stage,
        },
      },
      { new: true }
    );
    return !!response;
  } catch (error) {
    console.error("Error updating application:", error);
  }
};

export const updateApplicationPassportInfo = async (
  existingApplicationId: string,
  passportId: string,
  passportDetails: UpdatePassportDetails
) => {
  try {
    await dbConnect();

    const result = await Application.findOneAndUpdate(
      {
        _id: existingApplicationId,
        "passportDetails._id": passportId,
      },
      {
        $set: {
          "passportDetails.$.fullName": passportDetails.full_name,
          "passportDetails.$.birthday": passportDetails.birthday,
          "passportDetails.$.sex": passportDetails.sex,
          "passportDetails.$.nationalityCurrent":
            passportDetails.current_nationality,
          "passportDetails.$.passportNumber": passportDetails.passport_number,
          "passportDetails.$.originalNationality":
            passportDetails.original_nationality,
          "passportDetails.$.dateOfExpiry": passportDetails.dateOfExpiry,
        },
      },
      { new: true }
    );

    return !!result;
  } catch (error) {
    console.error("Error updating application:", error);
  }
};

export const getCompleteApplications = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  try {
    const session = await auth();
    await dbConnect();
    if (session?.user.role === "Admin") {
      const applications = await Application.find({
        isCompleted: true,
        createdAt: { $gte: threeMonthsAgo }, // Greater than or equal to 3 months ago
      })
        .lean()
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();

      const result = convertToApplications(applications);

      return result;
    } else {
      const applications = await Application.find({
        isCompleted: true,
        "creator._id": session?.user.id,
        createdAt: { $gte: threeMonthsAgo }, // Greater than or equal to 3 months ago
      })
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();

      const result = convertToApplications(applications);

      return result;
    }
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

export const getUser = async () => {
  const session = await auth();

  try {
    if (session?.user.role === "Admin") {
      const Users = await User.find({}).exec();
      const userData = Users.map((user) => {
        return {
          username: user.name,
        };
      });
      return userData;
    } else {
      return [
        {
          username: session?.user.name,
        },
      ];
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
};

export const getCompleteApplicationsDate = async (
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();

    await dbConnect();

    if (session?.user.role === "Admin") {
      const startDate = new Date(
        fromDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(
        toDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      endDate.setHours(23, 59, 59, 999);

      const applications = await Application.find({
        isCompleted: true,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .lean()
        .sort({ createdAt: -1 })
        .exec();

      const result = convertToApplications(applications);

      return result;
    } else {
      const startDate = new Date(
        fromDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(
        toDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      endDate.setHours(23, 59, 59, 999);

      const applications = await Application.find({
        isCompleted: true,
        "creator._id": session?.user.id,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .sort({ createdAt: -1 })
        .exec();

      const result = convertToApplications(applications);

      return result;
    }
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

export const getCompleteApplicationsReportPage = async (
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();

    await dbConnect();

    if (session?.user.role === "Admin" || session?.user.role === "Employee") {
      const startDate = new Date(
        fromDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(
        toDate.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      endDate.setHours(23, 59, 59, 999);

      const applications = await Application.find({
        isCompleted: true,

        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .lean()
        .sort({ createdAt: -1 })
        .exec();

      const result = convertToApplications(applications);

      return result;
    }
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

export const updateApplicationStagesIref = async (
  data: any[],
  stage: string,
  iref: string
) => {
  try {
    await dbConnect();

    const { uniqueIds } = extractUniqueIds(data);
    const applications = await Application.find({
      "passportDetails._id": {
        $in: uniqueIds.map((id) => id),
      },
    });

    const bulkOps = applications.flatMap((application) => {
      return application.passportDetails
        .filter((passport) =>
          data.some((item) => item.passportId === passport._id.toString())
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
      return {
        success: false,
        error: "No matching passport IDs found",
      };
    }

    const result = await Application.bulkWrite(bulkOps);

    return {
      success: true,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error("Failed to update passport details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
};
function extractUniqueIds(data) {
  const ids = new Set<string>();

  data.forEach((item) => {
    if (item.passportId) {
      ids.add(item.passportId.toString());
    }
  });

  return {
    uniqueIds: Array.from(ids),
  };
}

async function getImmigrationPriceFromObject(
  immigrationCost: IImmigrationCost,
  days: "days15" | "days30",
  speed: string
): Promise<{ price: number; currency: string } | null> {
  try {
    if (!immigrationCost?.visaLetterPrices?.length) {
      throw new Error("Invalid immigration cost data");
    }

    for (const visaPrice of immigrationCost.visaLetterPrices) {
      const { currency, prices } = visaPrice;
      const dayPrices = prices[days];

      if (!dayPrices) {
        continue;
      }

      const entry = dayPrices.find((entry) => entry.speed === speed);
      if (entry) {
        return {
          price: entry.price,
          currency,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching immigration price:", error);
    return null;
  }
}

export async function updateApplicationImmigration(data: any[], name: string) {
  try {
    if (!data?.length || !name) {
      throw new Error("Invalid input parameters");
    }

    await dbConnect();

    const { uniqueIds } = extractUniqueIds(data);
    if (uniqueIds.length === 0) {
      return { success: false, error: "No valid passport IDs provided" };
    }

    // Convert string IDs to ObjectIds for passport details query
    const objectIds = uniqueIds.map((id) => {
      try {
        return new Types.ObjectId(id);
      } catch {
        return id; // Keep original if not valid ObjectId
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

    // Process all price information first
    const priceUpdates = await Promise.all(
      applications.flatMap((application) => {
        const matchingPassports = application.passportDetails.filter(
          (passport) =>
            data.some(
              (item) => item.passportId?.toString() === passport._id?.toString()
            )
        );

        return matchingPassports.map(async (passport) => {
          const priceInfo = await getImmigrationPriceFromObject(
            immigration,
            application.travelDuration === 15 ? "days15" : "days30",
            application.processingInfo.speed
          );

          if (!priceInfo) return null;

          return {
            applicationId: application._id,
            passportId: passport._id,
            priceInfo,
          };
        });
      })
    );

    // Convert successful price updates to bulk operations
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

    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error("Failed to update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}
export const updateApplicationStages = async (data: any[], stage: string) => {
  try {
    await dbConnect();

    const { uniqueIds } = extractUniqueIds(data);
    const applications = await Application.find({
      "passportDetails._id": {
        $in: uniqueIds.map((id) => id),
      },
    });

    const bulkOps = applications.flatMap((application) => {
      return application.passportDetails
        .filter((passport) =>
          data.some((item) => item.passportId === passport._id.toString())
        )
        .map((passport) => ({
          updateOne: {
            filter: {
              _id: application._id,
              "passportDetails._id": passport._id,
              "passportDetails.stage": "Processing", // Only update if current stage is Processing
            },
            update: {
              $set: {
                "passportDetails.$.stage": stage,
              },
            },
          },
        }));
    });

    if (bulkOps.length === 0) {
      return {
        success: false,
        error: "No matching passport IDs found",
      };
    }

    const result = await Application.bulkWrite(bulkOps);
    console.log(result);

    return {
      success: true,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error("Failed to update passport details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
};

export const getCompleteApplicationsTravelAgent = async () => {
  try {
    const session = await auth();
    await dbConnect();
    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session?.user.companyId,
    })
      .lean()
      .sort({ createdAt: -1 })
      .limit(150)
      .exec();

    const result = convertToApplications(applications);

    return result;
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};
export const getCompleteApplicationsDateTravelAgent = async (
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();

    await dbConnect();

    const startDate = new Date(
      fromDate.toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      toDate.toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    endDate.setHours(23, 59, 59, 999);

    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session?.user.companyId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const result = convertToApplications(applications);

    return result;
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

export const getCompleteApplicationsReportPageTravelAgent = async (
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();

    await dbConnect();
    const startDate = new Date(
      fromDate.toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      toDate.toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    endDate.setHours(23, 59, 59, 999);

    const applications = await Application.find({
      isCompleted: true,
      "creator.companyId": session?.user.companyId,
      "creator.role": "TravelAgent",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const result = convertToApplications(applications);

    return result;
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};
// export const checkMismatchedVisas = async () => {
//   try {
//     // Find documents where 'noOfVisa' does not match the size of 'passportDetails'
//     const mismatchedDocs = await Application.find({
//       $expr: {
//         $ne: ["$noOfVisa", { $size: "$passportDetails" }]
//       }
//     }).lean();

//     console.log("Mismatched documents found:", mismatchedDocs);

//     // Fix the mismatched documents
//     for (const doc of mismatchedDocs) {
//       const correctedVisaCount = doc.passportDetails.length;

//       // Update the document with the correct visa count
//       await Application.updateOne(
//         { _id: doc._id },
//         { $set: { noOfVisa: correctedVisaCount } }
//       );

//       console.log(`Fixed document with ID ${doc._id}: Updated noOfVisa to ${correctedVisaCount}`);
//     }

//     console.log("All mismatched documents have been fixed.");

//   } catch (error) {
//     console.error("Failed to check and fix mismatched visas:", error);
//   }
// };

export const migration = async () => {
  try {
    await dbConnect();

    // First find all applications that don't have a cost field set
    const applications = await Application.find({
      isCompleted: true,
      cost: { $exists: true },
    }).lean();

    let updateCount = 0;
    for (const application of applications) {
      const cost = await getVisaPrice(
        application.duration === "Một lần" ? "singleEntry" : "multipleEntry",
        application.processingInfo.speed
      );

      if (cost) {
        // Calculate total cost by multiplying price by number of visas
        const totalCost = cost * application.noOfVisa;

        // Update the document with the correct total cost
        await Application.updateOne(
          { _id: application._id },
          { $set: { cost: totalCost } }
        );
        updateCount++;
      }
    }

    console.log(`Updated cost for ${updateCount} applications`);
    return { success: true, updatedCount: updateCount };
  } catch (error) {
    console.error("Failed to update cost field:", error);
    throw error;
  }
};

export const getAllClientList = async () => {
  try {
    const clientList = await ClientList.find({}).exec();

    const formattedList = clientList
      .filter((agent) => agent.clients && agent.clients.length > 0)
      .map((agent) => ({
        agentId: agent.name,
        clients: agent.clients.map((client) => client.clientId),
      }));

    return formattedList;
  } catch (error) {
    console.error("Failed to get client list:", error);
    throw error;
  }
};
export const getUserTravelAgent = async () => {
  try {
    const session = await auth();
    const Users = await User.find({
      role: "TravelAgent",
      companyId: session?.user.companyId,
    }).exec();
    const userData = Users.map((user) => {
      return {
        username: user.name,
      };
    });
    return userData;
  } catch (error) {
    console.error("Error getting user:", error);
  }
};

export const convertToPassportBillings = async (
  passportsData: any[]
): Promise<any[]> => {
  if (!Array.isArray(passportsData)) return [];

  return Promise.all(
    passportsData.map((passport) => ({
      name: passport.fullName || "",
      cost: passport.cost || 0,
      currency: passport.currency || "USD",
      passportId: passport.passportId?.toString() || "",
      applicationId: passport.id?.toString() || "",
      nationality: passport.nationalityCurrent || "",
      bill: passport.bill || false,
      payment: passport.payment || false,
      passportNumber: passport.passportNumber || "",
      applicationCode: passport.code || "",
      duration: passport.duration || "",
      speed: passport.speed || "",
    }))
  );
};

export const getApplicationsBill = async (
  companyId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    await dbConnect();

    // Ensure dates are properly formatted for query
    const formattedStartDate = new Date(startDate);
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = new Date(endDate);
    formattedEndDate.setHours(23, 59, 59, 999);

    // Query with date range filter and bill status
    const applications = await Application.find({
      "creator.companyId": companyId,
      passportDetails: { $elemMatch: { bill: false } },
      isCompleted: true,
      createdAt: {
        $gte: formattedStartDate,
        $lte: formattedEndDate,
      },
    })
      .lean()
      .sort({ createdAt: -1 });

    const formattedApplications = await convertToApplications(applications);
    const billingData = await convertToPassportBillings(formattedApplications);
    console.log("Billing data:", billingData);

    return billingData;
  } catch (error) {
    console.error("Failed to get applications for billing:", error);
  }
};

// export const vietnamesToEnglish = async () => {
//   try {
//     await dbConnect();

//     const result = await Application.updateMany(
//       { "passportDetails.sex": "Nữ" },
//       { $set: { "passportDetails.$[].sex": "Female" } }
//     );

//     console.log(`Updated ${result.modifiedCount} documents`);
//     return {
//       success: true,
//       modifiedCount: result.modifiedCount,
//     };
//   } catch (error) {
//     console.error("Failed to update passport types:", error);
//     throw error;
//   }
// };

// export const unsetCostMigration = async () => {
//   try {
//     await dbConnect();

//     const result = await Application.updateMany(
//       {
//         "creator._id": "675d828205884589d97c1c3d",
//         "creator.role": { $exists: false },
//       },
//       {
//         $set: { "creator.role": "Employee" },
//       }
//     );

//     console.log("Modified count:", result);

//     return {
//       success: true,
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//     };
//   } catch (error) {
//     console.error("Migration failed:", error);
//   }
// };
// export const migration = async () => {
//   try {
//     await dbConnect();
//     const response = await Application.updateMany(
//       {},
//       { $set: { purpose: "du lịch" } }
//     );

//     return response;
//   } catch (error) {
//     console.error("Failed to remove field:", error);
//     throw error;
//   }
// };

//

// export const createClinetList = async () => {
//   try {
//     const clientListDocs = await ClientList.create({
//       name: "Mr Amy",
//       clients: [],
//     });

//     console.log("Client lists created successfully", clientListDocs);
//     return;
//   } catch (error) {
//     console.error("Failed to get applications", error);
//   }
// };
// export const createClientLists = async () => {
//   try {
//     await dbConnect();
//     const clients = [
//       {
//         name: "Victor",

//         clients: [
//           {
//             clientId: "677a060909e1aea984af26b5",
//             addedAt: new Date(),
//           },
//         ],
//       },
//     ];

//     const clientListDocs = await ClientList.insertMany(
//       clients.map((client) => ({
//         ...client,
//       }))
//     );

//     console.log(`Created ${clientListDocs.length} client lists`);
//   } catch (error) {
//     console.error("Failed to create client lists:", error);
//     throw error;
//   }
// };

// export const removeFieldFromDocuments = async () => {
//   try {
//     // Remove field from all documents
//     const result = await Application.updateMany(
//       {},
//       { $unset: { "processingInfo.status": "" } }
//     );

//     console.log("Modified count:", result);

//   } catch (error) {
//     console.error("Failed to remove field:", error);

//   }
// };

export const deleteTravelAgentApplications = async () => {
  try {
    await dbConnect();
    const applications = await Application.deleteMany({
      "creator.role": "TravelAgent",
    });
    console.log("Deleted applications:", applications.deletedCount);
  } catch (error) {
    console.error("Failed to delete applications", error);
  }
};
