"use server";
import mongoose, { Document, Schema } from "mongoose";

interface IClientList extends Document {
  name: string;
  clients: {
    clientId: string;
    addedAt: Date;
  }[];
}

const ClientListSchema = new Schema<IClientList>(
  {
    name: {
      type: String,
      required: true,
    },
    clients: [
      {
        clientId: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ClientList =
  mongoose.models.ClientList ||
  mongoose.model<IClientList>("ClientList", ClientListSchema);

export default ClientList;
