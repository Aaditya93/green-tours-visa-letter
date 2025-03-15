export const defaultLocale = "en";
export const locales = ["en", "zh-cn"]; // Add other languages if needed

export type Locale = (typeof locales)[number];

// Optional: Configure messages and timeZone
export default {
  defaultLocale,
  locales,
  // You can add more configuration here if needed
};
