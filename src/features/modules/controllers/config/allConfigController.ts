import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export interface AllConfigDropdownResponse {
  status: boolean;
  message: string;
  data: {
    positions: Array<{ id: string; name: string; level?: string; is_department_specific?: boolean; is_location_specific?: boolean }>;
    departments: Array<{ id: string; name: string; unique_code?: string }>;
    locations: Array<{ id: string; name: string; unique_code?: string; city?: string; state?: string }>;
    budget_lines: Array<{ id: string; name: string; description?: string }>;
    cost_categories: Array<{ id: string; name: string; description?: string }>;
    cost_groupings: Array<{ id: string; name: string; description?: string }>;
    financial_years: Array<{ id: string; year: string; is_current?: boolean }>;
    fco_numbers?: Array<{ id: string; name: string; number?: string; code?: string }>;
    cost_inputs?: Array<{ id: string; name: string; description?: string }>;
    funding_sources?: Array<{ id: string; name: string; description?: string }>;
    intervention_areas?: Array<{ id: string; name: string; code?: string }>;
  };
  counts: {
    positions: number;
    departments: number;
    locations: number;
    budget_lines: number;
    cost_categories: number;
    cost_groupings: number;
    financial_years: number;
    [key: string]: number;
  };
}

/**
 * Hook to get all configuration dropdown data from the comprehensive endpoint
 * This replaces individual API calls and permission-filtered endpoints
 */
export const useGetAllConfigDropdown = () => {
  const query = useQuery<AllConfigDropdownResponse>({
    queryKey: ["all-config-dropdown"],
    queryFn: async () => {
      try {
        console.log("🚀 Fetching comprehensive config data from backend...");
        const response = await AxiosWithToken.get("/config/all-dropdown/");
        console.log("✅ Comprehensive config data received:", response.data);
        console.log("📊 Data counts:", response.data?.counts);
        console.log("🔢 FCO Numbers in API response:", response.data?.data?.fco_numbers?.length || 0, "items");
        console.log("🔢 FCO Numbers details:", response.data?.data?.fco_numbers);
        return response.data;
      } catch (error) {
        console.error("❌ Failed to fetch comprehensive config data:", error);
        console.error("Error details:", {
          message: error?.message,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - config data doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
  });

  // Log errors when they occur
  if (query.error) {
    console.error("🚨 React Query error for comprehensive config:", query.error);
  }

  return query;
};

/**
 * Individual config data extractors for convenience
 */
export const useGetPositionsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.positions || [],
    count: data?.counts?.positions || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetDepartmentsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.departments || [],
    count: data?.counts?.departments || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetLocationsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.locations || [],
    count: data?.counts?.locations || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetBudgetLinesDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  const budgetLinesData = data?.data?.budget_lines || [];
  const count = data?.counts?.budget_lines || 0;

  console.log(`📊 Budget Lines Hook - Count: ${count}, Has Error: ${!!error}, Loading: ${isLoading}`);
  if (error) console.error("Budget Lines Hook Error:", error);

  return {
    data: budgetLinesData,
    count: count,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetCostCategoriesDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.cost_categories || [],
    count: data?.counts?.cost_categories || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetCostGroupingsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.cost_groupings || [],
    count: data?.counts?.cost_groupings || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetFinancialYearsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.financial_years || [],
    count: data?.counts?.financial_years || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

/**
 * Extended finance configs (if available in the endpoint)
 */
export const useGetFCONumbersDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  const fcoData = data?.data?.fco_numbers || [];
  const count = data?.counts?.fco_numbers || 0;

  console.log(`🔢 FCO Numbers Hook - Count: ${count}, Has Error: ${!!error}, Loading: ${isLoading}`);
  console.log("🔢 FCO Numbers Raw API Response Data:", {
    allData: data,
    fcoNumbers: data?.data?.fco_numbers,
    counts: data?.counts,
    fcoCount: data?.counts?.fco_numbers
  });
  if (error) console.error("FCO Numbers Hook Error:", error);

  return {
    data: fcoData,
    count: count,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetCostInputsDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.cost_inputs || [],
    count: data?.counts?.cost_inputs || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetFundingSourcesDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.funding_sources || [],
    count: data?.counts?.funding_sources || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

export const useGetInterventionAreasDropdown = () => {
  const { data, isLoading, error } = useGetAllConfigDropdown();

  return {
    data: data?.data?.intervention_areas || [],
    count: data?.counts?.intervention_areas || 0,
    isLoading,
    error,
    source: 'comprehensive-backend-endpoint'
  };
};

/**
 * Legacy compatibility - gradually replace the fallback approach
 * These maintain the same interface as the old controllers for easy migration
 */
export const useGetAllPositionsUnrestrictedV2 = useGetPositionsDropdown;
export const useGetAllDepartmentsUnrestrictedV2 = useGetDepartmentsDropdown;
export const useGetAllBudgetLinesUnrestrictedV2 = useGetBudgetLinesDropdown;