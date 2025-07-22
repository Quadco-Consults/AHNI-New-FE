import { PayGroup } from "definations/hr-types/pay-group";
import baseAPI from "..";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/hr/employee-benefits/payroll/";

const PayRollAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all Pay Groups
    getPayRolls: builder.query<TPaginatedResponse<PayGroup>, void>({
      query: () => ({
        url: BASE_URL,
        method: "GET",
      }),
      providesTags: ["PAY_ROLL"],
    }),

    // POST (create) a Pay Group
    createPayRoll: builder.mutation<PayGroup, Partial<PayGroup>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PAY_ROLL"],
    }),
  }),
});

export const { useGetPayRollsQuery, useCreatePayRollMutation } = PayRollAPI;
