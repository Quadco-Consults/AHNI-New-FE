/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import {
  PriceIntelligenceDetail,
  PriceIntelligenceList,
} from "definations/procurement-types/price-intelligence";

const BASE_URL = "/procurements/price-intelligence/";

const PriceIntelligenceAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPriceIntelligences: builder.query<PriceIntelligenceList[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["PRICE_INTELLIGENCE"],
    }),

    getPriceIntelligence: builder.query<
      PriceIntelligenceDetail,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["PRICE_INTELLIGENCE"],
    }),
  }),
});

export default PriceIntelligenceAPI;
