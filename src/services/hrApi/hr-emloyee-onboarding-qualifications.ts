import { EmployeeOnboardingQualifications } from "definations/hr-types/employee-onboarding";
import baseAPI from "..";

const BASE_URL = "hr/employees/qualifications/";

const EmployeeOnboardingQualificationsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeOnboardingQualificationssQualifications: builder.query<
      EmployeeOnboardingQualifications[],
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

    getEmployeeOnboardingQualifications: builder.query<EmployeeOnboardingQualifications, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    createEmployeeOnboardingQualifications: builder.mutation<
      EmployeeOnboardingQualifications,
      Partial<EmployeeOnboardingQualifications>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }), 
    updateEmployeeOnboardingQualifications: builder.mutation<
      EmployeeOnboardingQualifications,
      { id: string; body: Partial<EmployeeOnboardingQualifications> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEE_ONBOARDING"],
    }),

    patchEmployeeOnboardingQualifications: builder.mutation<
      EmployeeOnboardingQualifications,
      { id: string; body: Partial<EmployeeOnboardingQualifications> }
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
  useCreateEmployeeOnboardingQualificationsMutation,
  useGetEmployeeOnboardingQualificationsQuery,
  useGetEmployeeOnboardingQualificationssQualificationsQuery,
  usePatchEmployeeOnboardingQualificationsMutation,
  useUpdateEmployeeOnboardingQualificationsMutation
} = EmployeeOnboardingQualificationsAPI;
