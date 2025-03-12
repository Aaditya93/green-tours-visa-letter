import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CallbackForm from "./contact-form";
import { Phone } from "lucide-react";
const ContactUsButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Phone className="h-6 w-6 text-blue-500" />
      </DialogTrigger>
      <DialogContent>
        <CallbackForm />
      </DialogContent>
    </Dialog>
  );
};
export default ContactUsButton;
