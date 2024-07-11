/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  RiskCategoriesResponse,
  RiskCategoriesResultsData,
} from "definations/program-types/risk-categories";
import { RiskCategoriesSchema } from "definations/program-validator";

const BASE_URL = "/programs/risk-categories/";

const RiskCategoriesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getRiskCategories: builder.query<RiskCategoriesResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("RISK_CATEGORIES", data) : [],
    }),

    createRiskCategory: builder.mutation<
      RiskCategoriesResponse,
      z.infer<typeof RiskCategoriesSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("RISK_CATEGORIES") : [],
    }),

    getRiskCategory: builder.query<
      RiskCategoriesResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("RISK_CATEGORIES", data) : [],
    }),

    updateRiskCategory: builder.mutation<
      RiskCategoriesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_CATEGORIES", { ids: [path.id] }) : [],
    }),

    modifyRiskCategory: builder.mutation<
      RiskCategoriesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_CATEGORIES", { ids: [path.id] }) : [],
    }),

    deleteRiskCategory: builder.mutation<
      RiskCategoriesResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_CATEGORIES", { ids: [path.id] }) : [],
    }),
  }),
});

export default RiskCategoriesAPI;
