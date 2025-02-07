import baseAPI from "..";
import { TSolicitationQuotationFormData } from "definations/procurement-validator";
import {
  ISolicitationRFQData,
  SolicitationResponse,
  SolicitationSubmissionData,
} from "definations/procurement-types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/solicitations/";

const SolicitationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createSolicitation: builder.mutation<
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

    getAllSolicitations: builder.query<
      TPaginatedResponse<ISolicitationRFQData>,
      TRequest
    >({
      query: (params) => ({
        method: "GET",
        url: `${BASE_URL}`,
        params,
      }),
      providesTags: ["SOLICITATION"],
    }),

    getSingleSolicitation: builder.query<
      TResponse<ISolicitationRFQData>,
      string
    >({
      query: (id) => ({
        method: "GET",
        url: `${BASE_URL}${id}`,
      }),
      providesTags: ["SOLICITATION"],
    }),

    getSolicitationSubmission: builder.query<
      SolicitationSubmissionData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `/by-solicitation/${path.id}/submissions/`,
        };
      },
      providesTags: ["SOLICITATION"],
    }),

    getPassedSolicitation: builder.query<
      SolicitationSubmissionData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `/by-solicitation/${path.id}/?status=PASSED`,
        };
      },
      providesTags: ["SOLICITATION"],
    }),
  }),
});

export const {
  useGetPassedSolicitationQuery,
  useGetSolicitationSubmissionQuery,
  useCreateSolicitationMutation,
  useGetAllSolicitationsQuery,
  useGetSingleSolicitationQuery,
} = SolicitationAPI;
