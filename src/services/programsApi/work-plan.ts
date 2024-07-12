/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  WorkPlanData,
  WorkPlanDetails,
  WorkPlanListData,
  WorkPlanResponse,
  WorkPlanResultsData,
} from "definations/program-types/program-workplan";

const BASE_URL = "/programs/workplans/";

const WorkPlanAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWorkPlans: builder.query<WorkPlanData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("WORK_PLANS", data) : [],
    }),
    getWorkPlansDetails: builder.query<WorkPlanDetails, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}detail/`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("WORK_PLANS", data) : [],
    }),
    getWorkPlansList: builder.query<WorkPlanListData, void>({
      query: () => {
        return {
          url: `${BASE_URL}list/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("WORK_PLANS", data) : [],
    }),

    createWorkPlan: builder.mutation<WorkPlanResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("WORK_PLANS") : [],
    }),

    createWorkPlanDocument: builder.mutation<any, any>({
      query: (body) => ({
        url: `${BASE_URL}upload/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("WORK_PLANS") : [],
    }),

    getWorkPlan: builder.query<WorkPlanResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("WORK_PLANS", data) : [],
    }),

    modifyWorkPlan: builder.mutation<
      WorkPlanResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("WORK_PLANS", { ids: [path.id] }) : [],
    }),

    deleteWorkPlan: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("WORK_PLANS", { ids: [path.id] }) : [],
    }),
  }),
});

export default WorkPlanAPi;
