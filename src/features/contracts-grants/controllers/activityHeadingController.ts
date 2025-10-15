import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IActivityHeadingPaginatedData,
  IActivityHeadingSingleData,
  TActivityHeadingFormData,
} from "../types/activity-heading";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface
interface ActivityHeadingFilterParams {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/closeout/activity-headings/";

// ===== ACTIVITY HEADING HOOKS =====

// Get All Activity Headings (Paginated)
export const useGetAllActivityHeadings = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: ActivityHeadingFilterParams) => {
  return useQuery<PaginatedResponse<IActivityHeadingPaginatedData>>({
    queryKey: ["activityHeadings", page, size, search],
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

// Get Single Activity Heading
export const useGetSingleActivityHeading = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IActivityHeadingSingleData>>({
    queryKey: ["activityHeading", id],
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

// Create Activity Heading
export const useCreateActivityHeading = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IActivityHeadingSingleData,
    Error,
    TActivityHeadingFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["activityHeadings"],
    isAuth: true,
    method: "POST",
  });

  const createActivityHeading = async (details: TActivityHeadingFormData) => {
    await callApi(details);
  };

  return { createActivityHeading, data, isLoading, isSuccess, error };
};

// Update Activity Heading
export const useUpdateActivityHeading = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IActivityHeadingSingleData,
    Error,
    TActivityHeadingFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["activityHeadings", "activityHeading"],
    isAuth: true,
    method: "PUT",
  });

  const updateActivityHeading = async (details: TActivityHeadingFormData) => {
    await callApi(details);
  };

  return { updateActivityHeading, data, isLoading, isSuccess, error };
};

// Delete Activity Heading
export const useDeleteActivityHeading = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IActivityHeadingSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["activityHeadings"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteActivityHeading = async () => {
    await callApi({} as Record<string, never>);
  };

  return { deleteActivityHeading, data, isLoading, isSuccess, error };
};
