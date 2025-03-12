"use server";
import mongoose, { Document, Model, Schema } from "mongoose";

// Interfaces
export interface IEntryPrice {
  speed: string;
  price: number;
}

export interface IPrices {
  days15: IEntryPrice[];
  days30: IEntryPrice[];
}

export interface IImmigrationPrice extends Document {
  currency: string;
  prices: IPrices;
}

export interface IImmigrationCost extends Document {
  name: string;
  visaLetterPrices: IImmigrationPrice[];
}

// Schemas
const EntryPriceSchema = new Schema<IEntryPrice>({
  speed: { type: String, required: true },
  price: { type: Number, required: true },
});

const PricesSchema = new Schema<IPrices>({
  days15: { type: [EntryPriceSchema], required: true },
  days30: { type: [EntryPriceSchema], required: true },
});

const ImmigrationPriceSchema = new Schema<IImmigrationPrice>({
  currency: { type: String, required: true },
  prices: { type: PricesSchema, required: true },
});

const ImmigrationCostSchema = new Schema<IImmigrationCost>(
  {
    name: { type: String, required: true },
    visaLetterPrices: { type: [ImmigrationPriceSchema], required: true },
  },
  {
    timestamps: true,
  }
);

const ImmigrationCost = (mongoose.models.ImmigrationCost ||
  mongoose.model<IImmigrationCost>(
    "ImmigrationCost",
    ImmigrationCostSchema
  )) as Model<IImmigrationCost>;

export default ImmigrationCost;
