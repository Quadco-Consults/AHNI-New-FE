import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface TNotification {
  id: string;
  user: string;
  module_type: string;
  title: string;
  message: string;
  status: "Pending" | "Read";
  is_read: boolean;
  created_datetime: string;
}

interface NotificationResponse {
  count: number;
  next: null;
  previous: null;
  results: TNotification[];
}

// ===== NOTIFICATION HOOKS =====

// Get All Notifications
export const useGetNotifications = (params?: { page?: number; size?: number; enabled?: boolean }) => {
  const { page = 1, size = 100, enabled = true } = params || {};
  
  return useQuery<NotificationResponse>({
    queryKey: ["notifications", page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/notifications?page=${page}&size=${size}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        // Don't show error toast for unauthenticated users
        if (axiosError.response?.status === 401) {
          console.log("User not authenticated, skipping notifications fetch");
          throw new Error("Unauthenticated");
        }
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      // Don't retry if unauthenticated
      if (error.message === "Unauthenticated") return false;
      return failureCount < 3;
    },
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await AxiosWithToken.post(`/notifications/${notificationId}/mark_as_read/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await AxiosWithToken.delete(`/notifications/${notificationId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
};

// Mark notification as unread
export const useMarkNotificationAsUnread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await AxiosWithToken.post(`/notifications/${notificationId}/mark_as_unread/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as unread");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as unread");
    },
  });
};

// Mark all notifications as read (bulk operation)
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // Since there's no bulk endpoint mentioned, we'll get all unread notifications and mark them individually
        const notificationsResponse = await AxiosWithToken.get(`/notifications/?status=Pending&size=1000`);
        const unreadNotifications = notificationsResponse.data.results || [];
        
        // Mark each unread notification as read
        const promises = unreadNotifications.map((notification: TNotification) =>
          AxiosWithToken.post(`/notifications/${notification.id}/mark_as_read/`)
        );
        
        await Promise.all(promises);
        return { success: true };
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
};

// Get unread notification count
export const useGetUnreadCount = (enabled: boolean = true) => {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        // Get count of unread notifications by filtering status=Pending
        const response = await AxiosWithToken.get(`/notifications/?status=Pending&size=1`);
        return { count: response.data.count || 0 };
      } catch (error) {
        const axiosError = error as AxiosError;
        // Don't show error toast for unauthenticated users
        if (axiosError.response?.status === 401) {
          console.log("User not authenticated, skipping unread count fetch");
          throw new Error("Unauthenticated");
        }
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry if unauthenticated
      if (error.message === "Unauthenticated") return false;
      return failureCount < 3;
    },
  });
};

// Legacy exports for backward compatibility
export const useGetNotificationsQuery = useGetNotifications;