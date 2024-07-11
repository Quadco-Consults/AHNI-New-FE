/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  FacilityData,
  FacilityResponse,
} from "definations/program-types/facilities";
import { z } from "zod";
import { FacilitySchema } from "definations/program-validator";

const BASE_URL = "/programs/facilities/";

const FacilityAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query<FacilityData[], void>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FACILITIES", data) : [],
    }),

    getFacility: builder.query<FacilityData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FACILITIES", data) : [],
    }),

    createFacility: builder.mutation<
      FacilityResponse,
      z.infer<typeof FacilitySchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("FACILITIES") : [],
    }),

    updateFacility: builder.mutation<
      FacilityResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FACILITIES", { ids: [path.id] }) : [],
    }),

    modifyFacility: builder.mutation<
      FacilityResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FACILITIES", { ids: [path.id] }) : [],
    }),

    deleteFacility: builder.mutation<
      FacilityResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FACILITIES", { ids: [path.id] }) : [],
    }),
  }),
});

export default FacilityAPI;
