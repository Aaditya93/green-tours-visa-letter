"use server";

import { auth } from "@/auth";
import dbConnect from "@/db/db";
import Application from "@/db/models/application";
import Company from "@/db/models/company";
import VisaLetterPrice from "@/db/models/visa-letter-price";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { IVisaLetterPrice } from "@/db/models/visa-letter-price";
import VisaLetter from "@/db/models/visaLetter";

export const createVisaLetterPrice = async () => {
  try {
    await dbConnect();
    const data: Partial<IVisaLetterPrice>[] = [
      {
        Country: "Vanuatu",
        Code: "VU",
        Currency: "VUV",
        CurrencyLabel: "VUV",
        TravelAgent1: {
          singleEntry: [
            { speed: "NO", price: 7 },
            { speed: "4D", price: 10 },
            { speed: "3D", price: 15 },
            { speed: "2D", price: 20 },
            { speed: "1D", price: 45 },
            { speed: "8H", price: 70 },
            { speed: "4H", price: 90 },
            { speed: "2H", price: 100 },
            { speed: "1H", price: 120 },
          ],
          multipleEntry: [
            { speed: "NO", price: 8 },
            { speed: "4D", price: 11 },
            { speed: "3D", price: 17 },
            { speed: "2D", price: 22 },
            { speed: "1D", price: 50 },
            { speed: "8H", price: 77 },
            { speed: "4H", price: 99 },
            { speed: "2H", price: 110 },
            { speed: "1H", price: 132 },
          ],
        },
        TravelAgent2: {
          singleEntry: [
            { speed: "NO", price: 7 },
            { speed: "4D", price: 10 },
            { speed: "3D", price: 15 },
            { speed: "2D", price: 20 },
            { speed: "1D", price: 45 },
            { speed: "8H", price: 70 },
            { speed: "4H", price: 90 },
            { speed: "2H", price: 100 },
            { speed: "1H", price: 120 },
          ],
          multipleEntry: [
            { speed: "NO", price: 8 },
            { speed: "4D", price: 11 },
            { speed: "3D", price: 17 },
            { speed: "2D", price: 22 },
            { speed: "1D", price: 50 },
            { speed: "8H", price: 77 },
            { speed: "4H", price: 99 },
            { speed: "2H", price: 110 },
            { speed: "1H", price: 132 },
          ],
        },
      },
    ];

    // Insert into the database

    const result = await VisaLetterPrice.insertMany(data);

    return result;
  } catch (error) {
    console.error("Error inserting VisaLetterPrice data:", error);
    throw error;
  }
};

export const getVisaLetterPrice = async (Code: string) => {
  try {
    await dbConnect();
    const result = await VisaLetterPrice.findOne({ Code });

    return result;
  } catch (error) {
    console.error("Error fetching VisaLetterPrice data:", error);
    throw error;
  }
};

export const getVisaLetterPrices = async () => {
  try {
    await dbConnect();
    const result = await Company.find({});
    return result;
  } catch (error) {
    console.error("Error fetching VisaLetterPrice data:", error);
    throw error;
  }
};
export const getVisaLetterPriceByCompany = async (id: string) => {
  try {
    await dbConnect();
    const result = await Company.findById(id);
    return result;
  } catch (error) {
    console.error("Error fetching VisaLetterPrice data:", error);
    throw error;
  }
};

export const updateVisaLetterPrice = async (
  Country: string,
  data: Partial<IVisaLetterPrice>
) => {
  try {
    await dbConnect();
    await VisaLetterPrice.findOneAndUpdate(
      { Country },
      {
        ...data,
      }
    );
    revalidatePath(`/agent-platform/visa-letter-price/{Country}`);
    return {
      success: "VisaLetterPrice data updated successfully",
    };
  } catch (error) {
    console.error("Error updating VisaLetterPrice data:", error);
    return {
      error: "Internal server error",
    };
  }
};

export const getIncompleteApplicationsTravelAgent = async () => {
  try {
    const session = await auth();

    await dbConnect();

    const applications = await Application.find({
      isCompleted: false,
      isProcessing: true,
      "creator.companyId": session?.user?.companyId,
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications", error);
  }
};

export const getCompleteApplicationsTravelAgent = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const applications = await Application.find({
      isCompleted: true,
      isProcessing: true,
      "passportDetails.0.stage": "Delivered",
      "creator.companyId": session.user.companyId,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};
export const getProcessingApplicationTravelAgent = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const applications = await Application.find({
      isCompleted: true,
      isProcessing: true,
      "passportDetails.0.stage": {
        $in: ["Processing", "Blacklist", "Overstayed"],
      },
      "creator.companyId": session.user.companyId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};
export const getCompleteApplicationsTravelAgentBilling = async (
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
      "creator.companyId": session.user.companyId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};
export const getAllCompleteApplicationsTravelAgentBilling = async (
  companyId: string,
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
      "creator.role": "TravelAgent",
      "creator.companyId": companyId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};
export const getAllCompleteApplicationsTravelAgentImmigration = async (
  immigration: string,
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
      "passportDetails.immigrationFee.name": immigration,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};

export const getAllCompleteApplicationsTravelAgentCompany = async (
  company: string,
  fromDate: Date,
  toDate: Date
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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
      "creator.companyId": company,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return applications;
  } catch (error) {
    console.error("Failed to get applications:", error);
    return [];
  }
};
const updateSchema = z.object({
  _id: z.string(),
  Prices: z.object({
    singleEntry: z.array(
      z.object({
        speed: z.string(),
        price: z.number(),
      })
    ),
    multipleEntry: z.array(
      z.object({
        speed: z.string(),
        price: z.number(),
      })
    ),
  }),
  currency: z.string(),
});

export const updateVisaPrices = async (
  formData: z.infer<typeof updateSchema>
) => {
  try {
    const validatedData = updateSchema.parse(formData);

    await Company.findByIdAndUpdate(
      validatedData._id,
      {
        $set: {
          visaLetterPrices: [
            {
              prices: validatedData.Prices,
              currency: validatedData.currency,
            },
          ],
        },
      },
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating visa prices:", error);
    return false;
  }
};

export interface SimplifiedCompany {
  name: string;
  id: string;
}
export const getAllCompanies = async (): Promise<
  SimplifiedCompany[] | undefined
> => {
  try {
    await dbConnect();
    const companies = await Company.find({}).select("_id name").lean().exec();

    return companies.map((company) => ({
      name: company.name,
      id: company._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

export const getAllVisaLettersByCompany = async (id: string) => {
  try {
    await dbConnect();
    const visaLetter = await VisaLetter.find({ companyId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return visaLetter;
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};
