import {
    IAssetMaintenancePaginatedData,
    IAssetMaintenanceSingleData,
    TAssetMaintenanceFormData,
} from "definations/admin/asset-maintenance";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = `/admins/assets/maintenance/`;

const AssetMaintenanceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createAssetMaintenance: builder.mutation<
            TResponse<IAssetMaintenanceSingleData>,
            TAssetMaintenanceFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["ASSET_MAINTENANCE"],
        }),

        getAllAssetMaintenance: builder.query<
            TPaginatedResponse<IAssetMaintenancePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["ASSET_MAINTENANCE"],
        }),

        getSingleAssetMaintenance: builder.query<
            TResponse<IAssetMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["FACILITY_MAINTENANCE"],
        }),

        modifyAssetMaintenance: builder.mutation<
            TResponse<IAssetMaintenanceSingleData>,
            { id: string; body: TAssetMaintenanceFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}`,
                body,
            }),
            invalidatesTags: ["ASSET_MAINTENANCE"],
        }),

        deleteAssetMaintenance: builder.mutation<
            TResponse<IAssetMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["ASSET_MAINTENANCE"],
        }),
    }),
});

export const {
    useCreateAssetMaintenanceMutation,
    useGetAllAssetMaintenanceQuery,
    useGetSingleAssetMaintenanceQuery,
    useModifyAssetMaintenanceMutation,
    useDeleteAssetMaintenanceMutation,
} = AssetMaintenanceAPI;
