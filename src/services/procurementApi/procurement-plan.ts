/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import {
  ProcurementPlanData,
  ProcurementPlanResponse,
  ProcurementPlanResultsData,
} from "definations/procurement-types/procurementPlan";
import { ProcurementPlanListSchema } from "definations/procurement-validator";

const BASE_URL = "/procurements/procurement-plans/";
// https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/procurements/procurement-plans/upload/

const ProcurementPlanAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProcurementPlans: builder.query<ProcurementPlanData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["PROCUREMENT_PLAN"],
    }),

    createProcurementPlan: builder.mutation<
      ProcurementPlanResponse,
      z.infer<typeof ProcurementPlanListSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}upload/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PROCUREMENT_PLAN"],
    }),

    getProcurementPlan: builder.query<
      ProcurementPlanResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["PROCUREMENT_PLAN"],
    }),

    updateProcurementPlan: builder.mutation<
      ProcurementPlanResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PROCUREMENT_PLAN"],
    }),

    modifyProcurementPlan: builder.mutation<
      ProcurementPlanResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PROCUREMENT_PLAN"],
    }),

    deleteProcurementPlan: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROCUREMENT_PLAN"],
    }),
  }),
});

export default ProcurementPlanAPI;
