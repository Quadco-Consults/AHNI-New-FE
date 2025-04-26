import { GrievianceManagement } from "definations/hr-types/grieviance-management";
import baseAPI from "..";

const BASE_URL = "hr/grievances/complaints/";

const GrievianceManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGrievianceManagements: builder.query<
      GrievianceManagement[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    getGrievianceManagement: builder.query<
      GrievianceManagement,
      { id: string }
    >({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    createGrievianceManagement: builder.mutation<
      GrievianceManagement,
      Partial<GrievianceManagement>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    updateGrievianceManagement: builder.mutation<
      GrievianceManagement,
      { id: string; body: Partial<GrievianceManagement> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),
    deleteGrievianceManagement: builder.mutation<
      GrievianceManagement,
      { id: string; }
    >({
      query: ({ id,  }) => ({
        url: `${BASE_URL}${id}/`,
        method: "DELETE", 
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    patchGrievianceManagement: builder.mutation<
      GrievianceManagement,
      { id: string; body: Partial<GrievianceManagement> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),
  }),
});

export const {
  useCreateGrievianceManagementMutation,
  useGetGrievianceManagementQuery,
  useGetGrievianceManagementsQuery,
  useUpdateGrievianceManagementMutation,
  useDeleteGrievianceManagementMutation
} = GrievianceManagementAPI;
