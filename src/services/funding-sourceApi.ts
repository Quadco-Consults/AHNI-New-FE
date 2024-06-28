/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from ".";
import { z } from "zod";
import { FundingSourceSchema } from "definations/validator";
import {
  FundingSourceData,
  FundingSourceResponse,
  FundingSourceResultsData,
} from "definations/funding-source";

const BASE_URL = "/projects/funding-sources/";

const FundingSourceAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFundingSources: builder.query<FundingSourceData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FUNDING_SOURCE", data) : [],
    }),

    createFundingSource: builder.mutation<
      FundingSourceResponse,
      z.infer<typeof FundingSourceSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("FUNDING_SOURCE") : [],
    }),

    getFundingSource: builder.query<
      FundingSourceResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FUNDING_SOURCE", data) : [],
    }),

    updateFundingSource: builder.mutation<
      FundingSourceResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FUNDING_SOURCE", { ids: [path.id] }) : [],
    }),

    modifyFundingSource: builder.mutation<
      FundingSourceResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FUNDING_SOURCE", { ids: [path.id] }) : [],
    }),

    deleteFundingSource: builder.mutation<
      FundingSourceResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FUNDING_SOURCE", { ids: [path.id] }) : [],
    }),
  }),
});

export default FundingSourceAPi;
