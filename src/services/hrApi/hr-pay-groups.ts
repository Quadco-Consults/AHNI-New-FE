import { PayGroup } from "definations/hr-types/pay-group";
import baseAPI from "..";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/hr/employee-benefits/pay-groups/";

const PayGroupAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all Pay Groups
    getPayGroups: builder.query<TPaginatedResponse<PayGroup>, void>({
      query: () => ({
        url: BASE_URL,
        method: "GET",
      }),
      providesTags: ["PAY_GROUPS"],
    }),

    // POST (create) a Pay Group
    createPayGroup: builder.mutation<PayGroup, Partial<PayGroup>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PAY_GROUPS"],
    }),
  }),
});

export const { useGetPayGroupsQuery, useCreatePayGroupMutation } = PayGroupAPI;
