import { EmployeeOnboardingAddSignatory } from "definations/hr-types/employee-onboarding";
import baseAPI from "..";

const BASE_URL = "hr/employees/beneficiaries/signatories/";

const EmployeeOnboardingAddSignatoryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingAddSignatory: builder.query<
    EmployeeOnboardingAddSignatory[],
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

    getEmployeeOnboardingAddSignatoryQuery: builder.query<EmployeeOnboardingAddSignatory, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboardingAddSignatory: builder.mutation<
    EmployeeOnboardingAddSignatory,
      Partial<EmployeeOnboardingAddSignatory>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }), 
    updateEmployeeOnboardingAddSignatory: builder.mutation<
    EmployeeOnboardingAddSignatory,
      { id: string; body: Partial<EmployeeOnboardingAddSignatory> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboardingAddSignatory: builder.mutation<
    EmployeeOnboardingAddSignatory,
      { id: string; body: Partial<EmployeeOnboardingAddSignatory> }
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
  useCreateEmployeeOnboardingAddSignatoryMutation,
  useGetEmployeeOnboardingAddSignatoryQuery,
  useGetEmployeeOnboardingAddSignatoryQueryQuery,
  usePatchEmployeeOnboardingAddSignatoryMutation,
  useUpdateEmployeeOnboardingAddSignatoryMutation
} = EmployeeOnboardingAddSignatoryAPI;
