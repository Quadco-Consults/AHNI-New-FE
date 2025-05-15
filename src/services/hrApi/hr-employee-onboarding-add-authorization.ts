import baseAPI from "..";
import { HrSystemAuthorization } from "definations/hr-types/employee-onboarding";

const BASE_URL = "/hr/employees/system-authorization/";

const SystemAuthorizationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSystemAuthorizationList: builder.query<
      { data: { results: HrSystemAuthorization[] } },
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

    getSystemAuthorization: builder.query<
      HrSystemAuthorization,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `${BASE_URL}${id}/`,
        };
      },
      providesTags: ["HR_BENEFICIARIES"],
    }),

    createSystemAuthorization: builder.mutation<HrSystemAuthorization, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HR_BENEFICIARIES"],
    }),

    updateSystemAuthorization: builder.mutation<
      HrSystemAuthorization,
      { id: string; body: HrSystemAuthorization }
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
  useCreateSystemAuthorizationMutation,
  useGetSystemAuthorizationListQuery,
  useGetSystemAuthorizationQuery,
  useUpdateSystemAuthorizationMutation,
} = SystemAuthorizationAPI;
