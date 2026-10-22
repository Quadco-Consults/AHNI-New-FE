/**
 * Public HR Job Application Controller
 *
 * Handles job application submissions from public users (no authentication)
 */

import { useMutation } from "@tanstack/react-query";
import Axios from "@/constants/api_management/MyHttpHelper"; // No auth axios
import { AxiosError } from "axios";

// API Response interface
interface ApiResponse<TData = unknown> {
  status?: boolean;
  message: string;
  data: TData;
}

// Job Application form data interface
export interface PublicJobApplicationFormData {
  // Required fields
  job_id: string;
  applicant_first_name: string;
  applicant_last_name: string;
  applicant_email: string;
  position_applied: string;

  // Optional fields
  applicant_middle_name?: string;
  employment_type?: "INTERNAL" | "EXTERNAL" | "BOTH";
  application_notes?: string;

  // File uploads (will be handled separately)
  cover_letter?: File;
  resume?: File;
}

// Application response data
export interface JobApplicationResponseData {
  application_id: string;
  job_title: string;
  applicant_name: string;
  status: string;
  submitted_at: string;
  next_steps: string[];
}

// Application status data
export interface JobApplicationStatus {
  application_id: string;
  job_id: string;
  job_title: string;
  position_applied: string;
  status: string;
  status_display: string;
  submitted_at: string;
  updated_at: string;
  interview_date: string | null;
  contract_issued_date: string | null;
  contract_accepted_date: string | null;
  hired_date: string | null;
  next_steps: string[];
}

export interface ApplicationStatusResponseData {
  applications: JobApplicationStatus[];
  total_applications: number;
  applicant_name: string | null;
}

const BASE_URL = "/public/hr/jobs/";

/**
 * Submit HR job application
 */
export const useSubmitJobApplication = () => {
  return useMutation<ApiResponse<JobApplicationResponseData>, AxiosError, PublicJobApplicationFormData>({
    mutationFn: async (applicationData) => {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add text fields
      formData.append("job_id", applicationData.job_id);
      formData.append("applicant_first_name", applicationData.applicant_first_name);
      formData.append("applicant_last_name", applicationData.applicant_last_name);
      formData.append("applicant_email", applicationData.applicant_email);
      formData.append("position_applied", applicationData.position_applied);
      formData.append("employment_type", applicationData.employment_type || "EXTERNAL");

      if (applicationData.applicant_middle_name) {
        formData.append("applicant_middle_name", applicationData.applicant_middle_name);
      }

      if (applicationData.application_notes) {
        formData.append("application_notes", applicationData.application_notes);
      }

      // Add file uploads
      if (applicationData.cover_letter) {
        formData.append("cover_letter", applicationData.cover_letter);
      }

      if (applicationData.resume) {
        formData.append("resume", applicationData.resume);
      }

      const response = await Axios.post(
        `${BASE_URL}apply/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};

/**
 * Check job application status by email
 */
export const useCheckJobApplicationStatus = () => {
  return useMutation<ApiResponse<ApplicationStatusResponseData>, AxiosError, { email: string; job_id?: string }>({
    mutationFn: async ({ email, job_id }) => {
      const response = await Axios.post(
        `${BASE_URL}status/`,
        { email, job_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
};

// Pre-boarding form interfaces
export interface PreboardingFormData {
  application_id: string;
  position: string;
  job_title: string;
  applicant: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  };
  existing_data: Record<string, unknown>;
  instructions: string[];
}

export interface PreboardingSubmitData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  nationality?: string;
  state_of_origin?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

export interface PreboardingSubmitResponse {
  application_id: string;
  status: string;
  applicant_name: string;
  next_steps: string[];
}

const PREBOARDING_BASE_URL = "/public/hr/preboarding/";

/**
 * Get pre-boarding form details by token
 */
export const useGetPreboardingForm = (token: string) => {
  return useMutation<ApiResponse<PreboardingFormData>, AxiosError>({
    mutationFn: async () => {
      const response = await Axios.get(`${PREBOARDING_BASE_URL}${token}/`);
      return response.data;
    },
  });
};

/**
 * Submit pre-boarding form
 */
export const useSubmitPreboardingForm = (token: string) => {
  return useMutation<ApiResponse<PreboardingSubmitResponse>, AxiosError, PreboardingSubmitData>({
    mutationFn: async (preboardingData) => {
      const response = await Axios.post(
        `${PREBOARDING_BASE_URL}${token}/submit/`,
        preboardingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
};

// Onboarding form interfaces
export interface OnboardingFormData {
  employee_id: string;
  position: string;
  department: string;
  location: string;
  employee: {
    legal_firstname: string;
    legal_middlename: string;
    legal_lastname: string;
    email: string;
    phone_number: string;
    address: string;
  };
  existing_data: Record<string, unknown>;
  instructions: string[];
}

export interface OnboardingSubmitData {
  // Personal Information
  legal_firstname: string;
  legal_middlename?: string;
  legal_lastname: string;
  date_of_birth?: string;
  marital_status?: string;
  gender?: string;

  // Contact Information
  email: string;
  phone_number: string;
  other_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;

  // Identity Documents
  ss_number?: string;
  nin_number?: string;
  tax_id?: string;
  passport_number?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  emergency_contact_address?: string;

  // Banking Information
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  bvn?: string;

  // Educational Background
  highest_qualification?: string;
  institution?: string;
  course_of_study?: string;
  graduation_year?: string;

  // Previous Employment
  previous_employer?: string;
  previous_position?: string;
  years_of_experience?: string;

  // Health Information
  blood_group?: string;
  genotype?: string;
  medical_conditions?: string;
  allergies?: string;

  // Next of Kin
  nok_name?: string;
  nok_relationship?: string;
  nok_phone?: string;
  nok_address?: string;

  // Professional Details
  professional_certifications?: string;
  professional_memberships?: string;

  // System Requirements
  own_computer?: boolean;
  require_email_access?: boolean;
}

export interface OnboardingSubmitResponse {
  employee_id: string;
  employee_name: string;
  onboarding_status: string;
  next_steps: string[];
}

const ONBOARDING_BASE_URL = "/public/hr/onboarding/";

/**
 * Get onboarding form details by token
 */
export const useGetOnboardingForm = (token: string) => {
  return useMutation<ApiResponse<OnboardingFormData>, AxiosError>({
    mutationFn: async () => {
      const response = await Axios.get(`${ONBOARDING_BASE_URL}${token}/`);
      return response.data;
    },
  });
};

/**
 * Submit onboarding form
 */
export const useSubmitOnboardingForm = (token: string) => {
  return useMutation<ApiResponse<OnboardingSubmitResponse>, AxiosError, OnboardingSubmitData>({
    mutationFn: async (onboardingData) => {
      const response = await Axios.post(
        `${ONBOARDING_BASE_URL}${token}/submit/`,
        onboardingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
};
