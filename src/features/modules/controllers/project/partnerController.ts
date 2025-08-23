import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  PartnerData, 
  PartnerFormValues 
} from "../../types/project";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllPartnersManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  state = "",
  partner_type = "",
  enabled = true 
}: FilterParams & { state?: string; partner_type?: string; enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<PartnerData>>({
    queryKey: ["partners", page, size, search, state, partner_type],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/projects/partners/", {
        params: { page, size, search, state, partner_type }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreatePartnerManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PartnerData,
    Error,
    PartnerFormValues
  >({
    endpoint: "/projects/partners/",
    queryKey: ["partners"],
    isAuth: true,
    method: "POST",
  });

  const createPartner = async (details: PartnerFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Partner creation error:", error);
    }
  };

  return { createPartner, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdatePartnerManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PartnerData,
    Error,
    PartnerFormValues
  >({
    endpoint: "/projects/partners/",
    queryKey: ["partners"],
    isAuth: true,
    method: "PUT",
  });

  const updatePartner = async (id: string, details: PartnerFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/projects/partners/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Partner update error:", error);
      throw error;
    }
  };

  return { updatePartner, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeletePartnerManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PartnerData,
    Error,
    Record<string, never>
  >({
    endpoint: "/projects/partners/",
    queryKey: ["partners"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePartner = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/projects/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error("Partner delete error:", error);
      throw error;
    }
  };

  return { deletePartner, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllPartnersQuery = useGetAllPartnersManager;
export const useGetAllPartners = useGetAllPartnersManager;

export const useAddPartnerMutation = () => {
  const { createPartner, data, isLoading, isSuccess, error } = CreatePartnerManager();
  return [createPartner, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdatePartnerMutation = () => {
  const { updatePartner, data, isLoading, isSuccess, error } = UpdatePartnerManager();
  return [
    (params: { id: string; body: PartnerFormValues }) => updatePartner(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeletePartnerMutation = () => {
  const { deletePartner, data, isLoading, isSuccess, error } = DeletePartnerManager();
  return [deletePartner, { data, isLoading, isSuccess, error }] as const;
};

// Additional backward compatibility exports
export const useUpdatePartner = useUpdatePartnerMutation;
export const useAddPartner = useAddPartnerMutation;