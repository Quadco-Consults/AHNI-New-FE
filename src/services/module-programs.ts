import baseAPI from ".";
import {
  TBasePaginatedRespose,
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

    riskCategory: builder.query<
      TBasePaginatedRespose<RiskCategory[]>,
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
} = projectsAPI;
