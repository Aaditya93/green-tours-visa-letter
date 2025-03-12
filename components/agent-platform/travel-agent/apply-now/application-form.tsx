"use client";
import { AiOutlineDelete } from "react-icons/ai";
import { SerializabledApplication } from "@/config/serialize";
import PassportFormTravelAgent from "./passport-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteApplication } from "@/actions/application/model";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import ManualFormTravelAgent from "./manual-form";

interface ApplicationFormProps {
  Application: SerializabledApplication;
}

const ApplicationFormTravelAgent = ({ Application }: ApplicationFormProps) => {
  const router = useRouter();

  const passportDetails = Application.passportDetails;
  const [calltoast, setCallToast] = useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success("Application has been deleted", {});
    }
  }, [calltoast]);

  return (
    <div className="space-y-2">
      <div className="relative flex items-center justify-between p-4 ">
        <h2 className="text-2xl font-semibold">
          Visa Application
          <Badge variant={"secondary"} className=" text-sm ml-4">
            {Application.noOfVisa > 1 ? "Group" : "Individual"}
          </Badge>
          {Application.noOfVisa > 1 && (
            <Badge variant="secondary" className="text-sm ml-4">
              {Application.noOfVisa} Members
            </Badge>
          )}
        </h2>
        {Application.passportDetails[0].stage === "Not Processed" && (
          <Button
            variant="ghost"
            size={"icon"}
            onClick={() => {
              deleteApplication(
                Application?._id.toString() || "",
                Application?.id.toString() || ""
              );
              router.push("/application/10");

              setCallToast(true);
            }}
            className="p-2 text-red-500 hover:bg-red-50"
          >
            <AiOutlineDelete className="w-14 h-14" />
          </Button>
        )}
      </div>
      <div className="space-y-8">
        {passportDetails.map((passport, index) => (
          <PassportFormTravelAgent
            key={index}
            index={index}
            noOfVisa={Application.noOfVisa}
            passportId={passportDetails[index]._id || ""}
            id={Application._id || ""}
            passportDetails={passportDetails[index]}
          />
        ))}

        <ManualFormTravelAgent
          Application={Application}
          id={Application._id || ""}
        />
      </div>
    </div>
  );
};

export default ApplicationFormTravelAgent;
