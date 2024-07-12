/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  LocationData,
  LocationResponse,
  LocationResultsData,
} from "definations/project-types/location";
import { LocationSchema } from "definations/project-validator";

const BASE_URL = "/config/locations/";

const LocationAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLocation: builder.query<LocationData, { params: {} }>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("LOCATION", data) : [],
    }),

    createFundingSource: builder.mutation<
      LocationResponse,
      z.infer<typeof LocationSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("LOCATION") : [],
    }),

    getFundingSource: builder.query<
      LocationResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("LOCATION", data) : [],
    }),

    updateFundingSource: builder.mutation<
      LocationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOCATION", { ids: [path.id] }) : [],
    }),

    modifyFundingSource: builder.mutation<
      LocationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOCATION", { ids: [path.id] }) : [],
    }),

    deleteFundingSource: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOCATION", { ids: [path.id] }) : [],
    }),
  }),
});

export default LocationAPi;
