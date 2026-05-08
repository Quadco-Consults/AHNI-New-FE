/**
 * Public Application Controller
 *
 * Handles consultant, adhoc, and facilitator application submissions from public users (no authentication)
 */

import { useMutation } from "@tanstack/react-query";
import Axios from "@/constants/api_management/MyHttpHelper"; // No auth axios
import { AxiosError } from "axios";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Application form data interface
export interface PublicApplicationFormData {
  // Required fields
  name: string;
  email: string;
  phone_number: string;
  type: "CONSULTANT" | "ADHOC" | "FACILITATOR";
  contract_request?: string;

  // Optional fields
  contractor_name?: string;
  place_of_birth?: string;
  address?: string;
  citizenship?: string;
  proposed_salary?: number;
  start_duration_date?: string;
  end_duration_date?: string;

  // JSON fields
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    field_of_study?: string;
  }>;

  language_proficiency?: Array<{
    language: string;
    proficiency: string; // Speaking, Reading, Writing
  }>;

  employment_history?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;

  special_consultant_services?: Array<{
    service: string;
    description: string;
  }>;
}

// Application response data
export interface ApplicationResponseData {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  created_datetime: string;
}

const BASE_URL = "/public/applications/";

/**
 * Submit consultant application
 */
export const useSubmitConsultantApplication = (consultantId: string) => {
  return useMutation<ApiResponse<ApplicationResponseData>, AxiosError, PublicApplicationFormData>({
    mutationFn: async (applicationData) => {
      const response = await Axios.post(
        `${BASE_URL}consultant/${consultantId}/`,
        applicationData,
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

/**
 * Submit adhoc application
 */
export const useSubmitAdhocApplication = (adhocId: string) => {
  return useMutation<ApiResponse<ApplicationResponseData>, AxiosError, PublicApplicationFormData>({
    mutationFn: async (applicationData) => {
      const response = await Axios.post(
        `${BASE_URL}adhoc/${adhocId}/`,
        applicationData,
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

/**
 * Submit facilitator application
 */
export const useSubmitFacilitatorApplication = (facilitatorId: string) => {
  return useMutation<ApiResponse<ApplicationResponseData>, AxiosError, PublicApplicationFormData>({
    mutationFn: async (applicationData) => {
      const response = await Axios.post(
        `${BASE_URL}facilitator/${facilitatorId}/`,
        applicationData,
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

/**
 * Generic application submission (when type is known)
 */
export const useSubmitApplication = () => {
  return useMutation<ApiResponse<ApplicationResponseData>, AxiosError, PublicApplicationFormData>({
    mutationFn: async (applicationData) => {
      const response = await Axios.post(
        BASE_URL,
        applicationData,
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

/**
 * Upload document for an application
 */
export interface DocumentUploadData {
  applicantId: string;
  document: File;
  name?: string;
}

export const useUploadApplicationDocument = () => {
  return useMutation<ApiResponse<any>, AxiosError, DocumentUploadData>({
    mutationFn: async ({ applicantId, document, name }) => {
      const formData = new FormData();
      formData.append('document', document);
      formData.append('name', name || document.name);

      const response = await Axios.post(
        `${BASE_URL}${applicantId}/documents/`,
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
