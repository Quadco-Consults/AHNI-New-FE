/* eslint-disable no-unused-vars */
import { AHNIApi } from "configs/StoreQueryConfig";
import { StoreQueryTagEnum } from "constants/StoreConstants";
import { invalidateTags, provideTags } from "utils/QueryUtils";

const BASE_URL = "/api/v1/procurement/expression-of-interest/";

export const EoiApi = AHNIApi.injectEndpoints({
  endpoints: (builder) => ({
    getEois: builder.query({
      query: (config) => ({
        url: `${BASE_URL}`,
        ...config,
      }),
      providesTags: (data, error) =>
        !error ? provideTags(StoreQueryTagEnum.EOI, [data?.data]) : [],
    }),
    getEoi: builder.query({
      query: ({ path, ...config }) => ({
        url: `${BASE_URL}/${path.id}`,
        ...config,
      }),
      providesTags: (data, error) =>
        !error ? provideTags(StoreQueryTagEnum.EOI, [data?.data]) : [],
    }),
    createEoi: builder.mutation({
      query: ({ path, ...config }) => ({
        url: `${BASE_URL}`,
        method: "POST",
        ...config,
      }),
      invalidatesTags: (_, error) =>
        !error ? invalidateTags(StoreQueryTagEnum.EOI) : [],
    }),
    updateEoi: builder.mutation({
      query: ({ path, ...config }) => ({
        url: `${BASE_URL}/${path.id}`,
        method: "PUT",
        ...config,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags(StoreQueryTagEnum.EOI, [path.id]) : [],
    }),
    patchEoi: builder.mutation({
      query: ({ path, ...config }) => ({
        url: `${BASE_URL}/${path.id}`,
        method: "PATCH",
        ...config,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags(StoreQueryTagEnum.EOI, [path.id]) : [],
    }),
    deleteEoi: builder.mutation({
      query: ({ path, ...config }) => ({
        url: `${BASE_URL}/${path.id}`,
        method: "DELETE",
        ...config,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags(StoreQueryTagEnum.EOI, [path.id]) : [],
    }),
  }),
});

export default EoiApi;
