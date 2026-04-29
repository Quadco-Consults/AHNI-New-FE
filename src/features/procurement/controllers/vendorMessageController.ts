import useApiManager from "@/constants/mainController";

const BASE_URL = "/procurements/vendor-messages/";

export type TMessageAttachment = {
  id: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  uploaded_by?: string;
  created_datetime: string;
};

export type TVendorMessage = {
  id: string;
  thread_id: string;
  parent_message?: string | null;
  vendor: string;
  vendor_details?: {
    id: string;
    company_name: string;
    email: string;
  };
  sender: string;
  sender_details?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
  recipient: string;
  recipient_details?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
  subject: string;
  message: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: "UNREAD" | "READ" | "ARCHIVED";
  read_at?: string | null;
  related_solicitation?: string | null;
  related_purchase_order?: string | null;
  is_from_vendor: boolean;
  is_archived: boolean;
  attachments: TMessageAttachment[];
  reply_count?: number;
  created_datetime: string;
  modified_datetime: string;
};

export type TMessageThread = TVendorMessage & {
  replies: TVendorMessage[];
};

type VendorMessageListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TVendorMessage[];
};

type VendorMessageResponse = {
  status: boolean;
  message: string;
  data: TVendorMessage;
};

type MessageThreadResponse = {
  status: boolean;
  message: string;
  data: TMessageThread;
};

// Get all messages with pagination and filters
export const useGetVendorMessages = (params?: {
  page?: number;
  size?: number;
  vendor?: string;
  status?: "UNREAD" | "READ" | "ARCHIVED";
  thread_id?: string;
  include_archived?: boolean;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("page_size", params.size.toString());
  if (params?.vendor) queryParams.append("vendor", params.vendor);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.thread_id) queryParams.append("thread_id", params.thread_id);
  if (params?.include_archived) queryParams.append("include_archived", "true");

  const endpoint = `${BASE_URL}?${queryParams.toString()}`;

  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    VendorMessageListResponse,
    Error
  >({
    endpoint,
    queryKey: ["vendor-messages", params],
    isAuth: true,
    method: "GET",
  });

  return { callApi, messages: data, isLoading, isSuccess, error };
};

// Get message threads (conversations)
export const useGetMessageThreads = () => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    { status: boolean; message: string; data: TMessageThread[] },
    Error
  >({
    endpoint: `${BASE_URL}threads/`,
    queryKey: ["vendor-message-threads"],
    isAuth: true,
    method: "GET",
  });

  return { callApi, threads: data?.data, isLoading, isSuccess, error };
};

// Get a specific thread by thread_id
export const useGetMessageThread = (threadId: string) => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    MessageThreadResponse,
    Error
  >({
    endpoint: `${BASE_URL}thread/${threadId}/`,
    queryKey: ["vendor-message-thread", threadId],
    isAuth: true,
    method: "GET",
  });

  return { callApi, thread: data?.data, isLoading, isSuccess, error };
};

// Get a single message by ID
export const useGetVendorMessage = (id: string) => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    VendorMessageResponse,
    Error
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-message", id],
    isAuth: true,
    method: "GET",
  });

  return { callApi, message: data?.data, isLoading, isSuccess, error };
};

// Create a new message
export const useCreateVendorMessage = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorMessageResponse,
    Error,
    {
      vendor: string;
      recipient: string;
      subject: string;
      message: string;
      priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
      parent_message?: string;
      related_solicitation?: string;
      related_purchase_order?: string;
    }
  >({
    endpoint: BASE_URL,
    queryKey: ["vendor-messages"],
    isAuth: true,
    method: "POST",
  });

  const createMessage = async (messageData: {
    vendor: string;
    recipient: string;
    subject: string;
    message: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    parent_message?: string;
    related_solicitation?: string;
    related_purchase_order?: string;
  }) => {
    try {
      await callApi(messageData);
    } catch (error) {
      console.error("Failed to create message:", error);
      throw error;
    }
  };

  return { createMessage, data, isLoading, isSuccess, error };
};

// Reply to a message
export const useReplyToMessage = (messageId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorMessageResponse,
    Error,
    {
      message: string;
      priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    }
  >({
    endpoint: `${BASE_URL}${messageId}/reply/`,
    queryKey: ["vendor-message", messageId],
    isAuth: true,
    method: "POST",
  });

  const replyToMessage = async (replyData: {
    message: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  }) => {
    try {
      await callApi(replyData);
    } catch (error) {
      console.error("Failed to reply to message:", error);
      throw error;
    }
  };

  return { replyToMessage, data, isLoading, isSuccess, error };
};

// Mark message as read
export const useMarkMessageAsRead = (messageId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorMessageResponse,
    Error
  >({
    endpoint: `${BASE_URL}${messageId}/mark-read/`,
    queryKey: ["vendor-message", messageId],
    isAuth: true,
    method: "POST",
  });

  const markAsRead = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Failed to mark message as read:", error);
      throw error;
    }
  };

  return { markAsRead, data, isLoading, isSuccess, error };
};

// Archive a message
export const useArchiveMessage = (messageId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorMessageResponse,
    Error
  >({
    endpoint: `${BASE_URL}${messageId}/archive/`,
    queryKey: ["vendor-message", messageId],
    isAuth: true,
    method: "POST",
  });

  const archiveMessage = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Failed to archive message:", error);
      throw error;
    }
  };

  return { archiveMessage, data, isLoading, isSuccess, error };
};

// Get unread message count
export const useGetUnreadMessageCount = () => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    {
      status: boolean;
      message: string;
      data: {
        unread_count: number;
      };
    },
    Error
  >({
    endpoint: `${BASE_URL}unread-count/`,
    queryKey: ["vendor-messages-unread-count"],
    isAuth: true,
    method: "GET",
  });

  return {
    callApi,
    unreadCount: data?.data?.unread_count || 0,
    isLoading,
    isSuccess,
    error
  };
};

// Delete a message
export const useDeleteVendorMessage = (messageId: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    { status: boolean; message: string },
    Error
  >({
    endpoint: `${BASE_URL}${messageId}/`,
    queryKey: ["vendor-messages"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteMessage = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  };

  return { deleteMessage, isLoading, isSuccess, error };
};
