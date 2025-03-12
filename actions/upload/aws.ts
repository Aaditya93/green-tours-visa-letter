"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {  ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "";
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

// const fileBuffer = await sharp(file)
// .jpeg({quality: 50})
// .resize(800, 400)
// .toBuffer();
function generateImageName() {
  const timestamp = Date.now(); // Get current timestamp
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
  return `image_${timestamp}_${randomString}`; // Combine timestamp and random string
}

async function uploadFileToS3(buffer: Buffer, id: string) {
  const fileName = generateImageName() + ".jpg";

  const params = {
    Bucket: BUCKET_NAME,
    Key: `passport/${id}/${fileName}`,
    Body: buffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    return fileName;
  } catch (error) {
    throw error;
  }
}

export async function uploadFile(file: File, id: string) {
  try {
    if (!file || file.size === 0) {
      return { status: "error", message: "Please select a valid file." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFileToS3(buffer, id);

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
}





export async function deleteS3Folder(prefix: string) {
  

  try {

    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME ,
      Prefix: `passport/${prefix}/`
    });
    const listedObjects = await s3Client.send(listCommand);


    if (!listedObjects.Contents?.length) {
      return { success: true, message: 'Folder is already empty' };
    }

    // Prepare objects for bulk deletion
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key }))
      }
    };


    const deleteCommand = new DeleteObjectsCommand(deleteParams);
     await s3Client.send(deleteCommand);

    return { success: true, message: 'Folder deleted successfully' };
  } catch (error) {
    console.error('Error deleting folder:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
