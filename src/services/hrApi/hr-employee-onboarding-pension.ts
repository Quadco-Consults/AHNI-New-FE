 
import baseAPI from "..";
import { WorkforcePensionFormValues } from "definations/hr-validator";

const BASE_URL = "hr/employees/pension-funds/";

const EmployeeOnboardingPensionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingPension: builder.query<
    WorkforcePensionFormValues[],
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

    getEmployeeOnboardingPensionQuery: builder.query<WorkforcePensionFormValues, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboardingPension: builder.mutation<
    WorkforcePensionFormValues,
      Partial<WorkforcePensionFormValues>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }), 
    updateEmployeeOnboardingPension: builder.mutation<
    WorkforcePensionFormValues,
      { id: string; body: Partial<WorkforcePensionFormValues> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboardingPension: builder.mutation<
    WorkforcePensionFormValues,
      { id: string; body: Partial<WorkforcePensionFormValues> }
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
  useCreateEmployeeOnboardingPensionMutation,
  useGetEmployeeOnboardingPensionQuery,
  useGetEmployeeOnboardingPensionQueryQuery,
  usePatchEmployeeOnboardingPensionMutation,
  useUpdateEmployeeOnboardingPensionMutation
} = EmployeeOnboardingPensionAPI;
