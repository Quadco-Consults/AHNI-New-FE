/**
 * Organization Chart Hooks
 * React Query hooks for organization chart data
 */

import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";

// Types
export interface OrgChartUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  profile_picture: string | null;
  position: {
    id: string;
    name: string;
  } | null;
  department: {
    id: string;
    name: string;
  } | null;
  location: {
    id: string;
    name: string;
  } | null;
  mobile_number: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  user_type: string | null;
  supervisor_id: string | null;
  direct_reports_count: number;
}

/**
 * Fetch organization chart data
 */
export const useOrgChart = () => {
  return useQuery<{ data: OrgChartUser[]; status: boolean; message: string }>({
    queryKey: ["org-chart"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/users/org-chart/");
      return response.data;
    },
  });
};
