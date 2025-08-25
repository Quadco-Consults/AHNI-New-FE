import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  BeneficiaryData, 
  BeneficiaryFormValues 
} from "../../types/project";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllBeneficiariesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<BeneficiaryData>>({
    queryKey: ["beneficiaries", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/projects/beneficiaries/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateBeneficiaryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BeneficiaryData,
    Error,
    BeneficiaryFormValues
  >({
    endpoint: "/projects/beneficiaries/",
    queryKey: ["beneficiaries"],
    isAuth: true,
    method: "POST",
  });

  const createBeneficiary = async (details: BeneficiaryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Beneficiary creation error:", error);
    }
  };

  return { createBeneficiary, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateBeneficiaryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BeneficiaryData,
    Error,
    BeneficiaryFormValues
  >({
    endpoint: "/projects/beneficiaries/",
    queryKey: ["beneficiaries"],
    isAuth: true,
    method: "PUT",
  });

  const updateBeneficiary = async (id: string, details: BeneficiaryFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/projects/beneficiaries/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Beneficiary update error:", error);
      throw error;
    }
  };

  return { updateBeneficiary, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteBeneficiaryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    BeneficiaryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/projects/beneficiaries/",
    queryKey: ["beneficiaries"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteBeneficiary = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/projects/beneficiaries/${id}`);
      return response.data;
    } catch (error) {
      console.error("Beneficiary delete error:", error);
      throw error;
    }
  };

  return { deleteBeneficiary, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllBeneficiaryQuery = useGetAllBeneficiariesManager;
export const useGetAllBeneficiaries = useGetAllBeneficiariesManager;

export const useAddBeneficiaryMutation = () => {
  const { createBeneficiary, data, isLoading, isSuccess, error } = CreateBeneficiaryManager();
  return [createBeneficiary, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateBeneficiaryMutation = () => {
  const { updateBeneficiary, data, isLoading, isSuccess, error } = UpdateBeneficiaryManager();
  return [
    (params: { id: string; body: BeneficiaryFormValues }) => updateBeneficiary(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteBeneficiaryMutation = () => {
  const { deleteBeneficiary, data, isLoading, isSuccess, error } = DeleteBeneficiaryManager();
  return [deleteBeneficiary, { data, isLoading, isSuccess, error }] as const;
};

// Additional missing exports
export const useUpdateBeneficiary = useUpdateBeneficiaryMutation;
export const useAddBeneficiary = useAddBeneficiaryMutation;
export const useDeleteBeneficiary = useDeleteBeneficiaryMutation;