import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TAssetTypeData,
    TAssetTypeFormValues,
} from "definations/modules/admin/asset-type";
import baseAPI from "services/index";

const AssetTypeAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllAssetType: builder.query<
            TPaginatedResponse<TAssetTypeData>,
            TRequest
        >({
            query: (params) => ({
                url: "/admins/inventory/asset-types/",
                params,
            }),
            providesTags: ["AssetTypes"],
        }),

        addAssetType: builder.mutation<
            TResponse<TAssetTypeData>,
            TAssetTypeFormValues
        >({
            query: (body) => ({
                url: "/admins/inventory/asset-types/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["AssetTypes"],
        }),

        updateAssetType: builder.mutation<
            TResponse<TAssetTypeData>,
            { id: string; body: TAssetTypeFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/admins/inventory/asset-types/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["AssetTypes"],
        }),

        deleteAssetType: builder.mutation<TResponse<TAssetTypeData>, string>({
            query: (id) => ({
                url: `/admins/inventory/asset-types/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssetTypes"],
        }),
    }),
});

export const {
    useGetAllAssetTypeQuery,
    useAddAssetTypeMutation,
    useUpdateAssetTypeMutation,
    useDeleteAssetTypeMutation,
} = AssetTypeAPI;
