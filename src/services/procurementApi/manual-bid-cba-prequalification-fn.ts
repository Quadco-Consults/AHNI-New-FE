import { provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  ManualBidCbaPrequalificationData,
  ManualBidCbaPrequalificationResultsData,
} from "definations/procurement-types/manual-bid-cba-prequalification";

const BASE_URL = "/procurements/vendor-bid-prequalification-summary/";

const VendorBidPrequalificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVendorBidPrequalifications: builder.query<
      ManualBidCbaPrequalificationData,
      {}
    >({
      //   {}.query<CbaData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["CBA"],
    }),
    // >({
    //   query: (config) => ({
    //     url: `${BASE_URL}`,
    //     ...config,
    //   }),
    //   providesTags: (data, error) =>
    //     !error ? provideTags("VENDOR_BID_PREQUALIFICATION", data) : [],
    // }),

    getVendorBidPrequalification: builder.query<
      ManualBidCbaPrequalificationResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}?cba=${path.id}`,
      }),
      providesTags: (data, error) =>
        !error ? provideTags("MANUAL_BID_CBA_PREQUALIFICATION", data) : [],
    }),
  }),
});

export default VendorBidPrequalificationAPI;
