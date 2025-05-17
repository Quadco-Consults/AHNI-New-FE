import baseAPI from "..";
import { HrEmergencyResults } from "definations/hr-types/employee-onboarding";

const BASE_URL = "/hr/employees/emergency-contacts/";

const HrEmergencyAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHrEmergencyList: builder.query<
      { data: { results: HrEmergencyResults[] } },
      { employee: string }
    >({
      query: ({ employee }) => {
        return {
          url: `${BASE_URL}`,
          params: {
            ...(employee && { employee }),
          },
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    getHrEmergency: builder.query<HrEmergencyResults, { id: string }>({
      query: ({ id }) => {
        return {
          url: `${BASE_URL}${id}/`,
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    createHrEmergency: builder.mutation<HrEmergencyResults, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HR_BENEFICIARIES"],
    }),

    updateHrEmergency: builder.mutation<
      HrEmergencyResults,
      { id: string; body: HrEmergencyResults }
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
  useCreateHrEmergencyMutation,
  useGetHrEmergencyListQuery,
  useGetHrEmergencyQuery,
  useUpdateHrEmergencyMutation,
} = HrEmergencyAPI;
