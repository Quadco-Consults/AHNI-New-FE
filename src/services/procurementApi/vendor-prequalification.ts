/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  VendorPrequalificationData,
  VendorPrequalificationResponse,
  VendorPrequalificationSchema,
} from "definations/procurement-types/vendor-prequalification";

const BASE_URL = "/procurement/vendor-prequalification/";

const VendorPrequalificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVendorPrequalifications: builder.query<VendorPrequalificationData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("VENDOR_PREQUALIFICATION", data) : [],
    }),

    createVendorPrequalification: builder.mutation<
      VendorPrequalificationResponse,
      z.infer<typeof VendorPrequalificationSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("VENDOR_PREQUALIFICATION") : [],
    }),
  }),
});

export default VendorPrequalificationAPI;
