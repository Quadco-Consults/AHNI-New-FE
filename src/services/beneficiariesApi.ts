/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from ".";
import { z } from "zod";
import { BeneficiarySchema } from "definations/validator";
import {
  BeneficiariesData,
  BeneficiariesResponse,
  BeneficiariesResultsData,
} from "definations/beneficiaries";

const BASE_URL = "/projects/beneficiaries/";

const beneficiariesAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBeneficiaries: builder.query<BeneficiariesData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("BENEFICIARIES", data) : [],
    }),

    createBeneficiary: builder.mutation<
      BeneficiariesResponse,
      z.infer<typeof BeneficiarySchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("BENEFICIARIES") : [],
    }),

    getBeneficiary: builder.query<
      BeneficiariesResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("BENEFICIARIES", data) : [],
    }),

    updateBeneficiary: builder.mutation<
      BeneficiariesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("BENEFICIARIES", { ids: [path.id] }) : [],
    }),

    modifyBeneficiary: builder.mutation<
      BeneficiariesResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("BENEFICIARIES", { ids: [path.id] }) : [],
    }),

    deleteBeneficiary: builder.mutation<
      BeneficiariesResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("BENEFICIARIES", { ids: [path.id] }) : [],
    }),
  }),
});

export default beneficiariesAPi;
