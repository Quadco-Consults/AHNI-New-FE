import { Compensation } from "definations/hr-types/compensation";
import baseAPI from "..";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/hr/employee-benefits/compensation-spread/";

const CompensationSpreadAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all compensations
    getCompensationsSpread: builder.query<
      TPaginatedResponse<Compensation>,
      void
    >({
      query: () => ({ url: BASE_URL }),
      providesTags: ["COMPENSATIONS_SPREAD"],
    }),

    // POST (create) compensation
    createCompensationSpread: builder.mutation<
      Compensation,
      Partial<Compensation>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["COMPENSATIONS_SPREAD"],
    }),
  }),
});

export const {
  useGetCompensationsSpreadQuery,
  useCreateCompensationSpreadMutation,
} = CompensationSpreadAPI;
