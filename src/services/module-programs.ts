import baseAPI from ".";
import {
  TBasePaginatedResponse,
  TRequest,
  TSupervisionCategoryResponseArray,
} from "definations/auth";
import {
  Facilities,
  TFacilities,
  TSupervisionCategory,
  SupervisionCategory,
  TRiskCategory,
  RiskCategory,
} from "definations/module-programs";

type TFacilityContact = {
  id: string;
  name: string;
  position: string;
  phone_number: string;
  email: string;
  facility: string;
};

export type Facility = {
  id: string;
  name: string;
  state: string;
  local_govt: string;
  address: string;
  facility_contacts: TFacilityContact[];
};

const projectsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    facilities: builder.query<Facility[], TRequest>({
      query: (params) => ({
        url: "/programs/facilities/",
        params,
      }),
      providesTags: ["Facilities"],
    }),
    addFacilities: builder.mutation<Facilities, TFacilities>({
      query: (body) => ({
        url: "/programs/facilities/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Facilities"],
    }),
    updateFacilities: builder.mutation<
      Facilities,
      { id: string; body: TFacilities }
    >({
      query: ({ id, body }) => ({
        url: `/programs/facilities/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Facilities"],
    }),
    deleteFacilities: builder.mutation<Facilities, string>({
      query: (id) => ({
        url: `/programs/facilities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Facilities"],
    }),
    states: builder.query({
      query: (params) => ({
        url: "/config/states/",
        params,
      }),
    }),

    supervisionCategory: builder.query<
      TSupervisionCategoryResponseArray,
      TRequest
    >({
      query: (params) => ({
        url: "/programs/evaluation-categories/",
        params,
      }),
      providesTags: ["SupervisionCategory"],
    }),
    addSupervisionCategory: builder.mutation<
      SupervisionCategory,
      TSupervisionCategory
    >({
      query: (body) => ({
        url: "/programs/evaluation-categories/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SupervisionCategory"],
    }),
    updateSupervisionCategory: builder.mutation<
      TSupervisionCategoryResponseArray,
      { id: string; body: TSupervisionCategory }
    >({
      query: ({ id, body }) => ({
        url: `/programs/evaluation-categories/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["SupervisionCategory"],
    }),
    deleteSupervisionCategory: builder.mutation<
      TSupervisionCategoryResponseArray,
      string
    >({
      query: (id) => ({
        url: `/programs/evaluation-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupervisionCategory"],
    }),

    riskCategory: builder.query<
      TBasePaginatedResponse<RiskCategory[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/programs/risk-categories/",
        params,
      }),
      providesTags: ["RiskCategory"],
    }),
    addRiskCategory: builder.mutation<RiskCategory, TRiskCategory>({
      query: (body) => ({
        url: "/programs/risk-categories/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["RiskCategory"],
    }),
    updateRiskCategory: builder.mutation<
      RiskCategory,
      { id: string; body: TRiskCategory }
    >({
      query: ({ id, body }) => ({
        url: `/programs/risk-categories/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["RiskCategory"],
    }),
    deleteRiskCategory: builder.mutation<RiskCategory, string>({
      query: (id) => ({
        url: `/programs/risk-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RiskCategory"],
    }),
  }),
});

export const {
  useFacilitiesQuery,
  useAddFacilitiesMutation,
  useStatesQuery,
  useSupervisionCategoryQuery,
  useAddSupervisionCategoryMutation,
  useRiskCategoryQuery,
  useAddRiskCategoryMutation,
  useDeleteRiskCategoryMutation,
  useUpdateRiskCategoryMutation,
  useDeleteSupervisionCategoryMutation,
  useUpdateSupervisionCategoryMutation,
  useDeleteFacilitiesMutation,
  useUpdateFacilitiesMutation,
} = projectsAPI;
