import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

export interface TNotification {
  id: string;
  user: string;
  module_type: string;
  title: string;
  message: string;
  status: string;
  created_datetime: string;
  due_date: null;
}

interface NotificationResponse {
  count: number;
  next: null;
  previous: null;
  results: TNotification[];
}

// ===== NOTIFICATION HOOKS =====

// Get All Notifications
export const useGetNotifications = (enabled: boolean = true) => {
  return useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/notifications");
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

// Legacy exports for backward compatibility
export const useGetNotificationsQuery = useGetNotifications;