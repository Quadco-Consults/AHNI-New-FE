import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import React from "react";
import { PayGroup } from "../types/pay-group";
import {
  Employee,
  PayrollGeneration,
  GeneratedPayroll,
  PayrollSummary
} from "../types/payroll";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Paginated Response interface
interface TPaginatedResponse<T> {
  number_of_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    next_page_number: number | null;
    previous: string | null;
    previous_page_number: number | null;
  };
}

// Filter parameters interface
interface PayRollFilterParams {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employee-benefits/payroll/";

// ===== PAY ROLL HOOKS =====

// Get Pay Rolls
export const useGetPayRolls = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: PayRollFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<PayGroup>>>({
    queryKey: ["pay-rolls", search, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
          },
        });
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

// Get Single Pay Roll
export const useGetSinglePayroll = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PayGroup>>({
    queryKey: ["pay-roll", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Create Pay Roll
export const useCreatePayRoll = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PayGroup,
    Error,
    Partial<PayGroup>
  >({
    endpoint: BASE_URL,
    queryKey: ["pay-rolls"],
    isAuth: true,
    method: "POST",
  });

  const createPayRoll = async (details: Partial<PayGroup>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pay roll create error:", error);
    }
  };

  return { createPayRoll, data, isLoading, isSuccess, error };
};

// Get Employees for Payroll
export const useGetEmployeesForPayroll = (enabled: boolean = true) => {
  return useQuery<ApiResponse<Employee[]>>({
    queryKey: ["employees-for-payroll"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/hr/employees/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Generate Payroll (Mock Implementation - Backend endpoint not yet implemented)
export const useGeneratePayroll = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [data, setData] = React.useState<GeneratedPayroll | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const generatePayroll = async (details: PayrollGeneration) => {
    setIsLoading(true);
    setError(null);

    try {
      // MOCK IMPLEMENTATION - TODO: Replace with actual API call when backend is ready
      // API Specification for Backend:
      // POST /hr/employee-benefits/payroll/generate/
      // Request Body: { month: string, year: number, employees: string[] }
      // Response: { status: boolean, message: string, data: { id, month, year, total_employees, total_gross_payment, total_deductions, total_net_payment, employees: [...] } }

      console.log("🔧 MOCK: Generating payroll with data:", details);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock payroll data
      const mockPayrollData: GeneratedPayroll = {
        id: `payroll_${Date.now()}`,
        month: details.month,
        year: details.year,
        total_employees: details.employees.length,
        total_gross_payment: details.employees.length * 250000, // Mock: 250k per employee
        total_deductions: details.employees.length * 50000, // Mock: 50k deductions per employee
        total_net_payment: details.employees.length * 200000, // Mock: 200k net per employee
        status: "generated",
        created_at: new Date().toISOString(),
      };

      setData(mockPayrollData);
      setIsSuccess(true);

      console.log("✅ MOCK: Payroll generated successfully:", mockPayrollData);

      return mockPayrollData;
    } catch (err: any) {
      const errorObj = new Error(err?.message || "Failed to generate payroll");
      setError(errorObj);
      console.error("❌ MOCK: Payroll generation failed:", err);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePayroll, data, isLoading, isSuccess, error };
};

// Calculate Payroll Preview (Mock Implementation - Backend endpoint not yet implemented)
export const useCalculatePayrollPreview = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const calculatePreview = async (details: PayrollGeneration) => {
    setIsLoading(true);

    try {
      // MOCK IMPLEMENTATION - TODO: Replace with actual API call when backend is ready
      // API Specification for Backend:
      // POST /hr/employee-benefits/payroll/calculate-preview/
      // Request Body: { month: string, year: number, employees: string[] }
      // Response: { status: boolean, message: string, data: { total_employees, total_gross_payment, total_deductions, total_net_payment } }

      console.log("🔧 MOCK: Calculating payroll preview with data:", details);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock preview data
      const mockPreviewData: PayrollSummary = {
        total_employees: details.employees.length,
        total_gross_payment: details.employees.length * 250000, // Mock: 250k per employee
        total_deductions: details.employees.length * 50000, // Mock: 50k deductions per employee
        total_net_payment: details.employees.length * 200000, // Mock: 200k net per employee
      };

      console.log("✅ MOCK: Preview calculated successfully:", mockPreviewData);

      return mockPreviewData;
    } catch (error) {
      console.error("❌ MOCK: Preview calculation failed:", error);
      throw new Error("Failed to calculate preview");
    } finally {
      setIsLoading(false);
    }
  };

  return { calculatePreview, isLoading, isSuccess: false, error: null, data: null };
};

// Legacy exports for backward compatibility
export const useGetPayRollsQuery = useGetPayRolls;
export const useCreatePayRollMutation = useCreatePayRoll;