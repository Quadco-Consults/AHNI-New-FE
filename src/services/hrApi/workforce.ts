import { TBaseCreateResponse, TBasePaginatedResponse } from "definations/auth";
import baseAPI from "..";
import {
  WorkforcePension,
  WorkforceQualificationResult,
  WorkforceResults,
} from "definations/hr-types/workforce";
import {
  WorkforceFormValues,
  WorkforcePensionFormValues,
  WorkforceQualificationFormValues,
} from "definations/hr-validator";

const BASE_URL = "/hr/hr-workforce/";

const WorkforceAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWorkforces: builder.query<
      TBasePaginatedResponse<WorkforceResults[]>,
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["WORKFORCE"],
    }),
    getWorkforceQualifications: builder.query<
      TBasePaginatedResponse<WorkforceQualificationResult[]>,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/qualifications/`,
        };
      },
      providesTags: ["WORKFORCE"],
    }),
    getWorkforce: builder.query<WorkforceResults, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["WORKFORCE"],
    }),
    getWorkforcePension: builder.query<
      WorkforcePension,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/pension-administrator/`,
        };
      },
      providesTags: ["WORKFORCE"],
    }),
    createWorkforcePension: builder.mutation<
      TBaseCreateResponse<WorkforcePension>,
      { path: { id: string }; body: WorkforcePensionFormValues }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/pension-administrator/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORKFORCE"],
    }),
    createWorkforceQualification: builder.mutation<
      TBaseCreateResponse<WorkforcePension>,
      { path: { id: string }; body: WorkforceQualificationFormValues }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/qualifications/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORKFORCE"],
    }),
    createWorkforce: builder.mutation<
      TBaseCreateResponse<WorkforceResults>,
      WorkforceFormValues
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORKFORCE"],
    }),
    updateWorkforce: builder.mutation<
      TBaseCreateResponse<WorkforceResults>,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["WORKFORCE"],
    }),
    updateWorkforceAdditionalInfo: builder.mutation<
      TBaseCreateResponse<WorkforceResults>,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/additional-info/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["WORKFORCE"],
    }),
  }),
});

export default WorkforceAPI;
