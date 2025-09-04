import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  PrequalificationCriteriaData, 
  PrequalificationCriteriaFormValues 
} from "../../types/procurement";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllPrequalificationCriteriaManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<PrequalificationCriteriaData>>({
    queryKey: ["prequalificationCriteria", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/prequalification_criteria/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreatePrequalificationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaData,
    Error,
    PrequalificationCriteriaFormValues
  >({
    endpoint: "/procurements/prequalification_criteria/",
    queryKey: ["prequalificationCriteria"],
    isAuth: true,
    method: "POST",
  });

  const createPrequalificationCriteria = async (details: PrequalificationCriteriaFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification criteria creation error:", error);
    }
  };

  return { createPrequalificationCriteria, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdatePrequalificationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaData,
    Error,
    PrequalificationCriteriaFormValues
  >({
    endpoint: "/procurements/prequalification_criteria/",
    queryKey: ["prequalificationCriteria"],
    isAuth: true,
    method: "PATCH",
  });

  const updatePrequalificationCriteria = async (id: string, details: PrequalificationCriteriaFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/prequalification_criteria/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Prequalification criteria update error:", error);
      throw error;
    }
  };

  return { updatePrequalificationCriteria, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeletePrequalificationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/prequalification_criteria/",
    queryKey: ["prequalificationCriteria"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePrequalificationCriteria = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/prequalification_criteria/${id}`);
      return response.data;
    } catch (error) {
      console.error("Prequalification criteria delete error:", error);
      throw error;
    }
  };

  return { deletePrequalificationCriteria, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllPrequalificationCriteriaQuery = useGetAllPrequalificationCriteriaManager;
export const useGetAllPrequalificationCriteria = useGetAllPrequalificationCriteriaManager;

export const useAddPrequalificationCriteriaMutation = () => {
  const { createPrequalificationCriteria, data, isLoading, isSuccess, error } = CreatePrequalificationCriteriaManager();
  return [createPrequalificationCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdatePrequalificationCriteriaMutation = () => {
  const { updatePrequalificationCriteria, data, isLoading, isSuccess, error } = UpdatePrequalificationCriteriaManager();
  return [
    (params: { id: string; body: PrequalificationCriteriaFormValues }) => updatePrequalificationCriteria(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeletePrequalificationCriteriaMutation = () => {
  const { deletePrequalificationCriteria, data, isLoading, isSuccess, error } = DeletePrequalificationCriteriaManager();
  return [deletePrequalificationCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useDeletePrequalificationCriteria = DeletePrequalificationCriteriaManager;

// Missing named exports - RTK Query style
export const useAddPrequalificationCriteria = useAddPrequalificationCriteriaMutation;
export const useUpdatePrequalificationCriteria = useUpdatePrequalificationCriteriaMutation;