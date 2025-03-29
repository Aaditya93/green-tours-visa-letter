import mongoose, { Document, Schema } from "mongoose";

// Bill interface
interface IBill extends Document {
  amount: number;
  currency: string;
  payment: boolean;
  paymentDate: Date;
  applicationIds: string[];
  companyId: string;
  companyName: string;
  createdDate: Date;
  companyAddress: string;
  companyEmail: string;
  onePay: string;
}

const BillSechema = new Schema({
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  payment: {
    type: Boolean,
  },
  paymentDate: {
    type: Date,
  },
  applicationIds: {
    type: [String],
  },
  companyId: {
    type: String,
  },
  companyName: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  companyAddress: {
    type: String,
  },
  companyEmail: {
    type: String,
  },
  onePay: {
    type: String,
  },
});
const Bill = mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSechema);

export default Bill;
export type { IBill };
