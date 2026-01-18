export interface UpdatePassportDetails {
  full_name: string;
  birthday: Date;
  sex: string;
  current_nationality: string;
  passport_number: string;
  original_nationality: string;
  dateOfExpiry: Date;
  passport_type: string;
}

export interface PassportDetails {
  full_name: string;
  country: string;
  birthday: string;
  dateOfExpiry: string;
  sex: string;
  passport_number: string;
}

export interface ManualInfo {
  duration: string;
  speed: string;
  note?: string;
  handled_by: string;
  from_date: Date;
  to_date: Date;
  airport?: string;
  embassy?: string;
  result: Date;
  stage: string;
}

export interface PriceEntry {
  speed: string;
  price: number;
}
