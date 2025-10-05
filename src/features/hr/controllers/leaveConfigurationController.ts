import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Configuration Statistics interface
export interface ConfigurationStats {
  totalLeaveTypes: number;
  employeesWithEntitlements: number;
  activePolicies: number;
  upcomingHolidays: number;
}

/**
 * Hook to get leave configuration statistics
 * Fetches data from multiple endpoints to populate the configuration dashboard
 */
export const useGetConfigurationStats = (enabled: boolean = true) => {
  return useQuery<ConfigurationStats>({
    queryKey: ["leave-configuration-stats"],
    queryFn: async () => {
      try {
        // Fetch all required data in parallel
        const [leaveTypesRes, leaveBalancesRes] = await Promise.all([
          // Get leave types count
          AxiosWithToken.get("hr/leave-package/"),
          // Get leave balances to count employees with entitlements
          AxiosWithToken.get("hr/leave-balance/", { params: { size: 1000 } }),
        ]);

        // Extract leave types count
        const leaveTypesData = Array.isArray(leaveTypesRes.data?.data)
          ? leaveTypesRes.data.data
          : Array.isArray(leaveTypesRes.data?.data?.results)
          ? leaveTypesRes.data.data.results
          : [];

        const totalLeaveTypes = leaveTypesData.length;

        // Extract unique employees with entitlements
        const balancesData = Array.isArray(leaveBalancesRes.data?.data)
          ? leaveBalancesRes.data.data
          : Array.isArray(leaveBalancesRes.data?.data?.results)
          ? leaveBalancesRes.data.data.results
          : [];

        // Count unique employees
        const uniqueEmployees = new Set(
          balancesData.map((balance: any) => balance.employee)
        );
        const employeesWithEntitlements = uniqueEmployees.size;

        // Note: Policies and holidays endpoints don't exist yet in the backend
        // Using placeholder values for now
        const activePolicies = 0;
        const upcomingHolidays = 0;

        return {
          totalLeaveTypes,
          employeesWithEntitlements,
          activePolicies,
          upcomingHolidays,
        };
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Configuration stats error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
        });

        // Return default values on error
        return {
          totalLeaveTypes: 0,
          employeesWithEntitlements: 0,
          activePolicies: 0,
          upcomingHolidays: 0,
        };
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    staleTime: 60000, // Cache for 1 minute
  });
};
