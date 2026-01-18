"use server";

import { auth } from "@/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "./s3-client";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./constants";

type SignedURLResponse = Promise<
  | { failure?: undefined; success: { url: string } }
  | { failure: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  key: string;
};

export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
  key,
}: GetSignedURLParams): SignedURLResponse {
  try {
    const session = await auth();
    if (!session) return { failure: "Not authenticated" };

    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return { failure: "File type not allowed" };
    }

    if (fileSize > MAX_FILE_SIZE) {
      return { failure: "File size too large" };
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return { success: { url } };
  } catch (error) {
    console.error("Signed URL Error:", error);
    return {
      failure:
        error instanceof Error
          ? error.message
          : "Failed to generate signed URL",
    };
  }
}
