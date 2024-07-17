/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { StakeholderManagementSchema } from "definations/program-validator";
import {
  StakeholderManagementData,
  StakeholderManagementResponse,
  StakeholderManagementResultsData,
} from "definations/program-types/stakeholder-management";

const BASE_URL = "/programs/stakeholder-mgt/";

const StakeholderManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStakeholderManagements: builder.query<StakeholderManagementData, {}>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("STAKEHOLDER_MANAGEMENT", data) : [],
    }),

    getStakeholderManagement: builder.query<
      StakeholderManagementResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("STAKEHOLDER_MANAGEMENT", data) : [],
    }),

    createStakeholderManagement: builder.mutation<
      StakeholderManagementResponse,
      z.infer<typeof StakeholderManagementSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("STAKEHOLDER_MANAGEMENT") : [],
    }),

    updateStakeholderManagement: builder.mutation<
      StakeholderManagementResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("STAKEHOLDER_MANAGEMENT", { ids: [path.id] })
          : [],
    }),

    modifyStakeholderManagement: builder.mutation<
      StakeholderManagementResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("STAKEHOLDER_MANAGEMENT", { ids: [path.id] })
          : [],
    }),

    deleteStakeholderManagement: builder.mutation<
      void,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("STAKEHOLDER_MANAGEMENT", { ids: [path.id] })
          : [],
    }),
  }),
});

export default StakeholderManagementAPI;
