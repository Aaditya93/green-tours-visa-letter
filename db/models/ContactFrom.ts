import mongoose, { Document, Model } from "mongoose";

interface IContactForm extends Document {
  name: string;
  email: string;
  mobile: string;
  date: Date;
}

const ContactFormSchema = new mongoose.Schema<IContactForm>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ContactForm: Model<IContactForm> =
  mongoose.models.ContactForm ||
  mongoose.model<IContactForm>("ContactForm", ContactFormSchema);

export default ContactForm;
