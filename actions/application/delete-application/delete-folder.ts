"use server";

import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../../s3/s3-client";

export async function deleteS3Folder(folderPath: string): Promise<void> {
  if (!folderPath) return;

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folderPath,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const objectsToDelete = listedObjects.Contents.map(({ Key }) => ({
      Key,
    })).filter((obj): obj is { Key: string } => !!obj.Key);

    if (objectsToDelete.length === 0) return;

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
      },
    });

    await s3Client.send(deleteCommand);

    if (listedObjects.IsTruncated) {
      await deleteS3Folder(folderPath); // Recursive call for paginated results
    }
  } catch (error) {
    console.error("S3 Folder Deletion Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete folder from S3.",
    );
  }
}
