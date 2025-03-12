import { Document } from "mongoose";
import mongoose, { Schema, Model } from "mongoose";

export interface IEntryPrice {
  speed: string;
  price: number;
}

export interface ITravelAgent {
  singleEntry: IEntryPrice[];
  multipleEntry: IEntryPrice[];
}

export interface IVisaLetterPrice extends Document {
  Country: string;
  Code: string;
  Currency: string;
  CurrencyLabel: string;
  TravelAgent1: ITravelAgent;
  TravelAgent2: ITravelAgent;
}
 // Update the path as needed

const EntryPriceSchema = new Schema({
  speed: { type: String, required: true },
  price: { type: Number, required: true },
});

const TravelAgentSchema = new Schema({
  singleEntry: { type: [EntryPriceSchema], required: true },
  multipleEntry: { type: [EntryPriceSchema], required: true },
});

const VisaLetterPriceSchema = new Schema({
  Country: { type: String, required: true },
  Code: { type: String, required: true },
  Currency: { type: String, required: true },
  CurrencyLabel: { type: String, required: true },
  TravelAgent1: { type: TravelAgentSchema, required: true },
  TravelAgent2: { type: TravelAgentSchema, required: true },
});

// Export the model
const VisaLetterPrice: Model<IVisaLetterPrice> =
  mongoose.models.VisaLetterPrice ||
  mongoose.model<IVisaLetterPrice>("VisaLetterPrice", VisaLetterPriceSchema);

export default VisaLetterPrice;
