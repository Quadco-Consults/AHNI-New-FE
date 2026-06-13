import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { ProcurementPlanListSchema } from "definitions/procurement-validator";
import {
  ProcurementPlanData,
  ProcurementPlanResponse,
  ProcurementPlanResultsData,
} from "../types/procurementPlan";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";

const BASE_URL = "procurements/procurement-plans-new/";

// ===== PROCUREMENT PLAN HOOKS =====

// Download Procurement Plan Template
export const useDownloadProcurementPlanTemplate = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["procurement-plan-template"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}template/`,
          {
            responseType: "blob",
          }
        );
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "procurement-plan-template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get All Procurement Plans
export const useGetAllProcurementPlans = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  year = "",
  enabled = true,
}: TRequest & { year?: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ["procurement-plans", page, size, search, status, year],
    queryFn: async () => {
      try {
        const params: any = { page, size };
        if (search) params.search = search;
        if (status) params.status = status;
        if (year) params.financial_year = year;

        const response = await AxiosWithToken.get(BASE_URL, { params });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Procurement plans fetch error:", axiosError);
        throw new Error(
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Failed to fetch procurement plans"
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Procurement Plan
export const useGetSingleProcurementPlan = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ProcurementPlanResultsData>>({
    queryKey: ["procurement-plan", id],
    queryFn: async () => {
      try {
        // Try fetching with size parameter to get all items
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`, {
          params: {
            size: 10000, // Request a large number to get all items
          }
        });

        console.log("Raw API Response for procurement plan:", response.data);

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get All Procurement Plans by Project and Financial Year
export const useGetProcurementPlansByProject = (
  projectId: string,
  financialYear: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["procurement-plans-by-project", projectId, financialYear],
    queryFn: async () => {
      try {
        console.log(`Fetching all procurement plans for project: ${projectId}, year: ${financialYear}`);

        const response = await AxiosWithToken.get(`${BASE_URL}by-project/`, {
          params: {
            project_id: projectId,
            financial_year: financialYear,
            size: 10000, // Get all items
          }
        });

        console.log("✅ All plans by project fetched:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ Failed to fetch plans by project:", axiosError);
        throw new Error(
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Failed to fetch procurement plans by project"
        );
      }
    },
    enabled: enabled && !!projectId && !!financialYear,
    refetchOnWindowFocus: false,
  });
};

// Upload Procurement Plan (Bulk upload from Excel)
export const useUploadProcurementPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    { project: string; financial_year: string; file: File }
  >({
    endpoint: `${BASE_URL}upload/`,
    queryKey: ["procurement-plans"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const uploadProcurementPlan = async (details: {
    project: string;
    financial_year: string;
    file: File;
  }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("project", details.project);
      formData.append("financial_year", details.financial_year);
      formData.append("file", details.file);

      const response = await callApi(formData as any);
      return response; // Return the response so caller can check it
    } catch (error) {
      console.error("Procurement plan upload error:", error);
      throw error;
    }
  };

  return { uploadProcurementPlan, data, isLoading, isSuccess, error };
};

// Legacy export for backward compatibility
export const useCreateProcurementPlan = useUploadProcurementPlan;

// Update Procurement Plan (Full Update)
export const useUpdateProcurementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ProcurementPlanResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["procurement-plans", "procurement-plan"],
    isAuth: true,
    method: "PUT",
  });

  const updateProcurementPlan = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Procurement plan update error:", error);
    }
  };

  return { updateProcurementPlan, data, isLoading, isSuccess, error };
};

// Modify Procurement Plan (Partial Update)
export const useModifyProcurementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ProcurementPlanResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["procurement-plans", "procurement-plan"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyProcurementPlan = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Procurement plan modify error:", error);
    }
  };

  return { modifyProcurementPlan, data, isLoading, isSuccess, error };
};

// Delete Procurement Plan
export const useDeleteProcurementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["procurement-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteProcurementPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Procurement plan delete error:", error);
    }
  };

  return { deleteProcurementPlan, data, isLoading, isSuccess, error };
};

