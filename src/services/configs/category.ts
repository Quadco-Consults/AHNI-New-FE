/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { provideTags } from "utils/QueryUtils";
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
      providesTags: ["Categories"],
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
      invalidatesTags: ["Categories"],
    }),

    getCategory: builder.query<CategoryResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["Categories"],
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
      invalidatesTags: ["Categories"],
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
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Categories"],
    }),
  }),
});

export default CategoryAPI;
