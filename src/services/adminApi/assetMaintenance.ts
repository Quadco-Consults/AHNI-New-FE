import baseAPI from "..";
import { TBasePaginatedRespose, TRequest } from "definations/auth";

export interface AssetMaintenanceRequest {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  description_of_problem: string;
  approved_by: string;
  maintenance_type: string;
  classification: string;
  asset: string;
  action?: string;
}

export interface CreateAssetMaintenanceRequestPayload {
  status: string;
  description_of_problem: string;
  approved_by: string;
  maintenance_type: string;
  classification: string;
  asset: string;
}
const url = "/admins/asset-maintenance-requests/";
const assetMaintenance = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAssetMaintenanceRequests: builder.query<
      TBasePaginatedRespose<AssetMaintenanceRequest[]>,
      TRequest
    >({
      query: (params) => ({
        url: url,
        params,
      }),
      providesTags: ["AM"],
    }),
    getOneAssetMaintenanceRequest: builder.query<
      AssetMaintenanceRequest,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${url}${id}/`,
      }),
      providesTags: ["AM"],
    }),
    createAssetMaintenanceRequest: builder.mutation<
      AssetMaintenanceRequest,
      CreateAssetMaintenanceRequestPayload
    >({
      query: (body) => ({
        url: url,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AM"],
    }),
    updateAssetMaintenanceRequest: builder.mutation<
      AssetMaintenanceRequest,
      { id: string; body: Partial<CreateAssetMaintenanceRequestPayload> }
    >({
      query: ({ id, body }) => ({
        url: `${url}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AM"],
    }),
    deleteAssetMaintenanceRequest: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${url}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AM"],
    }),
  }),
});

export const {
  useGetAssetMaintenanceRequestsQuery,
  useGetOneAssetMaintenanceRequestQuery,
  useCreateAssetMaintenanceRequestMutation,
  useUpdateAssetMaintenanceRequestMutation,
  useDeleteAssetMaintenanceRequestMutation,
} = assetMaintenance;
