import { EmployeeOnboardingAddInfo } from "definations/hr-types/employee-onboarding";
import baseAPI from "..";

const BASE_URL = "hr/employees/emergency-contacts/";

const EmployeeOnboardingAddInfoAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingAddInfo: builder.query<
      EmployeeOnboardingAddInfo[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }),
          ...(search && { search }),
        },
      }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    getEmployeeOnboardingAddInfoQuery: builder.query<EmployeeOnboardingAddInfo, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboardingAddInfo: builder.mutation<
      EmployeeOnboardingAddInfo,
      Partial<EmployeeOnboardingAddInfo>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }), 
    updateEmployeeOnboardingAddInfo: builder.mutation<
      EmployeeOnboardingAddInfo,
      { id: string; body: Partial<EmployeeOnboardingAddInfo> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboardingAddInfo: builder.mutation<
      EmployeeOnboardingAddInfo,
      { id: string; body: Partial<EmployeeOnboardingAddInfo> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),
  }),
});

export const {
  useCreateEmployeeOnboardingAddInfoMutation,
  useGetEmployeeOnboardingAddInfoQuery,
  useGetEmployeeOnboardingAddInfoQueryQuery,
  usePatchEmployeeOnboardingAddInfoMutation,
  useUpdateEmployeeOnboardingAddInfoMutation
} = EmployeeOnboardingAddInfoAPI;
