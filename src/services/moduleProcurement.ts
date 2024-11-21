import baseAPI from ".";
import { TBasePaginatedResponse, TRequest } from "definations/auth";
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
        lots: builder.query<TBasePaginatedResponse<Lots>, TRequest>({
            query: (params) => ({
                url: "/procurements/lots/",
                params,
            }),
            providesTags: ["Lots"],
        }),
        addLots: builder.mutation<Lots, TLots>({
            query: (body) => ({
                url: "/procurements/lots/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Lots"],
        }),
        updateLots: builder.mutation<Lots, { id: string; body: TLots }>({
            query: ({ id, body }) => ({
                url: `/procurements/lots/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Lots"],
        }),
        deleteLots: builder.mutation<Lots, string>({
            query: (id) => ({
                url: `/procurements/lots/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lots"],
        }),

        solicitation: builder.query<
            TBasePaginatedResponse<Solicitation>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/evaluation-criteria/",
                params,
            }),
            providesTags: ["Solicitation"],
        }),
        addSolicitation: builder.mutation<Solicitation, TSolicitation>({
            query: (body) => ({
                url: "/procurements/evaluation-criteria/",
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
                url: `/procurements/evaluation-criteria/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Solicitation"],
        }),

        deleteSolicitation: builder.mutation<Solicitation, string>({
            query: (id) => ({
                url: `/procurements/evaluation-criteria/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Solicitation"],
        }),

        prequalificationCategory: builder.query<
            TBasePaginatedResponse<PrequalificationCategory>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/prequalification_category/",
                params,
            }),
            providesTags: ["PrequalificationCategory"],
        }),

        addPrequalificationCategory: builder.mutation<
            PrequalificationCategory,
            TPrequalificationCategory
        >({
            query: (body) => ({
                url: "/procurements/prequalification_category/",
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
                url: `/procurements/prequalification_category/${id}/`,
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
                url: `/procurements/prequalification_category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PrequalificationCategory"],
        }),

        prequalificationCriteria: builder.query<
            TBasePaginatedResponse<PrequalificationCriteria>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/prequalification_criteria/",
                params,
            }),
            providesTags: ["PrequalificationCriteria"],
        }),
        addPrequalificationCriteria: builder.mutation<
            PrequalificationCriteria,
            TPrequalificationCriteria
        >({
            query: (body) => ({
                url: "/procurements/prequalification_criteria/",
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
                url: `/procurements/prequalification_criteria/${id}/`,
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
                url: `/procurements/prequalification_criteria/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PrequalificationCriteria"],
        }),

        questionairs: builder.query<
            TBasePaginatedResponse<Questionairs>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/questionaire/",
                params,
            }),
            providesTags: ["Questionairs"],
        }),
        addQuestionairs: builder.mutation<Questionairs, TQuestionairs>({
            query: (body) => ({
                url: "/procurements/questionaire/",
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
                url: `/procurements/questionaire/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Questionairs"],
        }),
        deleteQuestionairs: builder.mutation<Questionairs, string>({
            query: (id) => ({
                url: `/procurements/questionaire/${id}`,
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
