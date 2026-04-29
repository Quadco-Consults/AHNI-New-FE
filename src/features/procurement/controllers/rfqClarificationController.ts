import useApiManager from "@/constants/mainController";

const BASE_URL = "/procurements/rfq-clarifications/";

export type TRFQClarification = {
  id: string;
  solicitation: string;
  solicitation_title?: string;
  question: string;
  answer?: string | null;
  asked_by: string;
  asked_by_details?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  answered_by?: string | null;
  answered_by_details?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: "PENDING" | "ANSWERED" | "CLOSED";
  is_public: boolean;
  answered_at?: string | null;
  created_datetime: string;
  modified_datetime: string;
};

type RFQClarificationListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TRFQClarification[];
};

type RFQClarificationResponse = {
  status: boolean;
  message: string;
  data: TRFQClarification;
};

// Get all clarifications with pagination and filters
export const useGetRFQClarifications = (params?: {
  page?: number;
  size?: number;
  solicitation?: string;
  status?: "PENDING" | "ANSWERED" | "CLOSED";
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("page_size", params.size.toString());
  if (params?.solicitation) queryParams.append("solicitation", params.solicitation);
  if (params?.status) queryParams.append("status", params.status);

  const endpoint = `${BASE_URL}?${queryParams.toString()}`;

  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    RFQClarificationListResponse,
    Error
  >({
    endpoint,
    queryKey: ["rfq-clarifications", params],
    isAuth: true,
    method: "GET",
  });

  return { callApi, clarifications: data, isLoading, isSuccess, error };
};

// Get a single clarification by ID
export const useGetRFQClarification = (id: string) => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    RFQClarificationResponse,
    Error
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfq-clarification", id],
    isAuth: true,
    method: "GET",
  });

  return { callApi, clarification: data?.data, isLoading, isSuccess, error };
};

// Get public clarifications for a specific solicitation (vendor view)
export const useGetSolicitationClarifications = (solicitationId: string) => {
  const { callApi, data, isLoading, isSuccess, error } = useApiManager<
    { status: boolean; message: string; data: TRFQClarification[] },
    Error
  >({
    endpoint: `${BASE_URL}by-solicitation/${solicitationId}/`,
    queryKey: ["solicitation-clarifications", solicitationId],
    isAuth: true,
    method: "GET",
  });

  return { callApi, clarifications: data?.data, isLoading, isSuccess, error };
};

// Create a new clarification question (vendor side)
export const useCreateRFQClarification = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFQClarificationResponse,
    Error,
    {
      solicitation: string;
      question: string;
      is_public?: boolean;
    }
  >({
    endpoint: BASE_URL,
    queryKey: ["rfq-clarifications"],
    isAuth: true,
    method: "POST",
  });

  const createClarification = async (clarificationData: {
    solicitation: string;
    question: string;
    is_public?: boolean;
  }) => {
    try {
      await callApi(clarificationData);
    } catch (error) {
      console.error("Failed to create clarification:", error);
      throw error;
    }
  };

  return { createClarification, data, isLoading, isSuccess, error };
};

// Update a clarification (typically to add an answer - admin side)
export const useUpdateRFQClarification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFQClarificationResponse,
    Error,
    {
      answer?: string;
      is_public?: boolean;
      status?: "PENDING" | "ANSWERED" | "CLOSED";
    }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfq-clarification", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateClarification = async (updateData: {
    answer?: string;
    is_public?: boolean;
    status?: "PENDING" | "ANSWERED" | "CLOSED";
  }) => {
    try {
      await callApi(updateData);
    } catch (error) {
      console.error("Failed to update clarification:", error);
      throw error;
    }
  };

  return { updateClarification, data, isLoading, isSuccess, error };
};

// Close a clarification (admin only)
export const useCloseClarification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RFQClarificationResponse,
    Error
  >({
    endpoint: `${BASE_URL}${id}/close/`,
    queryKey: ["rfq-clarification", id],
    isAuth: true,
    method: "POST",
  });

  const closeClarification = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Failed to close clarification:", error);
      throw error;
    }
  };

  return { closeClarification, data, isLoading, isSuccess, error };
};

// Delete a clarification
export const useDeleteRFQClarification = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    { status: boolean; message: string },
    Error
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["rfq-clarifications"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteClarification = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Failed to delete clarification:", error);
      throw error;
    }
  };

  return { deleteClarification, isLoading, isSuccess, error };
};
