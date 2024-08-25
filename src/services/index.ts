import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "src/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://apierp.ahnigeria.org/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    const { auth } = getState() as RootState;

    if (auth.access_token) {
      headers.set("Authorization", `Bearer ${auth.access_token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 404) {
    return result.error;
  }
  return result;
};

const baseAPI = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  //  cache , The default time is seconds , Default duration 60 second

  tagTypes: [
    "Users",
    "Permission",
    "FundingSource",
    "Beneficiaries",
    "DocumentTypes",
    "Partners",
    "Facilities",
    "SupervisionCategory",
    "RiskCategory",
    "Stock",
    "FUND_REQUEST",
    "PURCHASE_REQUEST",
    "ITEMS",
    "PURCHASE_ORDER",
    "SOLICITATION",
    "SOLICITATION_CRITERIA",
    "CBA",
    "PRICE_INTELLIGENCE",
    "Agreement",
    "Facility",
    "FuelRecord",
    "VehicleRequest",
    "PROCUREMENT_PLAN",
    "PROCUREMENT_TRACKER",
    "PAYMENT",
    "AM",
  ],
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: true,
});

export default baseAPI;
