"use server";

import dbConnect from "@/db/db";
import VisaLetterPrice, {
  IVisaLetterPrice,
} from "@/db/models/visa-letter-price";
import { ActionResponse } from "@/actions/types";

export const createVisaLetterPrice = async (): Promise<
  ActionResponse<any[]>
> => {
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

    const result = await VisaLetterPrice.insertMany(data);
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Error inserting VisaLetterPrice data:", error);
    return { success: false, error: "Internal server error" };
  }
};
