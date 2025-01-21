import baseAPI from "..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TProjectDocumentData } from "definations/project/document";

const BASE_URL = "/projects/documents/";

const ProjectDocumentAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createProjectDocument: builder.mutation<
            TResponse<TProjectDocumentData>,
            { title: string; project: string; file: File }
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["PROJECT_DOCUMENT"],
        }),

        getAllProjectDocuments: builder.query<
            TPaginatedResponse<TProjectDocumentData>,
            TRequest & { project: string }
        >({
            query: (params) => {
                return {
                    url: `${BASE_URL}`,
                    params,
                };
            },
            providesTags: ["PROJECT_DOCUMENT"],
        }),

        deleteProjectDocument: builder.mutation<void, { path: { id: string } }>(
            {
                query: ({ path }) => ({
                    url: `${BASE_URL}${path.id}/`,
                    method: "DELETE",
                }),
                invalidatesTags: ["PROJECT_DOCUMENT"],
            }
        ),
    }),
});

export const {
    useCreateProjectDocumentMutation,
    useGetAllProjectDocumentsQuery,
    useDeleteProjectDocumentMutation,
} = ProjectDocumentAPI;
