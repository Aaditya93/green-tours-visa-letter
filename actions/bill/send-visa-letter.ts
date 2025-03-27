"use server";
import VisaLetter from "@/db/models/visaLetter";
import { uploadVisaLetter } from "../upload/aws";
import Application from "@/db/models/application";
import { sendVisaLetterReadyEmail } from "@/lib/mail";
import dbConnect from "@/db/db";

export const markApplicationsAsSent = async (passportIds: string[]) => {
  try {
    await Application.updateMany(
      { "passportDetails._id": { $in: passportIds } },
      { $set: { "passportDetails.$[elem].stage": "Delivered" } },
      { arrayFilters: [{ "elem._id": { $in: passportIds } }] }
    );
    return {
      status: "success",
      message: "Applications have been marked as sent.",
    };
  } catch (error) {
    console.error("Failed to mark applications as sent:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark applications as sent.",
    };
  }
};
export const CreateVisaLetter = async (
  file: File,
  company: any,
  selectedApplicants: any,
  id: string
) => {
  try {
    if (!file || file.size === 0) {
      return { status: "error", message: "Please select a valid file." };
    }
    const awsUrl = process.env.S3_AWS_URL || "";
    console.log("file", selectedApplicants);
    console.log("company", company);
    await uploadVisaLetter(file, id, file.name);
    await VisaLetter.create({
      visaLetterId: id,
      passportIds: selectedApplicants,
      companyName: company.name,
      companyId: company.id,
      companyAddress: company.companyAddress,
      companyEmail: company.companyEmail,
      visaLetter: `${awsUrl}visaletter/${id}/${file.name}`,
    });
    await markApplicationsAsSent(selectedApplicants);
    await sendVisaLetterReadyEmail(
      company.name,
      company.companyEmail,
      id,
      selectedApplicants.length,
      file.name
    );

    return {
      status: "success",
      message: "File has been uploaded.",
    };
  } catch (error) {
    console.error("Failed to upload file:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to upload file.",
    };
  }
};

export const getVisaLetter = async (id: string) => {
  try {
    await dbConnect();
    const visaletter = await VisaLetter.findById(id).lean();

    return visaletter;
  } catch (error) {
    console.error("Failed to get visa letter:", error);
  }
};

export const getApplicationsByPassportIds = async (passportIds: string[]) => {
  try {
    await dbConnect();
    const applications = await Application.find({
      "passportDetails._id": { $in: passportIds },
    }).lean();
    return applications;
  } catch (error) {
    console.error("Failed to get applications by passport ids:", error);
  }
};
