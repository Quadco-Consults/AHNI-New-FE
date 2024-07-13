/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  CategoryData,
  CategoryResponse,
  CategoryResultsData,
  CategorySchema,
} from "definations/configs/category";

const BASE_URL = "/config/category/";

const CategoryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("CATEGORY", data) : [],
    }),

    createCategory: builder.mutation<
      CategoryResponse,
      z.infer<typeof CategorySchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("CATEGORY") : [],
    }),

    getCategory: builder.query<CategoryResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("CATEGORY", data) : [],
    }),

    updateCategory: builder.mutation<
      CategoryResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("CATEGORY", { ids: [path.id] }) : [],
    }),

    modifyCategory: builder.mutation<
      CategoryResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("CATEGORY", { ids: [path.id] }) : [],
    }),

    deleteCategory: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("CATEGORY", { ids: [path.id] }) : [],
    }),
  }),
});

export default CategoryAPI;
