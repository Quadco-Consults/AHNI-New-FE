/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
    ProjectDocumentSchema,
    TProjectDocument,
} from "definations/project-validator";
import {
    ProjectDocumentData,
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
                !error ? invalidateTags("PROJECTS") : [],
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

        updateProjectDocument: builder.mutation<
            ProjectDocumentResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_, error, { path }) =>
                !error ? invalidateTags("PROJECTS", { ids: [path.id] }) : [],
        }),

        modifyProjectDocument: builder.mutation<
            ProjectDocumentResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_, error, { path }) =>
                !error ? invalidateTags("PROJECTS", { ids: [path.id] }) : [],
        }),

        deleteProjectDocument: builder.mutation<void, { path: { id: string } }>(
            {
                query: ({ path }) => ({
                    url: `${BASE_URL}${path.id}/`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, error, { path }) =>
                    !error
                        ? invalidateTags("PROJECTS", { ids: [path.id] })
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
