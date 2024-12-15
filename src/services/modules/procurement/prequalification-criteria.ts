import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TPrequalificationCriteriaData,
    TPrequalificationCriteriaFormValues,
} from "definations/modules/procurement/prequalification-criteria";
import baseAPI from "services/index";

const PrequalificationCriteriaAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllPrequalificationCriteria: builder.query<
            TPaginatedResponse<TPrequalificationCriteriaData>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/prequalification_criteria/",
                params,
            }),
            providesTags: ["PrequalificationCriteria"],
        }),

        addPrequalificationCriteria: builder.mutation<
            TResponse<TPrequalificationCriteriaData>,
            TPrequalificationCriteriaFormValues
        >({
            query: (body) => ({
                url: "/procurements/prequalification_criteria/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["PrequalificationCriteria"],
        }),

        updatePrequalificationCriteria: builder.mutation<
            TResponse<TPrequalificationCriteriaData>,
            { id: string; body: TPrequalificationCriteriaFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/procurements/prequalification_criteria/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["PrequalificationCriteria"],
        }),

        deletePrequalificationCriteria: builder.mutation<
            TResponse<TPrequalificationCriteriaData>,
            string
        >({
            query: (id) => ({
                url: `/procurements/prequalification_criteria/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PrequalificationCriteria"],
        }),
    }),
});

export const {
    useGetAllPrequalificationCriteriaQuery,
    useAddPrequalificationCriteriaMutation,
    useUpdatePrequalificationCriteriaMutation,
    useDeletePrequalificationCriteriaMutation,
} = PrequalificationCriteriaAPI;
