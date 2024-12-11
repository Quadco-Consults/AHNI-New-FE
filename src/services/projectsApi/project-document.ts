import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

import {
    ProjectDocumentResponse,
    ProjectDocumentResultsData,
} from "definations/project-types/project-document";
import { TBasePaginatedResponse } from "definations/auth";

const BASE_URL = "/projects/documents/";

const projectDocumentAPi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllProjectDocuments: builder.query<
            TBasePaginatedResponse<ProjectDocumentResultsData>,
            string
        >({
            query: (projectId) => {
                return {
                    url: `${BASE_URL}`,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("PROJECT_DOCUMENT", data) : [],
        }),

        createProjectDocument: builder.mutation<
            ProjectDocumentResponse,
            { title: string; project: string; file: File }
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",

                body,
            }),
            invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("PROJECT_DOCUMENT") : [],
        }),

        getProjectDocument: builder.query<ProjectDocumentResultsData, string>({
            query: (projectId) => {
                return {
                    url: `${BASE_URL}${projectId}/`,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("PROJECT_DOCUMENT", data) : [],
        }),

        deleteProjectDocument: builder.mutation<void, { path: { id: string } }>(
            {
                query: ({ path }) => ({
                    url: `${BASE_URL}${path.id}/`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, error, { path }) =>
                    !error
                        ? invalidateTags("PROJECT_DOCUMENT", { ids: [path.id] })
                        : [],
            }
        ),
    }),
});

export const {
    useCreateProjectDocumentMutation,
    useGetAllProjectDocumentsQuery,
    useDeleteProjectDocumentMutation,
    useGetProjectDocumentQuery,
} = projectDocumentAPi;
