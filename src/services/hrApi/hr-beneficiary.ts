import baseAPI from "..";
import { HrBeneficiaryResults } from "definations/hr-types/hr-beneficiary";

const BASE_URL = "/hr/employees/beneficiaries/";

const HrBeneficiaryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHrBeneficiaries: builder.query<
      { data: { results: HrBeneficiaryResults[] } },
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    getHrBeneficiaryList: builder.query<HrBeneficiaryResults[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    getHrBeneficiary: builder.query<HrBeneficiaryResults, { id: string }>({
      query: ({ id }) => {
        return {
          url: `${BASE_URL}${id}/`,
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    createHrBeneficiary: builder.mutation<HrBeneficiaryResults, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HR_BENEFICIARIES"],
    }),

    updateHrBeneficiary: builder.mutation<
      HrBeneficiaryResults,
      { id: string; body: HrBeneficiaryResults }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["HR_BENEFICIARIES"],
    }),
  }),
});

export const {
  useCreateHrBeneficiaryMutation,
  useGetHrBeneficiariesQuery,
  useGetHrBeneficiaryListQuery,
  useGetHrBeneficiaryQuery,
  useUpdateHrBeneficiaryMutation,
} = HrBeneficiaryAPI;
