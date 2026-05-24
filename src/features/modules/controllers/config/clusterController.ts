import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  FilterParams,
  TPaginatedResponse,
  TResponse,
  ApiResponse
} from "../../types";

// Types
export interface ClusterData {
  id: string;
  name: string;
  code?: string;
  location: string | LocationSummary;
  location_name?: string;
  full_name?: string;
  description?: string;
  is_active: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface LocationSummary {
  id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  full_location?: string;
}

export interface ClusterFormValues {
  name: string;
  code?: string;
  location: string;
  description?: string;
  is_active?: boolean;
}

// GET Operations (Queries)
export const useGetAllClustersManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<ClusterData>>>({
    queryKey: ["clusters", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/clusters/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Cluster
export const useGetSingleClusterManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<ClusterData>>({
    queryKey: ["cluster", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/clusters/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// GET Clusters by Location
export const useGetClustersByLocationManager = (locationId: string, enabled: boolean = true) => {
  return useQuery<ClusterData[]>({
    queryKey: ["clusters-by-location", locationId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/clusters/by-location/${locationId}/`);
      return response.data;
    },
    enabled: enabled && !!locationId,
    refetchOnWindowFocus: false,
  });
};

// GET Active Clusters
export const useGetActiveClustersManager = (enabled: boolean = true) => {
  return useQuery<ClusterData[]>({
    queryKey: ["active-clusters"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/clusters/active/");
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateClusterManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ClusterData,
    Error,
    ClusterFormValues
  >({
    endpoint: "config/clusters/",
    queryKey: ["clusters"],
    isAuth: true,
    method: "POST",
  });

  const createCluster = async (details: ClusterFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Cluster creation error:", error);
    }
  };

  return { createCluster, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateClusterManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ClusterData,
    Error,
    ClusterFormValues
  >({
    endpoint: "config/clusters/",
    queryKey: ["clusters", "cluster"],
    isAuth: true,
    method: "PATCH",
  });

  const updateCluster = async (id: string, details: ClusterFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/config/clusters/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Cluster update error:", error);
      throw error;
    }
  };

  return { updateCluster, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteClusterManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ClusterData,
    Error,
    Record<string, never>
  >({
    endpoint: "config/clusters/",
    queryKey: ["clusters"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCluster = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/clusters/${id}`);
      return response.data;
    } catch (error) {
      console.error("Cluster delete error:", error);
      throw error;
    }
  };

  return { deleteCluster, data, isLoading, isSuccess, error };
};

// Backward compatibility exports
export const useGetAllClustersQuery = useGetAllClustersManager;
export const useGetAllClusters = useGetAllClustersManager;
export const useGetSingleClusterQuery = useGetSingleClusterManager;
export const useGetClustersByLocation = useGetClustersByLocationManager;
export const useGetActiveClusters = useGetActiveClustersManager;

export const useAddClusterMutation = () => {
  const { createCluster, data, isLoading, isSuccess, error } = CreateClusterManager();
  return [createCluster, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateClusterMutation = () => {
  const { updateCluster, data, isLoading, isSuccess, error } = UpdateClusterManager();
  return [
    (params: { id: string; body: ClusterFormValues }) => updateCluster(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteClusterMutation = () => {
  const { deleteCluster, data, isLoading, isSuccess, error } = DeleteClusterManager();
  return [deleteCluster, { data, isLoading, isSuccess, error }] as const;
};
