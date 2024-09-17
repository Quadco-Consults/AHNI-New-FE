import baseAPI from ".";
import { TBasePaginatedRespose, TRequest } from "definations/auth";
import {
  TLots,
  Lots,
  TSolicitation,
  Solicitation,
  TPrequalificationCategory,
  PrequalificationCategory,
  TPrequalificationCriteria,
  PrequalificationCriteria,
  TQuestionairs,
  Questionairs,
} from "definations/module-procurement";

const projectsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    lots: builder.query<TBasePaginatedRespose<Lots[]>, TRequest>({
      query: (params) => ({
        url: "/procurement/lots/",
        params,
      }),
      providesTags: ["Lots"],
    }),
    addLots: builder.mutation<Lots, TLots>({
      query: (body) => ({
        url: "/procurement/lots/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Lots"],
    }),
    updateLots: builder.mutation<Lots, { id: string; body: TLots }>({
      query: ({ id, body }) => ({
        url: `/procurement/lots/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Lots"],
    }),
    deleteLots: builder.mutation<Lots, string>({
      query: (id) => ({
        url: `/procurement/lots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lots"],
    }),

    solicitation: builder.query<
      TBasePaginatedRespose<Solicitation[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/procurement/solicitation-evaluation-criteria/",
        params,
      }),
      providesTags: ["Solicitation"],
    }),
    addSolicitation: builder.mutation<Solicitation, TSolicitation>({
      query: (body) => ({
        url: "/procurement/solicitation-evaluation-criteria/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Solicitation"],
    }),
    updateSolicitation: builder.mutation<
      Solicitation,
      { id: string; body: TSolicitation }
    >({
      query: ({ id, body }) => ({
        url: `/procurement/solicitation-evaluation-criteria/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Solicitation"],
    }),
    deleteSolicitation: builder.mutation<Solicitation, string>({
      query: (id) => ({
        url: `/procurement/solicitation-evaluation-criteria/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Solicitation"],
    }),

    prequalificationCategory: builder.query<
      TBasePaginatedRespose<PrequalificationCategory[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/procurement/pre-qualification-categories/",
        params,
      }),
      providesTags: ["PrequalificationCategory"],
    }),
    addPrequalificationCategory: builder.mutation<
      PrequalificationCategory,
      TPrequalificationCategory
    >({
      query: (body) => ({
        url: "/procurement/pre-qualification-categories/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["PrequalificationCategory"],
    }),
    updatePrequalificationCategory: builder.mutation<
      PrequalificationCategory,
      { id: string; body: TPrequalificationCategory }
    >({
      query: ({ id, body }) => ({
        url: `/procurement/pre-qualification-categories/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["PrequalificationCategory"],
    }),
    deletePrequalificationCategory: builder.mutation<
      PrequalificationCategory,
      string
    >({
      query: (id) => ({
        url: `/procurement/pre-qualification-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrequalificationCategory"],
    }),

    prequalificationCriteria: builder.query<
      TBasePaginatedRespose<PrequalificationCriteria[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/procurement/pre-qualification-criteria/",
        params,
      }),
      providesTags: ["PrequalificationCriteria"],
    }),
    addPrequalificationCriteria: builder.mutation<
      PrequalificationCriteria,
      TPrequalificationCriteria
    >({
      query: (body) => ({
        url: "/procurement/pre-qualification-criteria/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["PrequalificationCriteria"],
    }),
    updatePrequalificationCriteria: builder.mutation<
      PrequalificationCriteria,
      { id: string; body: TPrequalificationCriteria }
    >({
      query: ({ id, body }) => ({
        url: `/procurement/pre-qualification-criteria/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["PrequalificationCriteria"],
    }),
    deletePrequalificationCriteria: builder.mutation<
      PrequalificationCriteria,
      string
    >({
      query: (id) => ({
        url: `/procurement/pre-qualification-criteria/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrequalificationCategory"],
    }),

    questionairs: builder.query<
      TBasePaginatedRespose<Questionairs[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/procurement/questionairs/",
        params,
      }),
      providesTags: ["Questionairs"],
    }),
    addQuestionairs: builder.mutation<Questionairs, TQuestionairs>({
      query: (body) => ({
        url: "/procurement/questionairs/",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Questionairs"],
    }),
    updateQuestionairs: builder.mutation<
      Questionairs,
      { id: string; body: TQuestionairs }
    >({
      query: ({ id, body }) => ({
        url: `/procurement/questionairs/${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Questionairs"],
    }),
    deleteQuestionairs: builder.mutation<Questionairs, string>({
      query: (id) => ({
        url: `/procurement/questionairs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questionairs"],
    }),
  }),
});

export const {
  useLotsQuery,
  useAddLotsMutation,
  useUpdateLotsMutation,
  useDeleteLotsMutation,
  useSolicitationQuery,
  useAddSolicitationMutation,
  useUpdateSolicitationMutation,
  useDeleteSolicitationMutation,
  usePrequalificationCategoryQuery,
  useAddPrequalificationCategoryMutation,
  useUpdatePrequalificationCategoryMutation,
  useDeletePrequalificationCategoryMutation,
  usePrequalificationCriteriaQuery,
  useAddPrequalificationCriteriaMutation,
  useUpdatePrequalificationCriteriaMutation,
  useDeletePrequalificationCriteriaMutation,
  useQuestionairsQuery,
  useAddQuestionairsMutation,
  useUpdateQuestionairsMutation,
  useDeleteQuestionairsMutation,
} = projectsAPI;
