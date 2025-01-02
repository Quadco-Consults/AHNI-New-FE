import {
    TAssetFormValues,
    TAssetPaginatedData,
    TAssetSingleData,
} from "definations/admin/inventory-management/asset";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/inventory/assets/`;

const AssetAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createAsset: builder.mutation<
            TResponse<TAssetSingleData>,
            TAssetFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["ASSET"],
        }),

        getAllAssets: builder.query<
            TPaginatedResponse<TAssetPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["ASSET"],
        }),

        getSingleAsset: builder.query<TResponse<TAssetSingleData>, string>({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        editAsset: builder.mutation<
            TResponse<TAssetSingleData>,
            { id: string; body: TAssetFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["ASSET"],
        }),

        deleteAsset: builder.mutation<TResponse<TAssetSingleData>, string>({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["ASSET"],
        }),
    }),
});

export const {
    useCreateAssetMutation,
    useGetAllAssetsQuery,
    useGetSingleAssetQuery,
    useEditAssetMutation,
    useDeleteAssetMutation,
} = AssetAPI;
