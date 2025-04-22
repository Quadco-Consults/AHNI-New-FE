 
import baseAPI from "..";
import { WorkforceBankAccountFormValues } from "definations/hr-validator";

const BASE_URL = "hr/employees/bank-accounts/";

const EmployeeOnboardingBankAcctAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingBankAcct: builder.query<
    WorkforceBankAccountFormValues[],
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

    getEmployeeOnboardingBankAcctQuery: builder.query<WorkforceBankAccountFormValues, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboardingBankAcct: builder.mutation<
    WorkforceBankAccountFormValues,
      Partial<WorkforceBankAccountFormValues>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }), 
    updateEmployeeOnboardingBankAcct: builder.mutation<
    WorkforceBankAccountFormValues,
      { id: string; body: Partial<WorkforceBankAccountFormValues> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboardingBankAcct: builder.mutation<
    WorkforceBankAccountFormValues,
      { id: string; body: Partial<WorkforceBankAccountFormValues> }
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
  useCreateEmployeeOnboardingBankAcctMutation,
  useGetEmployeeOnboardingBankAcctQuery,
  useGetEmployeeOnboardingBankAcctQueryQuery,
  usePatchEmployeeOnboardingBankAcctMutation,
  useUpdateEmployeeOnboardingBankAcctMutation
} = EmployeeOnboardingBankAcctAPI;
