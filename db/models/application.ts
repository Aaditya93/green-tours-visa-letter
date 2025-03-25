import mongoose, { Document, Schema, Model } from "mongoose";

// Interface definitions
interface IPassportDetails {
  _id: string;
  fullName: string;
  birthday: Date;
  dateOfExpiry: Date;
  sex: string;
  nationalityCurrent: string;
  originalNationality: string;
  passportType: string;
  passportNumber: string;
  image: string;
  iref: string;
  stage: string;
  immigrationFee: IImmigrationFee;
  bill: boolean;
  payment: boolean;
}

interface IEntryDetails {
  fromDate: Date;
  toDate: Date;
}
interface IImmigrationFee {
  name: string;
  id: string;
  amount: number;
  currency: string;
}

interface ICreator {
  _id: string;
  role: string;
  handleBy: string;
  creator: string;
  companyId?: string;
  createdDate: Date;
  createdTime: string;
}

interface IProcessingInfo {
  speed: string;

  notes?: string;
}

interface IApplication extends Document {
  id: string;
  _id: string;
  noOfVisa: number;
  code: number;
  isCompleted?: boolean;
  isProcessing?: boolean;
  job: string;
  workPlace: string;
  result: Date;
  passportDetails: IPassportDetails[];
  purpose: string;
  placeOfIssue: string;
  duration: string;
  entryDetails: IEntryDetails;
  creator: ICreator;
  cost: number;
  currency: string;
  travelDuration: number;
  processingInfo: IProcessingInfo;
}

// Schema definitions
const immigrationFeeSchema = new Schema<IImmigrationFee>({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
});
const passportDetailsSchema = new Schema<IPassportDetails>({
  fullName: {
    type: String,

    trim: true,
  },
  birthday: {
    type: Date,
  },
  dateOfExpiry: {
    type: Date,
  },
  sex: {
    type: String,
  },
  passportType: {
    type: String,
  },
  originalNationality: {
    type: String,
  },
  nationalityCurrent: {
    type: String,
  },
  passportNumber: {
    type: String,
  },
  image: {
    type: String,
  },
  iref: {
    type: String,
  },
  stage: {
    type: String,
  },
  immigrationFee: immigrationFeeSchema,
  bill: {
    type: Boolean,
  },
  payment: {
    type: Boolean,
  },
});

const applicationSchema = new Schema<IApplication>(
  {
    id: {
      type: String,
      unique: true,
    },
    noOfVisa: {
      type: Number,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    result: {
      type: Date,
    },
    cost: {
      type: Number,
    },
    currency: {
      type: String,
    },
    travelDuration: {
      type: Number,
    },

    passportDetails: [passportDetailsSchema],
    job: {
      type: String,
      required: true,
    },
    workPlace: {
      type: String,
    },
    purpose: {
      type: String,
      required: true,
    },

    placeOfIssue: {
      type: String,
    },
    duration: {
      type: String,
    },
    entryDetails: {
      fromDate: {
        type: Date,
      },
      toDate: {
        type: Date,
      },
    },
    creator: {
      _id: {
        type: String,
      },
      handleBy: {
        type: String,
      },
      companyId: {
        type: String,
      },
      role: {
        type: String,
      },
      creator: {
        type: String,
        required: true,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      createdTime: {
        type: String,
        required: true,
      },
    },
    processingInfo: {
      speed: {
        type: String,
      },

      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);
export default Application;
export type {
  IApplication,
  IPassportDetails,
  IEntryDetails,
  ICreator,
  IProcessingInfo,
  IImmigrationFee,
};
