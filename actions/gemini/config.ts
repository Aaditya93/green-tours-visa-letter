import { GenerationConfig, SchemaType } from "@google/generative-ai";

export const PASSPORT_RECOGNITION_CONFIG: GenerationConfig = {
  temperature: 0.1, // Lower temperature for more deterministic OCR
  topP: 0.8,
  topK: 20,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
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
        type: SchemaType.STRING,
        description: "Surname followed by Given Names (SURNAME GIVEN_NAMES)",
      },
      dateOfExpiry: {
        type: SchemaType.STRING,
        description: "Date of expiry in DD/MM/YYYY format",
      },
      passport_number: {
        type: SchemaType.STRING,
        description: "Document/Passport number",
      },
      country: {
        type: SchemaType.STRING,
        description: "Full name of the issuing country",
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
      sex: { type: SchemaType.STRING, enum: ["Male", "Female"] },
      birthday: {
        type: SchemaType.STRING,
        description: "Date of birth in DD/MM/YYYY format",
      },
    },
  },
};

export const PASSPORT_PROMPT = `Act as a high-precision OCR system for travel documents. 
Extract details from the passport image following these rules:
1. Date Format: Strictly DD/MM/YYYY. Convert months to numbers.
2. Full Name: Combine Surname and Given Names (Format: SURNAME GIVEN_NAMES).
3. Country Mapping: For "Republic of China", return "China (Taiwan)".
4. Schema: Map values exactly to the provided JSON schema.
5. Reliability: If a value is unreadable, provide an empty string.`;
