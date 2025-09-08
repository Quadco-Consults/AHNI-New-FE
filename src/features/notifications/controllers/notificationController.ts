import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationCategory = "info" | "success" | "warning" | "error" | "system";

export interface TNotification {
  id: string;
  user: string;
  module_type: string;
  title: string;
  message: string;
  status: "Pending" | "Read";
  is_read: boolean;
  created_datetime: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  action_url?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

interface NotificationResponse {
  count: number;
  next: null;
  previous: null;
  results: TNotification[];
}

// ===== NOTIFICATION HOOKS =====

// Enhanced notification filters
export interface NotificationFilters {
  page?: number;
  size?: number;
  enabled?: boolean;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  module_type?: string;
  status?: "Pending" | "Read" | "all";
  search?: string;
}

// Get All Notifications with enhanced filtering
export const useGetNotifications = (params?: NotificationFilters) => {
  const { 
    page = 1, 
    size = 100, 
    enabled = true,
    priority,
    category,
    module_type,
    status,
    search
  } = params || {};
  
  return useQuery<NotificationResponse>({
    queryKey: ["notifications", page, size, priority, category, module_type, status, search],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        
        if (priority) searchParams.append('priority', priority);
        if (category) searchParams.append('category', category);
        if (module_type && module_type !== 'all_modules') searchParams.append('module_type', module_type);
        if (status && status !== 'all' && status !== 'all_status') searchParams.append('status', status);
        if (search) searchParams.append('search', search);
        
        const response = await AxiosWithToken.get(`/notifications?${searchParams.toString()}`);
        
        // Sort notifications by priority and date
        const sortedResults = response.data.results?.sort((a: TNotification, b: TNotification) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'medium'];
          const bPriority = priorityOrder[b.priority || 'medium'];
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime();
        }) || [];
        
        return { ...response.data, results: sortedResults };
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

// Infinite scroll hook for notifications
export const useInfiniteNotifications = (params?: Omit<NotificationFilters, 'page'>) => {
  const { 
    size = 20, // Smaller page size for infinite scroll
    enabled = true,
    priority,
    category,
    module_type,
    status,
    search
  } = params || {};
  
  return useInfiniteQuery<NotificationResponse, Error>({
    queryKey: ["notifications-infinite", size, priority, category, module_type, status, search],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const searchParams = new URLSearchParams({
          page: pageParam.toString(),
          size: size.toString(),
        });
        
        if (priority) searchParams.append('priority', priority);
        if (category) searchParams.append('category', category);
        if (module_type && module_type !== 'all_modules') searchParams.append('module_type', module_type);
        if (status && status !== 'all' && status !== 'all_status') searchParams.append('status', status);
        if (search) searchParams.append('search', search);
        
        const response = await AxiosWithToken.get(`/notifications?${searchParams.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          console.log("User not authenticated, skipping notifications fetch");
          throw new Error("Unauthenticated");
        }
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    getNextPageParam: (lastPage, pages) => {
      // If there's a next page, return the next page number
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    enabled: enabled,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      if (error.message === "Unauthenticated") return false;
      return failureCount < 3;
    },
    initialPageParam: 1,
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

// Enhanced bulk operations
export const useBulkMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationIds?: string[]) => {
      try {
        if (notificationIds && notificationIds.length > 0) {
          // Mark specific notifications as read
          const promises = notificationIds.map(id =>
            AxiosWithToken.post(`/notifications/${id}/mark_as_read/`)
          );
          await Promise.all(promises);
          return { count: notificationIds.length, success: true };
        } else {
          // Try bulk endpoint first, fallback to individual calls
          try {
            const response = await AxiosWithToken.post(`/notifications/mark_all_read/`);
            return response.data;
          } catch (bulkError) {
            // Fallback to individual calls if bulk endpoint doesn't exist
            const notificationsResponse = await AxiosWithToken.get(`/notifications/?status=Pending&size=1000`);
            const unreadNotifications = notificationsResponse.data.results || [];
            
            const promises = unreadNotifications.map((notification: TNotification) =>
              AxiosWithToken.post(`/notifications/${notification.id}/mark_as_read/`)
            );
            
            await Promise.all(promises);
            return { count: unreadNotifications.length, success: true };
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const message = data?.count 
        ? `${data.count} notifications marked as read`
        : "All notifications marked as read";
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });
};

// Bulk delete notifications
export const useBulkDeleteNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      try {
        // Try bulk delete endpoint first
        try {
          const response = await AxiosWithToken.delete(`/notifications/bulk_delete/`, {
            data: { notification_ids: notificationIds }
          });
          return response.data;
        } catch (bulkError) {
          // Fallback to individual deletes
          const promises = notificationIds.map(id =>
            AxiosWithToken.delete(`/notifications/${id}/`)
          );
          await Promise.all(promises);
          return { count: notificationIds.length, success: true };
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const message = data?.count 
        ? `${data.count} notifications deleted`
        : "Selected notifications deleted";
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete notifications");
    },
  });
};

// Legacy compatibility
export const useMarkAllAsRead = useBulkMarkAsRead;

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