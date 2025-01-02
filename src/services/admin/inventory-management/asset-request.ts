import {
    IAssetRequestPaginatedData,
    IAssetRequestSingleSData,
    TAssetRequestFormValues,
} from "definations/admin/inventory-management/asset-request";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/inventory/assets/requests/`;

const AssetRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createAssetRequest: builder.mutation<
            TResponse<IAssetRequestSingleSData>,
            TAssetRequestFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["ASSET_REQUEST"],
        }),

        getAllAssetRequests: builder.query<
            TPaginatedResponse<IAssetRequestPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["ASSET_REQUEST"],
        }),

        getSingleAssetRequest: builder.query<
            TResponse<IAssetRequestSingleSData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        editAssetRequest: builder.mutation<
            TResponse<IAssetRequestSingleSData>,
            { id: string; body: TAssetRequestFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["ASSET_REQUEST"],
        }),

        deleteAssetRequest: builder.mutation<
            TResponse<IAssetRequestSingleSData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["ASSET_REQUEST"],
        }),
    }),
});

export const {
    useCreateAssetRequestMutation,
    useGetAllAssetRequestsQuery,
    useGetSingleAssetRequestQuery,
    useEditAssetRequestMutation,
    useDeleteAssetRequestMutation,
} = AssetRequestAPI;
