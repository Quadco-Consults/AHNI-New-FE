import { TBasePaginatedRespose, TRequest } from "definations/auth";

import baseAPI from "..";

export type Facility = {
  name: any;
  id: string;
  created_at: string;
  updated_at: string;
  description_of_problem: string;
  approved_by: string;
  maintenance_type: string;
  recommendations: string;
  facility: {
    name: string;
    state: string;
    local_govt: string;
    address: string;
  };
  status: string;
  start_date: string;
  end_date: string;
};

type CreateFacilityPayload = {
  status?: string;
  description_of_problem: string;
  approved_by?: string;
  maintenance_type: string;
  recommendations?: string;
  facility: string;
};

export const agrrementsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query<TBasePaginatedRespose<Facility[]>, TRequest>({
      query: (params) => ({
        url: "/admins/facility-maintenance-requests/",
        params,
      }),
      providesTags: ["Facility"],
    }),
    getFacility: builder.query<Facility, string>({
      query: (id) => `/admins/facility-maintenance-requests/${id}/`,
      providesTags: ["Facility"],
    }),
    createFacility: builder.mutation<Facility, CreateFacilityPayload>({
      query: (payload) => ({
        url: "/admins/facility-maintenance-requests/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Facility"],
    }),
    updateFacility: builder.mutation<
      Facility,
      { id: string; payload: Partial<CreateFacilityPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/admins/facility-maintenance-requests/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Facility"],
    }),
    deleteFacility: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admins/facility-maintenance-requests/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Facility"],
    }),
  }),
});

export const {
  useCreateFacilityMutation,
  useDeleteFacilityMutation,
  useGetFacilitiesQuery,
  useGetFacilityQuery,
  useUpdateFacilityMutation,
} = agrrementsAPI;
