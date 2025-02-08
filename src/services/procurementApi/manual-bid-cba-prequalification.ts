import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
// import {
//   ManualBidCbaPrequalificationData,
//   ManualBidCbaPrequalificationResponse,
//   ManualBidCbaPrequalificationResultsData,
// } from "definations/procurement-types/manual-bid-cba-prequalification";
import { ManualBidCbaPrequalificationSchema } from "definations/procurement-validator";
import {
  ManualBidCbaPrequalificationData,
  ManualBidCbaPrequalificationResponse,
} from "definations/procurement-types/manual-bid-cba-prequalification";

const BASE_URL = "/procurements/manaul-bid-cba-prequalification/";

const testURL = "/procurements/manaul-bid/by-solicitation/";
// const testURLf = "/procurement/manual-bid/by-solicitation/?status=PASSED";

const ManualBidCbaPrequalificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getManualBidCbaPrequalifications: builder.query<
      ManualBidCbaPrequalificationData,
      {}
    >({
      query: (config) => ({
        url: `${BASE_URL}`,
        ...config,
      }),
      providesTags: (data, error) =>
        !error ? provideTags("MANUAL_BID_CBA_PREQUALIFICATION", data) : [],
    }),

    getManualBidPrequalifications: builder.query<
      ManualBidCbaPrequalificationData,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${testURL}${path.id}/?status=PASSED`,
      }),
      providesTags: (data, error) =>
        !error ? provideTags("MANUAL_BID_CBA_PREQUALIFICATION", data) : [],
    }),

    createManualBidCbaPrequalification: builder.mutation<
      ManualBidCbaPrequalificationResponse,
      z.infer<typeof ManualBidCbaPrequalificationSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("MANUAL_BID_CBA_PREQUALIFICATION") : [],
    }),

    getManualBidCbaPrequalification: builder.query<
      ManualBidCbaPrequalificationResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
      }),
      providesTags: (data, error) =>
        !error ? provideTags("MANUAL_BID_CBA_PREQUALIFICATION", data) : [],
    }),

    updateManualBidCbaPrequalification: builder.mutation<
      ManualBidCbaPrequalificationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("MANUAL_BID_CBA_PREQUALIFICATION", {
              ids: [path.id],
            })
          : [],
    }),

    modifyManualBidCbaPrequalification: builder.mutation<
      ManualBidCbaPrequalificationResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("MANUAL_BID_CBA_PREQUALIFICATION", {
              ids: [path.id],
            })
          : [],
    }),

    deleteManualBidCbaPrequalification: builder.mutation<
      void,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("MANUAL_BID_CBA_PREQUALIFICATION", {
              ids: [path.id],
            })
          : [],
    }),
  }),
});

export default ManualBidCbaPrequalificationAPI;
