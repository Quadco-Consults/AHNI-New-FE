import { TPaginatedResponse, TRequest } from "definations/index";
import baseAPI from "../..";
import {
    TDocumentTypeData,
    TDocumentTypeFormValues,
} from "definations/modules/project/document-types";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllDocumentType: builder.query<
            TPaginatedResponse<TDocumentTypeData>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/document-types/",
                params,
            }),
            providesTags: ["DocumentTypes"],
        }),

        addDocumentType: builder.mutation<
            TDocumentTypeData,
            TDocumentTypeFormValues
        >({
            query: (body) => ({
                url: "/projects/document-types/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["DocumentTypes"],
        }),

        updateDocumentType: builder.mutation<
            TDocumentTypeData,
            { id: string; body: TDocumentTypeFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/projects/document-types/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["DocumentTypes"],
        }),

        deleteDocumentTypee: builder.mutation<TDocumentTypeData, string>({
            query: (id) => ({
                url: `/projects/document-types/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DocumentTypes"],
        }),
    }),
});

export const {
    useGetAllDocumentTypeQuery,
    useAddDocumentTypeMutation,
    useUpdateDocumentTypeMutation,
    useDeleteDocumentTypeeMutation,
} = projectsAPI;
