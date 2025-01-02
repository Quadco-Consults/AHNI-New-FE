import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TAssetConditionData,
    TAssetConditionFormValues,
} from "definations/modules/admin/asset-condition";

import baseAPI from "services/index";

const AssetConditionAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllAssetCondition: builder.query<
            TPaginatedResponse<TAssetConditionData>,
            TRequest
        >({
            query: (params) => ({
                url: "/admins/inventory/asset-conditions/",
                params,
            }),
            providesTags: ["AssetConditions"],
        }),

        addAssetCondition: builder.mutation<
            TResponse<TAssetConditionData>,
            TAssetConditionFormValues
        >({
            query: (body) => ({
                url: "/admins/inventory/asset-conditions/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["AssetConditions"],
        }),

        updateAssetCondition: builder.mutation<
            TResponse<TAssetConditionData>,
            { id: string; body: TAssetConditionFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/admins/inventory/asset-conditions/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["AssetConditions"],
        }),

        deleteAssetCondition: builder.mutation<
            TResponse<TAssetConditionData>,
            string
        >({
            query: (id) => ({
                url: `/admins/inventory/asset-conditions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssetConditions"],
        }),
    }),
});

export const {
    useGetAllAssetConditionQuery,
    useAddAssetConditionMutation,
    useUpdateAssetConditionMutation,
    useDeleteAssetConditionMutation,
} = AssetConditionAPI;
