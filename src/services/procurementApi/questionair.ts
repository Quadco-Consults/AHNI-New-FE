/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  QuestionairData,
  QuestionairResponse,
} from "definations/procurement-types/questionairs";
import { z } from "zod";
import { QuestionairSchema } from "definations/procurement-validator";
import { TBasePaginatedResponse } from "definations/auth";

const BASE_URL = "/procurements/questionaire/";

const QuestionairAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionairs: builder.query<TBasePaginatedResponse<QuestionairData>, {}>(
      {
        query: (config) => {
          return {
            url: `${BASE_URL}`,
            ...config,
          };
        },
        providesTags: (data, error) =>
          !error ? provideTags("QUESTIONAIR", data) : [],
      }
    ),

    createQuestionair: builder.mutation<
      QuestionairResponse,
      z.infer<typeof QuestionairSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("QUESTIONAIR") : [],
    }),

    getQuestionair: builder.query<QuestionairData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("QUESTIONAIR", data) : [],
    }),

    updateQuestionair: builder.mutation<
      QuestionairResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("QUESTIONAIR", { ids: [path.id] }) : [],
    }),

    modifyQuestionair: builder.mutation<
      QuestionairResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("QUESTIONAIR", { ids: [path.id] }) : [],
    }),

    deleteQuestionair: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("QUESTIONAIR", { ids: [path.id] }) : [],
    }),
  }),
});

export default QuestionairAPI;
