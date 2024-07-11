/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  EvaluationCategoryData,
  EvaluationCategoryResponse,
  EvaluationCategorySchema,
} from "definations/program-types/evaluation-category";
import { EvaluationCriteria } from "definations/program-types/supportive-supervision";

const BASE_URL = "/programs/evaluation-categories/";

const EvaluationCategoriesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEvaluationCategories: builder.query<EvaluationCategoryData[], void>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("EVALUATION_CATEGORIES", data) : [],
    }),

    getEvaluationCategory: builder.query<
      EvaluationCategoryData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("EVALUATION_CATEGORIES", data) : [],
    }),

    getEvaluationCategoryCriteria: builder.query<any, { path: { id: string } }>(
      {
        query: ({ path }) => {
          return {
            url: `${BASE_URL}criteria/${path.id}/`,
          };
        },
        providesTags: (data, error) =>
          !error ? provideTags("EVALUATION_CATEGORIES", data) : [],
      }
    ),

    createEvaluationCategoryCriteria: builder.mutation<
      EvaluationCategoryResponse,
      z.infer<typeof EvaluationCategorySchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("EVALUATION_CATEGORIES") : [],
    }),

    updateEvaluationCategoryCriteria: builder.mutation<
      EvaluationCategoryResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("EVALUATION_CATEGORIES", { ids: [path.id] })
          : [],
    }),

    modifyEvaluationCategoryCriteria: builder.mutation<
      EvaluationCategoryResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("EVALUATION_CATEGORIES", { ids: [path.id] })
          : [],
    }),

    deleteEvaluationCategoryCriteria: builder.mutation<
      EvaluationCategoryResponse,
      { path: { id: string } }
    >({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error
          ? invalidateTags("EVALUATION_CATEGORIES", { ids: [path.id] })
          : [],
    }),
  }),
});

export default EvaluationCategoriesAPI;
