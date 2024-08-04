import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const BASE_URL = "/contract-grants/project-expenditures/";
const TAG = "EXPENDITURES";

export const expenditureAPIs = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addExpenditure: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}`,
        body,
        method: "POST",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),
    getExpenditures: builder.query({
      query: (config) => ({
        url: `${BASE_URL}`,
        ...config,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
  }),
});
