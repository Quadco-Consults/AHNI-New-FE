/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  SupportiveSupervisionData,
  SupportiveSupervisionResponse,
  SupportiveSupervisionEvaluationData,
  EvaluationCriteria,
} from "definations/program-types/supportive-supervision";
import { z } from "zod";
import {
  SupportiveSupervisionResponseDataSchema,
  SupportiveSupervisionSchema,
} from "definations/program-validator";

const BASE_URL = "/programs/supportive-supervisions/";

const SupportiveSupervisionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSupportiveSupervisions: builder.query<SupportiveSupervisionData[], void>(
      {
        query: () => {
          return {
            url: `${BASE_URL}`,
          };
        },
        providesTags: (data, error) =>
          !error ? provideTags("SUPPORTIVE_SUPERVISION", data) : [],
      }
    ),

    getSupportiveSupervisionsEvaluationCriteria: builder.query<
      SupportiveSupervisionEvaluationData[],
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}evaluation-criteria/`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("SUPPORTIVE_SUPERVISION", data) : [],
    }),

    getSupportiveSupervision: builder.query<
      SupportiveSupervisionData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("SUPPORTIVE_SUPERVISION", data) : [],
    }),

    getSupportiveSupervisionCriteria: builder.query<
      EvaluationCriteria[],
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}criteria/${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("SUPPORTIVE_SUPERVISION", data) : [],
    }),

    createSupportiveSupervision: builder.mutation<
      SupportiveSupervisionResponse,
      z.infer<typeof SupportiveSupervisionSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("SUPPORTIVE_SUPERVISION") : [],
    }),

    createSupportiveSupervisionResponseData: builder.mutation<
      SupportiveSupervisionResponse,
      z.infer<typeof SupportiveSupervisionResponseDataSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}response-data/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("SUPPORTIVE_SUPERVISION") : [],
    }),

    createSupportiveSupervisionResponseDocument: builder.mutation<
      SupportiveSupervisionResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}response-document/${path.id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("SUPPORTIVE_SUPERVISION") : [],
    }),

    updateSupportiveSupervision: builder.mutation<
      SupportiveSupervisionResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("SUPPORTIVE_SUPERVISION", { ids: [path.id] })
          : [],
    }),

    modifySupportiveSupervision: builder.mutation<
      SupportiveSupervisionResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("SUPPORTIVE_SUPERVISION", { ids: [path.id] })
          : [],
    }),

    deleteSupportiveSupervision: builder.mutation<
      SupportiveSupervisionResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("SUPPORTIVE_SUPERVISION", { ids: [path.id] })
          : [],
    }),
  }),
});

export default SupportiveSupervisionAPI;
