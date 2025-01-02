/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { LotsSchema } from "definations/procurement-validator";
import {
  LotsData,
  LotsResponse,
  LotsResultsData,
} from "definations/procurement-types/lots";

const BASE_URL = "/procurements/lots/";

const LotsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLots: builder.query<LotsData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("LOTS", data) : []),
    }),
    getLotList: builder.query<LotsResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("LOTS", data) : []),
    }),

    createLot: builder.mutation<LotsResponse, z.infer<typeof LotsSchema>>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) => (!error ? invalidateTags("LOTS") : []),
    }),

    getLot: builder.query<LotsResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("LOTS", data) : []),
    }),

    updateLot: builder.mutation<
      LotsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOTS", { ids: [path.id] }) : [],
    }),

    modifyLot: builder.mutation<
      LotsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOTS", { ids: [path.id] }) : [],
    }),

    deleteLot: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("LOTS", { ids: [path.id] }) : [],
    }),
  }),
});

export default LotsAPI;
