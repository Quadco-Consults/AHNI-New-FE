import {
    ISubGrantSubmissionPaginatedData,
    ISubGrantSubmissionSingleData,
    TSubGrantSubmissionFormData,
} from "definations/c&g/contract-management/sub-grant/sub-grant";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/contract-grants/sub-grants/submissions/";

const SubGrantManualSubAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSubGrantManualSub: builder.mutation<
            TResponse<ISubGrantSubmissionSingleData>,
            TSubGrantSubmissionFormData & { sub_grant: string }
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["SUBGRANT_SUBMISSION"],
        }),

        getAllSubGrantManualSub: builder.query<
            TPaginatedResponse<ISubGrantSubmissionPaginatedData>,
            TRequest & { sub_grant: string }
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params: params,
            }),
            providesTags: ["SUBGRANT_SUBMISSION"],
        }),

        getSingleSubGrantManualSub: builder.query<
            TResponse<ISubGrantSubmissionSingleData>,
            string
        >({
            query: (submissionId) => ({
                method: "GET",
                url: `${BASE_URL}${submissionId}/`,
            }),
            providesTags: ["SUBGRANT_SUBMISSION"],
        }),

        modifySubGrantManualSub: builder.mutation<
            TResponse<TSubGrantSubmissionFormData>,
            {
                submissionId: string;
                body: TSubGrantSubmissionFormData & { sub_grant: string };
            }
        >({
            query: ({ submissionId, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${submissionId}/`,
                body,
            }),
            invalidatesTags: ["SUBGRANT_SUBMISSION"],
        }),

        deleteSubGrantManualSub: builder.mutation<
            TResponse<ISubGrantSubmissionSingleData>,
            string
        >({
            query: (submissionId) => ({
                method: "DELETE",
                url: `${BASE_URL}${submissionId}/`,
            }),
            invalidatesTags: ["SUBGRANT_SUBMISSION"],
        }),
    }),
});

export const {
    useCreateSubGrantManualSubMutation,
    useGetAllSubGrantManualSubQuery,
    useGetSingleSubGrantManualSubQuery,
    useModifySubGrantManualSubMutation,
    useDeleteSubGrantManualSubMutation,
} = SubGrantManualSubAPI;
