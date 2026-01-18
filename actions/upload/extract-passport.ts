"use server";

import fs from "fs/promises";
import path from "path";
import os from "os";
import { geminiModel, fileManager } from "./gemini-client";
import { PASSPORT_RECOGNITION_CONFIG, PASSPORT_PROMPT } from "./constants";

export interface PassportData {
  full_name: string;
  passport_number: string;
  country: string;
  sex: "Male" | "Female";
  birthday: string;
  dateOfExpiry: string;
}

export async function extractPassportData(
  formData: FormData,
): Promise<PassportData> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const tempDir = path.join(os.tmpdir(), "green-tours-ocr");
  const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);

  try {
    await fs.mkdir(tempDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempPath, buffer);

    const uploadResult = await fileManager.uploadFile(tempPath, {
      mimeType: file.type,
      displayName: file.name,
    });

    const chatSession = geminiModel.startChat({
      generationConfig: PASSPORT_RECOGNITION_CONFIG,
      history: [
        { role: "user", parts: [{ text: PASSPORT_PROMPT }] },
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      "Extract data from this document.",
    );
    return JSON.parse(result.response.text()) as PassportData;
  } catch (error) {
    console.error("Passport Extraction Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to extract passport data. Please try again.",
    );
  } finally {
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export const run = extractPassportData;