// Get Procurement Plan Line Items
export const useGetProcurementPlanLineItems = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["procurement-plan-line-items", id],
    queryFn: async () => {
      try {
        // Try multiple possible endpoint patterns
        let response;
        const possibleEndpoints = [
          `${BASE_URL}${id}/items/`,
          `${BASE_URL}${id}/line-items/`,
          `${BASE_URL}items/?procurement_plan=${id}`,
          `${BASE_URL}line-items/?procurement_plan=${id}`,
        ];

        let lastError;
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying to fetch line items from: ${endpoint}`);
            response = await AxiosWithToken.get(endpoint, {
              params: { size: 10000 }
            });
            console.log(`✅ Success! Line items found at: ${endpoint}`, response.data);
            return response.data;
          } catch (err) {
            console.log(`❌ Endpoint ${endpoint} failed:`, err);
            lastError = err;
            continue;
          }
        }

        // If all endpoints fail, throw the last error
        throw lastError;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ All line items endpoints failed. Backend may need to implement this endpoint.");
        throw new Error(
          "Line items endpoint not available. The backend needs to implement an endpoint to return procurement plan line items."
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry since we're trying multiple endpoints
  });
};

// Update Procurement Plan Line Item
export const useUpdateProcurementPlanLineItem = (lineItemId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    any
  >({
    endpoint: `${BASE_URL}line-items/${lineItemId}/`,
    queryKey: ["procurement-plan-line-items", "procurement-plan"],
    isAuth: true,
    method: "PATCH",
  });

  const updateLineItem = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Procurement plan line item update error:", error);
      throw error;
    }
  };

  return { updateLineItem, data, isLoading, isSuccess, error };
};

// Download Single Procurement Plan
export const useDownloadSingleProcurementPlan = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["download-procurement-plan", id],
    queryFn: async () => {
      try {
        // Try multiple possible endpoint patterns
        let response;
        try {
          // First try: specific plan download
          response = await AxiosWithToken.get(
            `${BASE_URL}${id}/download/`,
            {
              responseType: "blob",
            }
          );
        } catch (error) {
          // Second try: export with ID parameter
          response = await AxiosWithToken.get(
            `${BASE_URL}export/`,
            {
              params: { id },
              responseType: "blob",
            }
          );
        }

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `procurement-plan-${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Download not available: " + (axiosError.response?.data as any)?.message || "Backend endpoint not implemented");
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useDownloadProcurementPlanTemplateQuery = useDownloadProcurementPlanTemplate;
export const useLazyDownloadProcurementPlanTemplateQuery = useDownloadProcurementPlanTemplate;
export const useGetProcurementPlansQuery = useGetAllProcurementPlans;
export const useGetProcurementPlanQuery = useGetSingleProcurementPlan;
export const useCreateProcurementPlanMutation = useCreateProcurementPlan;
export const useUpdateProcurementPlanMutation = useUpdateProcurementPlan;
export const useModifyProcurementPlanMutation = useModifyProcurementPlan;
export const useDeleteProcurementPlanMutation = useDeleteProcurementPlan;

// Default export for backward compatibility
const ProcurementPlanAPI = {
  useDownloadProcurementPlanTemplate,
  useDownloadSingleProcurementPlan,
  useGetAllProcurementPlans,
  useGetSingleProcurementPlan,
  useGetProcurementPlansByProject,
  useGetProcurementPlanLineItems,
  useUpdateProcurementPlanLineItem,
  useCreateProcurementPlan,
  useUpdateProcurementPlan,
  useModifyProcurementPlan,
  useDeleteProcurementPlan,
  useDownloadProcurementPlanTemplateQuery,
  useLazyDownloadProcurementPlanTemplateQuery,
  useGetProcurementPlansQuery,
  useGetProcurementPlanQuery,
  useCreateProcurementPlanMutation,
  useUpdateProcurementPlanMutation,
  useModifyProcurementPlanMutation,
  useDeleteProcurementPlanMutation,
};

export default ProcurementPlanAPI;