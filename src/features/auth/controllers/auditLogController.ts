import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// ===== AUDIT LOG HOOKS =====

// Get All Activities
export const useGetAllActivities = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["activities", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/activities/", {
          params: { page, size, search },
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

// Download Activities
export const useDownloadActivities = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Blob,
    Error,
    any
  >({
    endpoint: "/activities/download/",
    queryKey: [],
    isAuth: true,
    method: "GET" as any, // Note: This is a special case for download
    showSuccessToast: false,
  });

  const downloadActivities = async (params: any) => {
    try {
      // For file downloads, we need to handle this differently
      const response = await AxiosWithToken.get("/activities/download/", {
        params,
        responseType: "blob",
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "activities.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error("Download activities error:", error);
      throw error;
    }
  };

  return { downloadActivities, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllActivitesQuery = useGetAllActivities;
export const useDownloadActivitiesMutation = useDownloadActivities;