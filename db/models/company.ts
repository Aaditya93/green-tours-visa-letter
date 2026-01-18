"use server";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEntryPrice {
  speed: string;
  price: number;
}

export interface IPrices {
  singleEntry: IEntryPrice[];
  multipleEntry: IEntryPrice[];
}

export interface IVisaLetterPrice extends Document {
  currency: string;
  prices: IPrices;
}
// Update the path as needed

const EntryPriceSchema = new Schema({
  speed: { type: String, required: true },
  price: { type: Number, required: true },
});

const TravelAgentPriceSchema = new Schema({
  singleEntry: { type: [EntryPriceSchema], required: true },
  multipleEntry: { type: [EntryPriceSchema], required: true },
});

const VisaLetterPriceSchema = new Schema({
  currency: { type: String, required: true },
  prices: { type: TravelAgentPriceSchema, required: true },
});

const CompanySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  country: { type: String, required: true },
  clientManager: { type: String, required: true },
  visaLetterPrices: { type: [VisaLetterPriceSchema] },
  employeeIds: { type: [String] },
});

export interface ICompany extends Document {
  _id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  country: string;
  clientManager: string;
  visaLetterPrices: IVisaLetterPrice[];
  employees: string[];
}

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
