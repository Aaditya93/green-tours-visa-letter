import mongoose, { Document, Schema } from "mongoose";

// Define the interface for VisaLetter document
export interface VisaLetterDocument extends Document {
  visaLetterId: string;
  passportIds: string[];
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyId: string; // Company ID
  visaLetter: string; // URL or path to the uploaded document
  createdDate: Date;
}

// Create the schema
const VisaLetterSchema = new Schema({
  visaLetterId: {
    type: String,
    required: true,
    unique: true,
  },
  passportIds: {
    type: [String],
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  visaLetter: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
export const VisaLetter =
  mongoose.models.VisaLetter ||
  mongoose.model<VisaLetterDocument>("VisaLetter", VisaLetterSchema);

export default VisaLetter;
