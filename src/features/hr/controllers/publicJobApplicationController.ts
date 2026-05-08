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
