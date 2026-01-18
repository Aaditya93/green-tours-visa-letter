"use server";

import dbConnect from "@/db/db";
import VisaLetter from "@/db/models/visaLetter";
import { uploadVisaLetter } from "../../s3/upload-visa-letter";
import { markApplicationsAsSent } from "./mark-sent";
import { sendVisaLetterReadyEmail } from "@/lib/mail";
import { ActionResponse } from "@/actions/types";

/**
 * Uploads a visa letter and creates a record in the database.
 */
export const createVisaLetter = async (
  file: File,
  company: {
    id: string;
    name: string;
    companyAddress: string;
    companyEmail: string;
  },
  selectedApplicants: string[],
  id: string,
): Promise<ActionResponse<string>> => {
  try {
    await dbConnect();

    if (!file || file.size === 0) {
      return { success: false, error: "Please select a valid file." };
    }

    const awsUrl = process.env.S3_AWS_URL || "";

    // Upload to S3
    const uploadResult = await uploadVisaLetter(file, id, file.name);
    if (!uploadResult.success) {
      return uploadResult;
    }

    // Create DB entry
    const visaLetter = await VisaLetter.create({
      visaLetterId: id,
      passportIds: selectedApplicants,
      companyName: company.name,
      companyId: company.id,
      companyAddress: company.companyAddress,
      companyEmail: company.companyEmail,
      visaLetter: `${awsUrl}visaletter/${id}/${file.name}`,
    });

    // Update applications status
    await markApplicationsAsSent(selectedApplicants);

    // Send email notification
    await sendVisaLetterReadyEmail(
      company.name,
      company.companyEmail,
      id,
      selectedApplicants.length,
      file.name,
    );

    return { success: true, data: visaLetter._id.toString() };
  } catch (error) {
    console.error("Failed to create visa letter:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create visa letter",
    };
  }
};
