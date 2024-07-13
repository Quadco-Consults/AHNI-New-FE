/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  ProjectObjectiveData,
  ProjectObjectiveResponse,
  ProjectObjectiveResultsData,
} from "definations/project-types/project-objective";
import { ProjectObjectiveSchema } from "definations/project-validator";

const BASE_URL = "/projects/project-objectives/";

const projectObjectiveAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProjectObjectives: builder.query<ProjectObjectiveData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECT_OBJECTIVE", data) : [],
    }),

    createProjectObjective: builder.mutation<
      ProjectObjectiveResponse,
      z.infer<typeof ProjectObjectiveSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PROJECT_OBJECTIVE") : [],
    }),

    getProjectObjective: builder.query<
      ProjectObjectiveResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PROJECT_OBJECTIVE", data) : [],
    }),

    updateProjectObjective: builder.mutation<
      ProjectObjectiveResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PROJECT_OBJECTIVE", { ids: [path.id] }) : [],
    }),

    modifyProjectObjective: builder.mutation<
      ProjectObjectiveResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PROJECT_OBJECTIVE", { ids: [path.id] }) : [],
    }),

    deleteProjectObjective: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PROJECT_OBJECTIVE", { ids: [path.id] }) : [],
    }),
  }),
});

export default projectObjectiveAPi;
