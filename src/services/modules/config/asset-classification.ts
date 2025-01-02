import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IAssetClassificationData,
    TAssetClassificationFormValues,
} from "definations/modules/admin/asset-classification";

const BASE_URL = "/admins/inventory/asset-classifications/";

const AssetClassificationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createAssetClassification: builder.mutation<
            TResponse<IAssetClassificationData>,
            TAssetClassificationFormValues
        >({
            query: (body) => ({
                url: BASE_URL,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["ASSET_CLASSIFICATION"],
        }),

        getAllAssetClassifications: builder.query<
            TPaginatedResponse<IAssetClassificationData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["ASSET_CLASSIFICATION"],
        }),

        editAssetClassification: builder.mutation<
            TResponse<IAssetClassificationData>,
            { id: string; body: TAssetClassificationFormValues }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["ASSET_CLASSIFICATION"],
        }),

        deleteAssetClassification: builder.mutation<
            TResponse<IAssetClassificationData>,
            string
        >({
            query: (id) => ({
                url: `${BASE_URL}${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ASSET_CLASSIFICATION"],
        }),
    }),
});

export const {
    useCreateAssetClassificationMutation,
    useGetAllAssetClassificationsQuery,
    useEditAssetClassificationMutation,
    useDeleteAssetClassificationMutation,
} = AssetClassificationAPI;
