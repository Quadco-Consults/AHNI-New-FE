import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IAssetClassificationData,
    TAssetClassificationFormValues,
} from "definations/modules/admin/asset-classification";

const BASE_URL = "";

const PreAwardQuestionAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createPreAwardQuestion: builder.mutation<
            TResponse<IAssetClassificationData>,
            TAssetClassificationFormValues
        >({
            query: (body) => ({
                url: BASE_URL,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["PRE_AWARD_QUESTION"],
        }),

        getAllPreAwardQuestions: builder.query<
            TPaginatedResponse<IAssetClassificationData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["PRE_AWARD_QUESTION"],
        }),

        modifyPreAwardQuestion: builder.mutation<
            TResponse<IAssetClassificationData>,
            { id: string; body: TAssetClassificationFormValues }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["PRE_AWARD_QUESTION"],
        }),

        deletePreAwardQuestion: builder.mutation<
            TResponse<IAssetClassificationData>,
            string
        >({
            query: (id) => ({
                url: `${BASE_URL}${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PRE_AWARD_QUESTION"],
        }),
    }),
});

export const {} = PreAwardQuestionAPI;
