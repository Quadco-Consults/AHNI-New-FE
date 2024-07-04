/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { ProjectDocumentSchema } from "definations/project-validator";
import {
  ProjectDocumentData,
  ProjectDocumentResponse,
  ProjectDocumentResultsData,
} from "definations/project-types/project-document";

const BASE_URL = "/projects/project-documents/";

const projectDocumentAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProjectDocuments: builder.query<ProjectDocumentData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECT_DOCUMENT", data) : [],
    }),

    createProjectDocument: builder.mutation<ProjectDocumentResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PROJECTS") : [],
    }),

    getProjectDocument: builder.query<
      ProjectDocumentResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
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

    deleteProjectDocument: builder.mutation<
      ProjectDocumentResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PROJECTS", { ids: [path.id] }) : [],
    }),
  }),
});

export default projectDocumentAPi;
