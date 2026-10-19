/**
 * Announcements Hooks
 * React Query hooks for general announcements management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";
import { toast } from "sonner";

// Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: "general" | "maintenance" | "life_event" | "policy" | "event" | "safety" | "training";
  announcement_type_display: string;
  life_event_type?: "bereavement" | "wedding" | "birth" | "promotion" | "retirement" | "award";
  life_event_type_display?: string;
  priority: "low" | "medium" | "high" | "urgent";
  priority_display: string;

  // Author info
  posted_by?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  department?: string;
  author_name: string;

  // Related staff (for life events)
  related_staff?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };

  // Visibility
  is_pinned: boolean;
  is_published: boolean;
  published_date?: string;
  expiry_date?: string;
  target_all_staff: boolean;

  // Event details
  event_date?: string;
  event_location?: string;
  attachments?: any[];

  // Metadata
  view_count: number;
  is_expired: boolean;
  created_datetime: string;
  updated_datetime: string;
}

/**
 * Fetch all published announcements
 */
export const useAnnouncements = (params?: {
  type?: string;
  life_event_type?: string;
  priority?: string;
}) => {
  return useQuery<{ data: Announcement[]; results?: Announcement[] }>({
    queryKey: ["announcements", params],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/messaging/announcements/", {
        params,
      });
      // Handle both response formats
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch a single announcement by ID
 */
export const useAnnouncement = (id: string) => {
  return useQuery<{ data: Announcement }>({
    queryKey: ["announcement", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/messaging/announcements/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create a new announcement
 */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      announcement_type: string;
      life_event_type?: string;
      priority: string;
      department?: string;
      related_staff_id?: string;
      is_pinned?: boolean;
      is_published?: boolean;
      expiry_date?: string;
      event_date?: string;
      event_location?: string;
    }) => {
      const response = await AxiosWithToken.post("/messaging/announcements/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create announcement");
    },
  });
};

/**
 * Update an announcement
 */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Announcement> }) => {
      const response = await AxiosWithToken.patch(`/messaging/announcements/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", variables.id] });
      toast.success("Announcement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update announcement");
    },
  });
};

/**
 * Delete an announcement
 */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`/messaging/announcements/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete announcement");
    },
  });
};

/**
 * Publish an announcement
 */
export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/messaging/announcements/${id}/publish/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
      toast.success("Announcement published successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to publish announcement");
    },
  });
};

/**
 * Unpublish an announcement
 */
export const useUnpublishAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/messaging/announcements/${id}/unpublish/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
      toast.success("Announcement unpublished successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to unpublish announcement");
    },
  });
};

/**
 * Pin an announcement
 */
export const usePinAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/messaging/announcements/${id}/pin/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
      toast.success("Announcement pinned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to pin announcement");
    },
  });
};

/**
 * Unpin an announcement
 */
export const useUnpinAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/messaging/announcements/${id}/unpin/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
      toast.success("Announcement unpinned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to unpin announcement");
    },
  });
};

/**
 * Increment view count for an announcement
 */
export const useIncrementAnnouncementViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/messaging/announcements/${id}/increment_view_count/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
    },
  });
};
