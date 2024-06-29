/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from ".";
import { z } from "zod";
import {
  ProjectDocumentTypesData,
  ProjectDocumentTypesResponse,
  ProjectDocumentTypesResultsData,
} from "definations/project-document-types";
import { DocumentTypesSchema } from "definations/validator";

const BASE_URL = "/projects/document-types/";

const projectDocumentTypesAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProjectDocumentTypes: builder.query<
      ProjectDocumentTypesData,
      { params: {} }
    >({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECT_DOCUMENT_TYPES", data) : [],
    }),

    createProjectDocumentTypes: builder.mutation<
      ProjectDocumentTypesResponse,
      z.infer<typeof DocumentTypesSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PROJECT_DOCUMENT_TYPES") : [],
    }),

    getProjectDocumentType: builder.query<
      ProjectDocumentTypesResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECT_DOCUMENT_TYPES", data) : [],
    }),

    updateProjectDocumentTypes: builder.mutation<
      ProjectDocumentTypesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PROJECT_DOCUMENT_TYPES", { ids: [path.id] })
          : [],
    }),

    modifyProjectDocumentTypes: builder.mutation<
      ProjectDocumentTypesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PROJECT_DOCUMENT_TYPES", { ids: [path.id] })
          : [],
    }),

    deleteProjectDocumentTypes: builder.mutation<
      ProjectDocumentTypesResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PROJECT_DOCUMENT_TYPES", { ids: [path.id] })
          : [],
    }),
  }),
});

export default projectDocumentTypesAPi;
