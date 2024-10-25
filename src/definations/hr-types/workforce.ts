import { DepartmentsResultsData } from "definations/configs/departments";
import { LocationResultsData } from "definations/configs/location";
import { HrGradeResults } from "./hr-grades";

export type WorkforceEmergencyContactOne = {
  name: string;
  relationship: string;
  phone_number_1: string;
  phone_number_2: string;
  email: string;
  address: string;
};
export type WorkforceEmergencyContactTwo = {
  name: string;
  relationship: string;
  phone_number_1: string;
  phone_number_2: string;
  email: string;
  address: string;
};
export type WorkforceBankAccount = {
  bank_name: string;
  branch_name: string;
  account_name: string;
  account_number: string;
  sort_code: string;
  date_provided: string;
};
export type WorkforcePension = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  rsa_number: string;
  pfc_account_name: string;
  pfc_account_number: string;
  date_provided: string;
  status: true;
  employee: string;
};
export type WorkforceQualificationResult = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  institution: string;
  year: string;
  document: string;
  employee: string;
};

export type WorkforceUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  designation: string;
};

export type WorkforceResults = {
  id: string;
  user: WorkforceUser;
  emergency_contact_one: WorkforceEmergencyContactOne;
  emergency_contact_two: WorkforceEmergencyContactTwo;
  created_at: string;
  updated_at: string;
  employee_number: string;
  employment_type: string;
  employment_status: string;
  date_of_hire: string;
  date_of_leaving: string;
  signature: string;
  passport: string;
  date_of_birth: string;
  address: string;
  marital_status: string;
  religion: string;
  location: LocationResultsData;
  department: DepartmentsResultsData;
  position: HrGradeResults;
  grade: string;
};

export const workforceAdditionalInfoValues = {
  date_of_birth: "",
  address: "",
  marital_status: "",
  religion: "",
  emergency_contact_one: {
    name: "",
    relationship: "",
    phone_number_1: "",
    phone_number_2: "",
    email: "",
    address: "",
  },
  emergency_contact_two: {
    name: "",
    relationship: "",
    phone_number_1: "",
    phone_number_2: "",
    email: "",
    address: "",
  },
};
