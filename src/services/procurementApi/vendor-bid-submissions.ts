import baseAPI from "..";
import { z } from "zod";
import {
  SolicitationSchema,
  SolicitationSubmissionSchema,
  TSolicitationQuotationFormData,
} from "definations/procurement-validator";
import {
  ISolicitationRFQData,
  SolicitationData,
  SolicitationResponse,
  SolicitationResultsData,
  SolicitationSubmissionData,
} from "definations/procurement-types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/manaul-bid/";

const VendorBidSubmissionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSolicitationSubmission: builder.query<
      SolicitationSubmissionData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}by-solicitation/${path.id}/`,
        };
      },
      // providesTags: ["SOLICITATION"],
    }),
    createSolicitationSubmission: builder.mutation<
      SolicitationResponse,
      TSolicitationQuotationFormData
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SOLICITATION"],
    }),
    // updateSolicitation: builder.mutation<
    //     SolicitationResponse,
    //     { path: { id: string }; body: any }
    // >({
    //     query: ({ path, body }) => ({
    //         url: `${BASE_URL}${path.id}/`,
    //         method: "PUT",
    //         body,
    //     }),
    //     invalidatesTags: ["SOLICITATION"],
    // }),

    // modifySolicitation: builder.mutation<
    //     SolicitationResponse,
    //     { path: { id: string }; body: any }
    // >({
    //     query: ({ path, body }) => ({
    //         url: `${BASE_URL}${path.id}/`,
    //         method: "PATCH",
    //         body,
    //     }),
    //     invalidatesTags: ["SOLICITATION"],
    // }),

    // deleteSolicitation: builder.mutation<void, { path: { id: string } }>({
    //     query: ({ path }) => ({
    //         url: `${BASE_URL}${path.id}/`,
    //         method: "DELETE",
    //     }),
    //     invalidatesTags: ["SOLICITATION"],
    // }),
  }),
});

export const {
  useGetSolicitationSubmissionQuery,
  useCreateSolicitationSubmissionMutation,
} = VendorBidSubmissionAPI;
