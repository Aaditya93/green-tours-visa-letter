import { Application } from "@/app/schemas/types";
import { IApplication } from "@/db/models/application";
import { ICompany } from "@/db/models/company";

interface Creator {
  _id: string;
  creator: string;
  role: string;
  createdDate: string;
  createdTime: string;
  handleBy: string;
}
interface EntryDetails {
  fromDate: string;
  toDate: string;
}

export interface PassportDetail {
  _id: string;
  fullName: string;
  passportNumber: string;
  originalNationality: string;
  nationalityCurrent: string;
  birthday: string;
  dateOfExpiry: string;
  passportType: string;
  sex: string;
  image: string;
  iref: string;
  stage: string;
}

interface ProcessingInfo {
  speed: string;

  notes?: string;
}

export interface SerializabledApplication {
  creator: Creator;
  _id: string;
  id: string;
  noOfVisa: number;
  code: number;
  isCompleted: boolean;
  isProcessing: boolean;
  passportDetails: PassportDetail[];
  job: string;
  workPlace: string;
  placeOfIssue: string;
  cost: number;
  currency: string;
  duration: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
  result: string;
  __v: number;
  entryDetails: EntryDetails;
  processingInfo: ProcessingInfo;
  travelDuration: string;
}

export function serializeIApplication(
  obj: IApplication | IApplication[] | undefined | null
): SerializabledApplication[] | SerializabledApplication {
  if (!obj) {
    return Array.isArray(obj) ? [] : {};
  }

  try {
    const serialized = JSON.stringify(obj, (key, value) => {
      if (value === undefined) {
        return null;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value && value._bsontype === "ObjectId") {
        return value.toString();
      }
      return value;
    });

    return JSON.parse(serialized);
  } catch (error) {
    console.error("Serialization error:", error);
    return Array.isArray(obj) ? [] : {};
  }
}
export function serializeICompany(obj: ICompany | undefined | null) {
  if (!obj) {
    return Array.isArray(obj) ? [] : {};
  }

  try {
    const serialized = JSON.stringify(obj, (key, value) => {
      if (value === undefined) {
        return null;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value && value._bsontype === "ObjectId") {
        return value.toString();
      }
      return value;
    });

    return JSON.parse(serialized);
  } catch (error) {
    console.error("Serialization error:", error);
    return Array.isArray(obj) ? [] : {};
  }
}

interface SerializeOptions {
  handleDates?: boolean;
  handleObjectIds?: boolean;
}

export function serializeData<T>(obj: T, options: SerializeOptions = {}): T {
  if (!obj) {
    return {} as T;
  }

  try {
    const serialized = JSON.stringify(obj, (key, value) => {
      if (value === undefined) {
        return null;
      }
      if (options.handleDates && value instanceof Date) {
        return value.toISOString();
      }
      if (options.handleObjectIds && value?._bsontype === "ObjectId") {
        return value.toString();
      }
      if (Array.isArray(value)) {
        return value.map((item) => (item === undefined ? null : item));
      }
      return value;
    });

    return JSON.parse(serialized);
  } catch (error) {
    console.error("Serialization failed:", error);
    return Array.isArray(obj) ? [] : ({} as T);
  }
}

export const serializedApplication = (obj: Application) =>
  serializeData(obj, { handleDates: true, handleObjectIds: true });

export const serializedApplications = (objs: Application[]) =>
  serializeData(objs, { handleDates: true, handleObjectIds: true });
