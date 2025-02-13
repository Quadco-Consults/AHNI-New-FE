import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TMarketPriceData,
  TMarketPriceFormValues,
} from "definations/modules/config/market-price";
import baseAPI from "services/index";

const BASE_URL = "/procurements/market-item/";

const MarketPriceAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllMarketPrices: builder.query<
      TPaginatedResponse<TMarketPriceData>,
      TRequest
    >({
      query: (params) => ({
        url: BASE_URL,
        params,
      }),
      providesTags: ["MARKETPRICE"],
    }),

    addMarketPrice: builder.mutation<
      TResponse<TMarketPriceData>,
      TMarketPriceFormValues
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["MARKETPRICE"],
    }),

    updateMarketPrice: builder.mutation<
      TResponse<TMarketPriceData>,
      { id: string; body: TMarketPriceFormValues }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["MARKETPRICE"],
    }),

    deleteMarketPrice: builder.mutation<TResponse<TMarketPriceData>, string>({
      query: (id) => ({
        url: `${BASE_URL}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MARKETPRICE"],
    }),
  }),
});

export const {
  useGetAllMarketPricesQuery,
  useAddMarketPriceMutation,
  useUpdateMarketPriceMutation,
  useDeleteMarketPriceMutation,
} = MarketPriceAPI;
