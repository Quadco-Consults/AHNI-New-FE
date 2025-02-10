import baseAPI from "..";
import { TSolicitationQuotationFormData } from "definations/procurement-validator";
import {
  SolicitationResponse,
  SolicitationSubmissionData,
} from "definations/procurement-types/solicitation";

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
    }),
  }),
});

export const {
  useGetSolicitationSubmissionQuery,
  useCreateSolicitationSubmissionMutation,
} = VendorBidSubmissionAPI;
