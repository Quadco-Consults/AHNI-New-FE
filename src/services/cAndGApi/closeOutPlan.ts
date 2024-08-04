import baseAPI from "..";
import { provideTags } from "utils/QueryUtils";

const BASE_URL = "/contract-grants/closeout-plans/";

export const closeoutPlanAPis = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCloseOutPlans: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL}project_closeout_plans/`,
        ...config,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("CLOSE-OUT-PLAN", data) : []),
    }),
    getCloseOutPlansDetails: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL}`,
        ...config,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("CLOSE-OUT-PLAN", data) : []),
    }),
    addCloseOutPlan: builder.mutation<any, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        body,
        method: "POST",
      }),
      invalidatesTags: (_, data, error) => (!error ? provideTags("CLOSE-OUT-PLAN", data) : []),
    }),
  }),
});
