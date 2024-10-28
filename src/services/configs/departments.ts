/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  DepartmentsData,
  DepartmentsResponse,
  DepartmentsResultsData,
} from "definations/configs/departments";
import { DepartmentsSchema } from "definations/program-validator";

const BASE_URL = "/config/departments/";

const DepartmentsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentsData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("DEPARTMENT", data) : [],
    }),
    getDepartmentPaginate: builder.query<DepartmentsResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("DEPARTMENT", data) : [],
    }),

    createDepartment: builder.mutation<
      DepartmentsResponse,
      z.infer<typeof DepartmentsSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("DEPARTMENT") : [],
    }),

    getDepartment: builder.query<
      DepartmentsResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("DEPARTMENT", data) : [],
    }),

    updateDepartment: builder.mutation<
      DepartmentsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("DEPARTMENT", { ids: [path.id] }) : [],
    }),

    modifyDepartment: builder.mutation<
      DepartmentsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("DEPARTMENT", { ids: [path.id] }) : [],
    }),

    deleteDepartment: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("DEPARTMENT", { ids: [path.id] }) : [],
    }),
  }),
});

export default DepartmentsAPI;
