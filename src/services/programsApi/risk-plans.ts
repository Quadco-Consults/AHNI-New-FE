/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  RiskPlansData,
  RiskPlansResponse,
  RiskPlansResultsData,
} from "definations/program-types/risk-plans";
import { RiskPlansSchema } from "definations/program-validator";

const BASE_URL = "/programs/risk-plans/";

const RiskPlansAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getRiskPlans: builder.query<RiskPlansResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("RISK_PLANS", data) : [],
    }),

    createRiskPlan: builder.mutation<
      RiskPlansResponse,
      z.infer<typeof RiskPlansSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("RISK_PLANS") : [],
    }),

    getRiskPlan: builder.query<RiskPlansData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("RISK_PLANS", data) : [],
    }),

    updateRiskPlan: builder.mutation<
      RiskPlansResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_PLANS", { ids: [path.id] }) : [],
    }),

    modifyRiskPlan: builder.mutation<
      RiskPlansResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_PLANS", { ids: [path.id] }) : [],
    }),

    deleteRiskPlan: builder.mutation<
      RiskPlansResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("RISK_PLANS", { ids: [path.id] }) : [],
    }),
  }),
});

export default RiskPlansAPI;
