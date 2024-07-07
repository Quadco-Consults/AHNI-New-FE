/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  SupportiveSupervisionData,
  SupportiveSupervisionResponse,
} from "definations/program-types/supportive-supervision";
import { z } from "zod";
import { SupportiveSupervisionSchema } from "definations/program-validator";

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
      any,
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

    createWorkPlan: builder.mutation<
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

    updateWorkPlan: builder.mutation<
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

    modifyWorkPlan: builder.mutation<
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

    deleteWorkPlan: builder.mutation<
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
