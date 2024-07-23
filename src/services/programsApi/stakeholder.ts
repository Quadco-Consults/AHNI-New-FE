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

const BASE_URL = "/programs/stakeholders/";

const StakeholderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStakeholders: builder.query<StakeholderManagementData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("STAKEHOLDER", data) : [],
    }),

    getStakeholder: builder.query<
      StakeholderManagementResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("STAKEHOLDER", data) : [],
    }),

    createStakeholder: builder.mutation<
      StakeholderManagementResponse,
      z.infer<typeof StakeholderManagementSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("STAKEHOLDER") : [],
    }),

    updateStakeholder: builder.mutation<
      StakeholderManagementResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("STAKEHOLDER", { ids: [path.id] }) : [],
    }),

    modifyStakeholder: builder.mutation<
      StakeholderManagementResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("STAKEHOLDER", { ids: [path.id] }) : [],
    }),

    deleteStakeholder: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("STAKEHOLDER", { ids: [path.id] }) : [],
    }),
  }),
});

export default StakeholderAPI;
