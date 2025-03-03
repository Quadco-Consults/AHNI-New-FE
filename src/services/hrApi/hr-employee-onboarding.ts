import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import baseAPI from "..";

const BASE_URL = "hr/employee-onboarding/";

const EmployeeOnboardingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardings: builder.query<
      EmployeeOnboarding[],
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

    getEmployeeOnboarding: builder.query<EmployeeOnboarding, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboarding: builder.mutation<
      EmployeeOnboarding,
      Partial<EmployeeOnboarding>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    updateEmployeeOnboarding: builder.mutation<
      EmployeeOnboarding,
      { id: string; body: Partial<EmployeeOnboarding> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboarding: builder.mutation<
      EmployeeOnboarding,
      { id: string; body: Partial<EmployeeOnboarding> }
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

export default EmployeeOnboardingAPI;
