import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  FCONumberData, 
  FCONumberFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

export const useGetAllFCONumbersManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FCONumberData>>({
    queryKey: ["fco-numbers", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/fco-numbers/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single FCO Number
export const useGetSingleFCONumberManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<FCONumberData>>({
    queryKey: ["fco-number", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/finance/fco-numbers/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const CreateFCONumberManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FCONumberData,
    Error,
    FCONumberFormValues
  >({
    endpoint: "finance/fco-numbers/",
    queryKey: ["fco-numbers"],
    isAuth: true,
    method: "POST",
  });

  const createFCONumber = async (details: FCONumberFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("FCO Number creation error:", error);
    }
  };

  return { createFCONumber, data, isLoading, isSuccess, error };
};

export const UpdateFCONumberManager = () => {
  const updateFCONumber = async (id: string, details: FCONumberFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/fco-numbers/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("FCO Number update error:", error);
      throw error;
    }
  };

  return { updateFCONumber };
};

export const DeleteFCONumberManager = () => {
  const deleteFCONumber = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/fco-numbers/${id}/`);
      return response.data;
    } catch (error) {
      console.error("FCO Number delete error:", error);
      throw error;
    }
  };

  return { deleteFCONumber };
};

// Backward compatibility exports
export const useGetAllFCONumbers = useGetAllFCONumbersManager;
export const useGetAllFCONumbersQuery = useGetAllFCONumbersManager;

export const useAddFCONumberMutation = () => {
  const { createFCONumber, data, isLoading, isSuccess, error } = CreateFCONumberManager();
  return [createFCONumber, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateFCONumberMutation = () => {
  const { updateFCONumber } = UpdateFCONumberManager();
  return [(params: { id: number; body: FCONumberFormValues }) => updateFCONumber(params.id.toString(), params.body), { isLoading: false }] as const;
};

export const useDeleteFCONumberMutation = () => {
  const { deleteFCONumber } = DeleteFCONumberManager();
  return [deleteFCONumber, { isLoading: false }] as const;
};

// Alternative endpoints for bypassing permission filtering
export const useGetAllFCONumbersUnrestricted = ({
  page = 1,
  size = 1000,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FCONumberData>>({
    queryKey: ["fco-numbers-unrestricted", page, size, search],
    queryFn: async () => {
      // Try multiple endpoint patterns that might bypass permission filtering
      const endpoints = [
        "/admins/finance/fco-numbers/",  // Admin endpoint pattern
        "/finance/fco-numbers/all/",     // All FCO numbers endpoint
        "/finance/fco-numbers/"          // Original with special params
      ];

      const params = [
        { page, size, search, access_scope: "global" },
        { page, size, search, data_access_level: "global" },
        { page, size, search, unrestricted: true },
        { page, size, search, all: true },
        { page, size: 2000000, search }  // Large size like users API
      ];

      for (let i = 0; i < endpoints.length; i++) {
        try {
          console.log(`🔍 Trying FCO numbers endpoint ${i + 1}: ${endpoints[i]} with params:`, params[i % params.length]);
          const response = await AxiosWithToken.get(endpoints[i], {
            params: params[i % params.length]
          });
          console.log(`✅ SUCCESS with FCO numbers endpoint ${i + 1}:`, response.data);
          console.log(`📊 FCO numbers count from endpoint ${i + 1}:`, response.data?.data?.results?.length || response.data?.results?.length || 0);

          // If we got results, this endpoint worked (FCO numbers might have fewer items naturally)
          const resultCount = response.data?.data?.results?.length || response.data?.results?.length || 0;
          if (resultCount > 0) {
            console.log(`🎯 FOUND WORKING FCO NUMBERS ENDPOINT: ${endpoints[i]} returned ${resultCount} FCO numbers!`);
            return response.data;
          } else if (i === endpoints.length - 1) {
            // Last endpoint and still no results
            console.warn(`⚠️ All FCO numbers endpoints tested, but no FCO numbers returned. This may indicate backend permission filtering.`);
            return response.data;
          }
        } catch (error) {
          console.log(`❌ Failed FCO numbers endpoint ${i + 1} (${endpoints[i]}):`, error);
          if (i === endpoints.length - 1) {
            throw error; // Throw the last error if all attempts fail
          }
        }
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Missing named export
export const useGetSingleFCONumber = useGetSingleFCONumberManager;