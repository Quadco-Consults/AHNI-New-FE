/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
// import {
//   PurchaseRequestData,
//   PurchaseRequestResponse,
//   PurchaseRequestResultsData,
// } from "definations/procurement-types/purchase-request";
import { PurchaseRequestResultsData } from "definations/procurement-types/purchase-request";
import baseAPI from "..";
import { z } from "zod";
import { SampleMemoResultsData } from "definations/procurement-types/sample-memo";
// import { PurchaseRequestSchema } from "definations/procurement-validator";

const BASE_URL = "/procurements/purchase-request-memo/";

const PurchaseRequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createActivityMemo: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SAMPLE_MEMO"],
    }),

    getActivityMemo: builder.query<
      SampleMemoResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["SAMPLE_MEMO"],
    }),
  }),
});

export default PurchaseRequestAPI;
