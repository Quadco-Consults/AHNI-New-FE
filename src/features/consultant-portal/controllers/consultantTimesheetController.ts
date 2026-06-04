import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";

// Consultant timesheet endpoints
const CONSULTANT_TIMESHEET_ENDPOINTS = {
  LIST: "/consultant-portal/timesheets/",
  CREATE: "/consultant-portal/timesheets/",
  DETAIL: (id: string) => `/consultant-portal/timesheets/${id}/`,
  SUBMIT: (id: string) => `/consultant-portal/timesheets/${id}/submit/`,
  STATISTICS: "/consultant-portal/timesheets/statistics/",
};

// List Consultantsheets
export const useConsultantTimesheets = (params?: {
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ['consultant-timesheets', params],
    queryFn: async (): Promise<any> => {
      const response = await ConsultantAxiosWithToken.get(
        CONSULTANT_TIMESHEET_ENDPOINTS.LIST,
        { params }
      );
      return response.data?.data?.results || [];
    },
  });
};

// Get Timesheet Details
export const useConsultantTimesheet = (id: string) => {
  return useQuery({
    queryKey: ['consultant-timesheet', id],
    queryFn: async (): Promise<any> => {
      const response = await ConsultantAxiosWithToken.get(
        CONSULTANT_TIMESHEET_ENDPOINTS.DETAIL(id)
      );
      return response.data?.data;
    },
    enabled: !!id,
  });
};

// Create Timesheet
export const useCreateConsultantTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      start_date: string;
      end_date: string;
      period_type: string;
      activities: Array<{
        activity: string;
        description?: string;
        hours?: number;
      }>;
      submit_immediately?: boolean;
    }): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        CONSULTANT_TIMESHEET_ENDPOINTS.CREATE,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
    },
  });
};

// Submit Timesheet
export const useSubmitConsultantTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        CONSULTANT_TIMESHEET_ENDPOINTS.SUBMIT(id)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
    },
  });
};

// Get Timesheet Statistics
export const useConsultantTimesheetStatistics = () => {
  return useQuery({
    queryKey: ['consultant-timesheet-statistics'],
    queryFn: async (): Promise<any> => {
      const response = await ConsultantAxiosWithToken.get(
        CONSULTANT_TIMESHEET_ENDPOINTS.STATISTICS
      );
      return response.data?.data;
    },
  });
};
