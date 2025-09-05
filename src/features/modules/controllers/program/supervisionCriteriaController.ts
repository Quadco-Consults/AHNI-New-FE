import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  SupervisionCriteriaData, 
  SupervisionCriteriaFormValues 
} from "../../types/program";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllSupervisionCriteriaManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  evaluation_category = "",
  enabled = true 
}: FilterParams & { evaluation_category?: string; enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<SupervisionCriteriaData>>({
    queryKey: ["supervisionCriteria", page, size, search, evaluation_category],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/programs/supervision-evaluation-criteria/", {
        params: { page, size, search, evaluation_category }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateSupervisionCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCriteriaData,
    Error,
    SupervisionCriteriaFormValues
  >({
    endpoint: "/programs/supervision-evaluation-criteria/",
    queryKey: ["supervisionCriteria"],
    isAuth: true,
    method: "POST",
  });

  const createSupervisionCriteria = async (details: SupervisionCriteriaFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision criteria creation error:", error);
    }
  };

  return { createSupervisionCriteria, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateSupervisionCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCriteriaData,
    Error,
    SupervisionCriteriaFormValues
  >({
    endpoint: "/programs/supervision-evaluation-criteria/",
    queryKey: ["supervisionCriteria"],
    isAuth: true,
    method: "PUT",
  });

  const updateSupervisionCriteria = async (id: number, details: SupervisionCriteriaFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/programs/supervision-evaluation-criteria/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Supervision criteria update error:", error);
      throw error;
    }
  };

  return { updateSupervisionCriteria, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteSupervisionCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCriteriaData,
    Error,
    Record<string, never>
  >({
    endpoint: "/programs/supervision-evaluation-criteria/",
    queryKey: ["supervisionCriteria"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSupervisionCriteria = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/programs/supervision-evaluation-criteria/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Supervision criteria delete error:", error);
      throw error;
    }
  };

  return { deleteSupervisionCriteria, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllSupervisionCriteriaQuery = useGetAllSupervisionCriteriaManager;
export const useGetAllSupervisionCriteriaController = useGetAllSupervisionCriteriaManager;

export const useAddSupervisionCriteriaMutation = () => {
  const { createSupervisionCriteria, data, isLoading, isSuccess, error } = CreateSupervisionCriteriaManager();
  return [createSupervisionCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateSupervisionCriteriaMutation = () => {
  const { updateSupervisionCriteria, data, isLoading, isSuccess, error } = UpdateSupervisionCriteriaManager();
  return [
    (params: { id: number; body: SupervisionCriteriaFormValues }) => updateSupervisionCriteria(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteSupervisionCriteriaMutation = () => {
  const { deleteSupervisionCriteria, data, isLoading, isSuccess, error } = DeleteSupervisionCriteriaManager();
  return [deleteSupervisionCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteSupervisionCriteriaController = () => {
  const { deleteSupervisionCriteria, data, isLoading, isSuccess, error } = DeleteSupervisionCriteriaManager();
  return [deleteSupervisionCriteria, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports - RTK Query style  
export const useAddSupervisionCriteriaController = useAddSupervisionCriteriaMutation;
export const useUpdateSupervisionCriteriaController = useUpdateSupervisionCriteriaMutation;