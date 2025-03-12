"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error("API key is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export const uploadToGemini = async (path: string, mimeType: string) => {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;

  return file;
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.4,
  topP: 0.8,
  topK: 20,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    required: [
      "full_name",
      "passport_number",
      "country",
      "sex",
      "birthday",
      "dateOfExpiry",
    ],
    properties: {
      full_name: {
        type: "string",
      },
      dateOfExpiry: {
        type: "string",
        description: "Date in DD/MM/YYYY format",
        pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
      },
      passport_number: {
        type: "string",
      },
      country: {
        type: "string",
        enum: [
          "Australia",
          "Bangladesh",
          "Canada",
          "China",
          "China (Taiwan)",
          "India",
          "Netherland",
          "Nepal",
          "Egypt",
          "New Zealand",
          "Pakistan",
          "Saint Kitts and Nevis",
          "South Africa",
          "Sri Lanka",
          "Turkey",
          "Turkmenistan",
          "United States",
          "United Kingdom (British Citizen)",
          "Uzbekistan",
          "Vanuatu",
        ],
      },
      sex: {
        type: "string",
        enum: ["Male", "Female"],
      },
      birthday: {
        type: "string",
        description: "Date in DD/MM/YYYY format",
        pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
      },
    },
  },
};

export const run = async (formData: FormData) => {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Create a temporary path to save the file
  const tempDir = path.join(process.cwd(), "tmp/uploads");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempPath = path.join(tempDir, file.name);

  // Save the file to the temporary directory
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(tempPath, Buffer.from(fileBuffer));

  const files = [await uploadToGemini(tempPath, file.type)];
  fs.unlinkSync(tempPath);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
          {
            text: 'return All values birth date format - DD/MM/YYYY example - 30/10/2003. In birthdate convert the month to number , Write the full name of the country whose passport is in the image example - China. if you see republic of china then country = China(Taiwan) In full name write surname first then given name  \\"DocumentType: full_name: country: birthday: dateOfExpiry: sex: passport_number: \\" \\n',
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `{
              "birthday date": "04/02/1965",
              "dateOfExpiry": "04/02/2029",
              "full_name": "GHANSHAMDAS SANJAY",
              "passport number": "P311V4819",
              "sex": "male",
              "country": "INDIA"
            }`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");

  const jsonResponse = JSON.parse(result.response.text());

  return jsonResponse;
};
