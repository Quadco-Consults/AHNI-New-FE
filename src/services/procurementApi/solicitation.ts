/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import {
  SolicitationSchema,
  SolicitationSubmissionSchema,
} from "definations/procurement-validator";
import {
  SolicitationData,
  SolicitationResponse,
  SolicitationResultsData,
  SolicitationSubmissionData,
} from "definations/procurement-types/solicitation";

const BASE_URL = "/procurements/solicitations/";

const SolicitationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSolicitations: builder.query<SolicitationData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["SOLICITATION"],
    }),

    createSolicitation: builder.mutation<
      SolicitationResponse,
      z.infer<typeof SolicitationSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SOLICITATION"],
    }),

    createSolicitationBid: builder.mutation<
      SolicitationResponse,
      z.infer<typeof SolicitationSubmissionSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}submit_bid/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SOLICITATION"],
    }),

    getSolicitation: builder.query<
      SolicitationResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["SOLICITATION"],
    }),

    getSolicitationSubmission: builder.query<
      SolicitationSubmissionData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/submissions/`,
        };
      },
      providesTags: ["SOLICITATION"],
    }),

    updateSolicitation: builder.mutation<
      SolicitationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SOLICITATION"],
    }),

    modifySolicitation: builder.mutation<
      SolicitationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SOLICITATION"],
    }),

    deleteSolicitation: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SOLICITATION"],
    }),
  }),
});

export default SolicitationAPI;
