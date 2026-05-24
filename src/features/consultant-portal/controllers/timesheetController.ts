import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { ConsultantAuthUtils } from "./consultantAuthController";
import {
  TimesheetListResponse,
  TimesheetDetailResponse,
  TimesheetStatisticsResponse,
  ProjectListResponse,
  CreateTimesheetData,
  CreateTimesheetEntryData,
  UpdateTimesheetEntryData,
} from "../types/timesheet";

// Timesheet endpoints
const TIMESHEET_ENDPOINTS = {
  LIST: "/contract-grants/consultant-portal/timesheets/",
  DETAIL: (id: string) => `/contract-grants/consultant-portal/timesheets/${id}/`,
  SUBMIT: (id: string) => `/contract-grants/consultant-portal/timesheets/${id}/submit/`,
  STATISTICS: "/contract-grants/consultant-portal/timesheets/statistics/",
  ENTRIES: "/contract-grants/consultant-portal/timesheet-entries/",
  ENTRY_DETAIL: (id: string) => `/contract-grants/consultant-portal/timesheet-entries/${id}/`,
  PROJECTS: "/consultant-portal/projects/",
};

// List Timesheets Hook
export const useTimesheets = (page: number = 1, pageSize: number = 20, status?: string) => {
  return useQuery({
    queryKey: ['consultant-timesheets', page, pageSize, status],
    queryFn: async (): Promise<TimesheetListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await ConsultantAxiosWithToken.get(
        `${TIMESHEET_ENDPOINTS.LIST}?${params.toString()}`
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get Timesheet Detail Hook
export const useTimesheetDetail = (id: string) => {
  return useQuery({
    queryKey: ['consultant-timesheet-detail', id],
    queryFn: async (): Promise<TimesheetDetailResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        TIMESHEET_ENDPOINTS.DETAIL(id)
      );
      return response.data;
    },
    enabled: !!id && ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get Timesheet Statistics Hook
export const useTimesheetStatistics = () => {
  return useQuery({
    queryKey: ['consultant-timesheet-statistics'],
    queryFn: async (): Promise<TimesheetStatisticsResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        TIMESHEET_ENDPOINTS.STATISTICS
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get Projects Hook
export const useProjects = () => {
  return useQuery({
    queryKey: ['consultant-projects'],
    queryFn: async (): Promise<ProjectListResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        TIMESHEET_ENDPOINTS.PROJECTS
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create Timesheet Hook
export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTimesheetData): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        TIMESHEET_ENDPOINTS.LIST,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-statistics'] });
    },
  });
};

// Submit Timesheet Hook
export const useSubmitTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timesheetId: string): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        TIMESHEET_ENDPOINTS.SUBMIT(timesheetId),
        {}
      );
      return response.data;
    },
    onSuccess: (data, timesheetId) => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-detail', timesheetId] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-statistics'] });
    },
  });
};

// Create Timesheet Entry Hook
export const useCreateTimesheetEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTimesheetEntryData): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        TIMESHEET_ENDPOINTS.ENTRIES,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-detail', variables.timesheet_id] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
    },
  });
};

// Update Timesheet Entry Hook
export const useUpdateTimesheetEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, data }: { entryId: string; data: UpdateTimesheetEntryData }): Promise<any> => {
      const response = await ConsultantAxiosWithToken.put(
        TIMESHEET_ENDPOINTS.ENTRY_DETAIL(entryId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-detail'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
    },
  });
};

// Delete Timesheet Entry Hook
export const useDeleteTimesheetEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string): Promise<any> => {
      const response = await ConsultantAxiosWithToken.delete(
        TIMESHEET_ENDPOINTS.ENTRY_DETAIL(entryId)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheet-detail'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-timesheets'] });
    },
  });
};
