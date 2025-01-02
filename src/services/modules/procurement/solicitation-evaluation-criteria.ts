import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TSolicitationEvaluationCriteriaData,
    TSolicitationEvaluationCriteriaFormValues,
} from "definations/modules/procurement/solicitation-evaluation-criteria";
import baseAPI from "services/index";

const SolicitationEvaluationCriteriaAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllSolicitationEvaluationCriteria: builder.query<
            TPaginatedResponse<TSolicitationEvaluationCriteriaData>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/evaluation-criteria/",
                params,
            }),
            providesTags: ["Solicitation"],
        }),

        addSolicitationEvaluationCriteria: builder.mutation<
            TResponse<TSolicitationEvaluationCriteriaData>,
            TSolicitationEvaluationCriteriaFormValues
        >({
            query: (body) => ({
                url: "/procurements/evaluation-criteria/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Solicitation"],
        }),

        updateSolicitationEvaluationCriteria: builder.mutation<
            TResponse<TSolicitationEvaluationCriteriaData>,
            { id: string; body: TSolicitationEvaluationCriteriaFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/procurements/evaluation-criteria/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Solicitation"],
        }),

        deleteSolicitationEvaluationCriteria: builder.mutation<
            TResponse<TSolicitationEvaluationCriteriaData>,
            string
        >({
            query: (id) => ({
                url: `/procurements/evaluation-criteria/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Solicitation"],
        }),
    }),
});

export const {
    useGetAllSolicitationEvaluationCriteriaQuery,
    useAddSolicitationEvaluationCriteriaMutation,
    useUpdateSolicitationEvaluationCriteriaMutation,
    useDeleteSolicitationEvaluationCriteriaMutation,
} = SolicitationEvaluationCriteriaAPI;
