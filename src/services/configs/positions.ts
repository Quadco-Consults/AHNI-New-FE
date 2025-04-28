/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  PositionsData,
  PositionsResponse,
  PositionsResultsData,
} from "definations/configs/positions";
import { PositionsSchema } from "definations/program-validator";

const BASE_URL = "/config/positions/";

const PostionsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPositions: builder.query<PositionsData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("POSITION", data) : [],
    }),
    getPositionPaginate: builder.query<PositionsResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("POSITION", data) : [],
    }),

    createPosition: builder.mutation<
      PositionsResponse,
      z.infer<typeof PositionsSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("POSITION") : [],
    }),

    getPosition: builder.query<
      PositionsResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("POSITION", data) : [],
    }),

    updatePosition: builder.mutation<
      PositionsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("POSITION", { ids: [path.id] }) : [],
    }),

    modifyPosition: builder.mutation<
      PositionsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("POSITION", { ids: [path.id] }) : [],
    }),

    deletePosition: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("POSITION", { ids: [path.id] }) : [],
    }),
  }),
});

export const {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useGetPositionPaginateQuery,
  useGetPositionQuery,
  useGetPositionsQuery,
  useUpdatePositionMutation,
  useModifyPositionMutation
} = PostionsAPI;
