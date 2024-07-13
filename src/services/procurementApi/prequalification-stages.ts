/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { PrequalificationStagesSchema } from "definations/procurement-validator";
import {
  PrequalificationStagesData,
  PrequalificationStagesResponse,
  PrequalificationStagesResultsData,
} from "definations/procurement-types/prequalification-stages";

const BASE_URL = "/procurement/config/prequalification-stages/";

const PrequalificationStagesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPrequalificationStages: builder.query<PrequalificationStagesData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PREQUALIFICATION_STAGES", data) : [],
    }),

    createPrequalificationStage: builder.mutation<
      PrequalificationStagesResponse,
      z.infer<typeof PrequalificationStagesSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PREQUALIFICATION_STAGES") : [],
    }),

    getPrequalificationStage: builder.query<
      PrequalificationStagesResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PREQUALIFICATION_STAGES", data) : [],
    }),

    updatePrequalificationStage: builder.mutation<
      PrequalificationStagesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_STAGES", { ids: [path.id] })
          : [],
    }),

    modifyPrequalificationStage: builder.mutation<
      PrequalificationStagesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_STAGES", { ids: [path.id] })
          : [],
    }),

    deletePrequalificationStage: builder.mutation<
      void,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_STAGES", { ids: [path.id] })
          : [],
    }),
  }),
});

export default PrequalificationStagesAPI;
