/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { FundRequestSchema } from "definations/program-validator";
import {
  FundRequestData,
  FundRequestResponse,
  FundRequestResultsData,
} from "definations/program-types/fund-request";

const BASE_URL = "/programs/fund-requests/";

const FundRequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFundRequests: builder.query<FundRequestData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
    }),

    getFundRequest: builder.query<
      FundRequestResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
    }),

    getFundRequestByProject: builder.query<FundRequestData, void>({
      query: () => {
        return {
          url: `${BASE_URL}request-by-project/`,
        };
      },
    }),

    createFundRequest: builder.mutation<
      FundRequestResponse,
      z.infer<typeof FundRequestSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FUND_REQUEST"],
    }),

    updateFundRequest: builder.mutation<
      FundRequestResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FUND_REQUEST"],
    }),
  }),
});

export default FundRequestAPI;
