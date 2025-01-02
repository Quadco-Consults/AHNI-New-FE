/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  PrequalificationCriteriaData,
  PrequalificationCriteriaResponse,
  PrequalificationCriteriaResultsData,
} from "definations/procurement-types/prequalification-criteria";
import { PrequalificationCriteriaSchema } from "definations/procurement-validator";

const BASE_URL = "/procurements/config/prequalification-criteria/";

const PrequalificationCriteriaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPrequalificationCriterial: builder.query<
      PrequalificationCriteriaData,
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PREQUALIFICATION_CRITERIA", data) : [],
    }),

    createPrequalificationCriteria: builder.mutation<
      PrequalificationCriteriaResponse,
      z.infer<typeof PrequalificationCriteriaSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PREQUALIFICATION_CRITERIA") : [],
    }),

    getPrequalificationCriteria: builder.query<
      PrequalificationCriteriaResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PREQUALIFICATION_CRITERIA", data) : [],
    }),

    updatePrequalificationCriteria: builder.mutation<
      PrequalificationCriteriaResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_CRITERIA", { ids: [path.id] })
          : [],
    }),

    modifyPrequalificationCriteria: builder.mutation<
      PrequalificationCriteriaResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_CRITERIA", { ids: [path.id] })
          : [],
    }),

    deletePrequalificationCriteria: builder.mutation<
      void,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("PREQUALIFICATION_CRITERIA", { ids: [path.id] })
          : [],
    }),
  }),
});

export default PrequalificationCriteriaAPI;
