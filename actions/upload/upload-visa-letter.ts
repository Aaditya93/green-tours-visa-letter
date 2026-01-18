"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "./s3-client";
import { ActionResponse } from "@/actions/types";

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await s3Client.send(command);
}

export async function uploadVisaLetter(
  file: File,
  id: string,
  fileName: string,
): Promise<ActionResponse<string>> {
  try {
    if (!file || file.size === 0) {
      return { success: false, error: "Invalid file provided." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToS3(buffer, `visaletter/${id}/${fileName}`, "application/pdf");

    return {
      success: true,
      data: fileName,
      message: "Visa letter has been uploaded successfully.",
    };
  } catch (error) {
    console.error("Visa Letter Upload Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload visa letter.",
    };
  }
}
