import {
    ISubGrantSubmissionPaginatedData,
    ISubGrantSubmissionSingleData,
    TSubGrantSubmissionFormData,
} from "definations/c&g/sub-grant";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const SubGrantManualSubAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSubGrantManualSub: builder.mutation<
            TResponse<ISubGrantSubmissionSingleData>,
            TSubGrantSubmissionFormData & { sub_grant: string }
        >({
            query: (body) => ({
                method: "POST",
                url: `/contract-grants/sub-grants/submissions/`,
                body,
            }),
            invalidatesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),

        getAllSubGrantManualSub: builder.query<
            TPaginatedResponse<ISubGrantSubmissionPaginatedData>,
            TRequest & { sub_grant: string }
        >({
            query: (params) => ({
                method: "GET",
                url: `/contract-grants/sub-grants/submissions/`,
                params: params,
            }),
            providesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),

        getSingleSubGrantManualSub: builder.query<
            TResponse<ISubGrantSubmissionSingleData>,
            { subGrantId: string; submissionId: string }
        >({
            query: ({ subGrantId, submissionId }) => ({
                method: "GET",
                url: `/contract-grants/sub-grants/${subGrantId}/submissions/${submissionId}/`,
            }),
            providesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),

        modifySubGrantManualSub: builder.mutation<
            TResponse<TSubGrantSubmissionFormData>,
            {
                subGrantId: string;
                submissionId: string;
                body: TSubGrantSubmissionFormData;
            }
        >({
            query: ({ subGrantId, submissionId, body }) => ({
                method: "PUT",
                url: `/contract-grants/sub-grants/${subGrantId}/submissions/${submissionId}/`,
                body,
            }),
            invalidatesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),

        uploadPartnerSubmissionDocument: builder.mutation<
            TResponse<TSubGrantSubmissionFormData>,
            {
                subGrantId: string;
                submissionId: string;
                body: { documents: { name: string; document: File }[] };
            }
        >({
            query: ({ subGrantId, submissionId, body }) => ({
                method: "PATCH",
                url: `/contract-grants/sub-grants/${subGrantId}/submissions/${submissionId}/`,
                body,
            }),
            invalidatesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),

        deleteSubGrantManualSub: builder.mutation<
            TResponse<ISubGrantSubmissionSingleData>,
            {
                subGrantId: string;
                submissionId: string;
            }
        >({
            query: ({ subGrantId, submissionId }) => ({
                method: "DELETE",
                url: `/contract-grants/sub-grants/${subGrantId}/submissions/${submissionId}/`,
            }),
            invalidatesTags: ["SUB_GRANT_MANUAL_SUB"],
        }),
    }),
});

export const {
    useCreateSubGrantManualSubMutation,
    useGetAllSubGrantManualSubQuery,
    useGetSingleSubGrantManualSubQuery,
    useModifySubGrantManualSubMutation,
    useUploadPartnerSubmissionDocumentMutation,
    useDeleteSubGrantManualSubMutation,
} = SubGrantManualSubAPI;
