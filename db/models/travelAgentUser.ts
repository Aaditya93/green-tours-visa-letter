"use server";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITravelAgentUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  isAprrove: boolean;
  company: string;
  country: string;
  address: string;
  phoneNumber: string;
}

// Create schema
const TravelAgentUserSchema = new Schema<ITravelAgentUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAprrove: {
      type: Boolean,
      default: false,
    },
    company: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TravelAgentUser: Model<ITravelAgentUser> =
  mongoose.models.TravelAgentUser ||
  mongoose.model<ITravelAgentUser>("TravelAgentUser", TravelAgentUserSchema);

export default TravelAgentUser;
