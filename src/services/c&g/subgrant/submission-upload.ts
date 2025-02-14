import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TSubGrantSubUploadFormData } from "components/modals/dailog/components/SubGrantSubUploadModal";
import { ISubGrantUploadData } from "definations/c&g/contract-management/sub-grant/sub-grant-upload";

const BASE_URL = "/contract-grants/sub-grants/submissions/documents/";

const SubGrantUploadAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSubGrantUpload: builder.mutation<
            TResponse<ISubGrantUploadData>,
            TSubGrantSubUploadFormData & { sub_grant_submission: string }
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["SUBGRANT_UPLOAD"],
        }),

        getAllSubGrantUploads: builder.query<
            TPaginatedResponse<ISubGrantUploadData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["SUBGRANT_UPLOAD"],
        }),

        deleteSubGrantUpload: builder.mutation<
            TResponse<ISubGrantUploadData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["SUBGRANT_UPLOAD"],
        }),
    }),
});

export const {
    useCreateSubGrantUploadMutation,
    useGetAllSubGrantUploadsQuery,
    useDeleteSubGrantUploadMutation,
} = SubGrantUploadAPI;
