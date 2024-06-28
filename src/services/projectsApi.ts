/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from ".";
import {
  ProjectsData,
  ProjectsResponse,
  ProjectsResultsData,
} from "definations/projects";
import { z } from "zod";
import { ProjectsSummarySchema } from "definations/validator";

const BASE_URL = "/projects/projects/";

const projectsAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECTS", data) : [],
    }),

    createProject: builder.mutation<ProjectsResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PROJECTS") : [],
    }),

    getProject: builder.query<ProjectsResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECTS", data) : [],
    }),

    updateProject: builder.mutation<
      ProjectsResponse,
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

    modifyProject: builder.mutation<
      ProjectsResponse,
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

    deleteProject: builder.mutation<ProjectsResponse, { path: { id: string } }>(
      {
        query: ({ path }) => ({
          url: `${BASE_URL}${path.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { path }) =>
          !error ? invalidateTags("PROJECTS", { ids: [path.id] }) : [],
      }
    ),
  }),
});

export default projectsAPi;
