import baseAPI from ".";
import { TBasePaginatedResponse, TRequest } from "definations/auth";
import {
    AssetConditions,
    TAssetConditions,
    AssetTypes,
    TAssetTypes,
} from "definations/module-admin";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        assetConditions: builder.query<
            TBasePaginatedResponse<AssetConditions>,
            TRequest
        >({
            query: (params) => ({
                url: "/admins/inventory/asset-conditions/",
                params,
            }),
            providesTags: ["AssetConditions"],
        }),
        addAssetConditions: builder.mutation<AssetConditions, TAssetConditions>(
            {
                query: (body) => ({
                    url: "/admins/inventory/asset-conditions/",
                    method: "POST",
                    body: body,
                }),
                invalidatesTags: ["AssetConditions"],
            }
        ),
        updateAssetConditions: builder.mutation<
            AssetConditions,
            { id: string; body: TAssetConditions }
        >({
            query: ({ id, body }) => ({
                url: `/admins/inventory/asset-conditions/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["AssetConditions"],
        }),
        deleteAssetConditions: builder.mutation<AssetConditions, string>({
            query: (id) => ({
                url: `/admins/inventory/asset-conditions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssetConditions"],
        }),

        assetTypes: builder.query<TBasePaginatedResponse<AssetTypes>, TRequest>(
            {
                query: (params) => ({
                    url: "/admins/inventory/asset-types/",
                    params,
                }),
                providesTags: ["AssetTypes"],
            }
        ),
        addAssetTypes: builder.mutation<AssetTypes, TAssetTypes>({
            query: (body) => ({
                url: "/admins/inventory/asset-types/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["AssetTypes"],
        }),
        updateAssetTypes: builder.mutation<
            AssetTypes,
            { id: string; body: TAssetTypes }
        >({
            query: ({ id, body }) => ({
                url: `/admins/inventory/asset-types/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["AssetTypes"],
        }),
        deleteAssetTypes: builder.mutation<AssetTypes, string>({
            query: (id) => ({
                url: `/admins/inventory/asset-types/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssetTypes"],
        }),
    }),
});

export const {
    useAssetConditionsQuery,
    useAddAssetConditionsMutation,
    useUpdateAssetConditionsMutation,
    useDeleteAssetConditionsMutation,
    useAssetTypesQuery,
    useAddAssetTypesMutation,
    useUpdateAssetTypesMutation,
    useDeleteAssetTypesMutation,
} = projectsAPI;
