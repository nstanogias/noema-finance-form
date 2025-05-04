export interface FinancingRequest {
  requestor: string;
  originCountry: string;
  projectCode: string;
  description: string;
  amount: number;
  currency: string;
  validityStartDate: string;
  validityEndDate: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface Currency {
  code: string;
  name: string;
}

export const OPEC_COUNTRIES = [
  "Algeria",
  "Angola",
  "Congo",
  "Equatorial Guinea",
  "Gabon",
  "Iran",
  "Iraq",
  "Kuwait",
  "Libya",
  "Nigeria",
  "Saudi Arabia",
  "United Arab Emirates",
  "Venezuela",
];

// Project code validation regex: 4 uppercase letters followed by hyphen and 4 digits (1-9)
export const PROJECT_CODE_REGEX = /^[A-Z]{4}-[1-9]{4}$/;
