import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TSupportFormValues, TSupportPaginatedData, TSupportSingleData } from "../types/support";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/support/ticket/";

// ===== SUPPORT HOOKS =====

// Get All Tickets
export const useGetAllTickets = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TSupportPaginatedData>>({
    queryKey: ["support-tickets", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Single Ticket
export const useGetSingleTicket = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TSupportSingleData>>({
    queryKey: ["support-ticket", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Ticket
export const useCreateTicket = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSupportSingleData,
    Error,
    TSupportFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["support-tickets"],
    isAuth: true,
    method: "POST",
  });

  const createTicket = async (details: TSupportFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Support ticket create error:", error);
    }
  };

  return { createTicket, data, isLoading, isSuccess, error };
};

// Edit Ticket
export const useEditTicket = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSupportSingleData,
    Error,
    object
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["support-tickets", "support-ticket"],
    isAuth: true,
    method: "PUT",
  });

  const editTicket = async (details: object) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Support ticket edit error:", error);
    }
  };

  return { editTicket, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllTicketsQuery = useGetAllTickets;
export const useGetSingleTicketQuery = useGetSingleTicket;
export const useCreateTicketMutation = useCreateTicket;
export const useEditTicketMutation = useEditTicket;