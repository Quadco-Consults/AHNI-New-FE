/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  FinancialYearResponse,
  FinancialYearResultsData,
  FinancialYearSchema,
} from "definations/configs/financial-year";

const BASE_URL = "/config/financial-year/";

const FinancialAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialYears: builder.query<FinancialYearResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FINANCIAL_YEAR", data) : [],
    }),

    createFinancialYear: builder.mutation<
      FinancialYearResponse,
      z.infer<typeof FinancialYearSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("FINANCIAL_YEAR") : [],
    }),

    getFinancialYear: builder.query<
      FinancialYearResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("FINANCIAL_YEAR", data) : [],
    }),

    updateFinancialYear: builder.mutation<
      FinancialYearResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FINANCIAL_YEAR", { ids: [path.id] }) : [],
    }),

    modifyFinancialYear: builder.mutation<
      FinancialYearResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FINANCIAL_YEAR", { ids: [path.id] }) : [],
    }),

    deleteFinancialYear: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("FINANCIAL_YEAR", { ids: [path.id] }) : [],
    }),
  }),
});

export default FinancialAPI;
