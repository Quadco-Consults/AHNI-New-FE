import { Compensation } from "definations/hr-types/compensation";
import baseAPI from "..";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/hr/employee-benefits/compensations/";

const CompensationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all compensations
    getCompensations: builder.query<TPaginatedResponse<Compensation>, void>({
      query: () => ({ url: BASE_URL }),
      providesTags: ["COMPENSATIONS"],
    }),

    // POST (create) compensation
    createCompensation: builder.mutation<Compensation, Partial<Compensation>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["COMPENSATIONS"],
    }),

    deleteCompensation: builder.mutation<
      TPaginatedResponse<Compensation>,
      string
    >({
      query: (id) => ({
        method: "DELETE",
        url: `${BASE_URL}${id}`,
      }),
      invalidatesTags: ["COMPENSATIONS"],
    }),
  }),
});

export const {
  useGetCompensationsQuery,
  useCreateCompensationMutation,
  useDeleteCompensationMutation,
} = CompensationAPI;
