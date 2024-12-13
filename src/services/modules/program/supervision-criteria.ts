import baseAPI from "services/index";

import { TPaginatedResponse, TRequest } from "definations/index";
import {
    TSupervisionCriteriaData,
    TSupervisionCriteriaFormValues,
} from "definations/modules/program/supervision-criteria";

const SupervisionCriteria = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupervisionCriteria: builder.query<
            TPaginatedResponse<TSupervisionCriteriaData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/supervision-evaluation-criteria/",
                params,
            }),
            providesTags: ["SupervisionCriteria"],
        }),

        addSupervisionCriteria: builder.mutation<
            TSupervisionCriteriaData,
            TSupervisionCriteriaFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/supervision-evaluation-criteria/",
                body,
            }),
            invalidatesTags: ["SupervisionCriteria"],
        }),

        updateSupervisionCriteria: builder.mutation<
            TSupervisionCriteriaData,
            { id: number; body: TSupervisionCriteriaFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/supervision-evaluation-criteria/${id}/`,
                body,
            }),
            invalidatesTags: ["SupervisionCriteria"],
        }),

        deleteSupervisionCriteria: builder.mutation<
            TSupervisionCriteriaData,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/supervision-evaluation-criteria/${id}/`,
            }),
            invalidatesTags: ["SupervisionCriteria"],
        }),
    }),
});

export const {
    useGetAllSupervisionCriteriaQuery,
    useAddSupervisionCriteriaMutation,
    useUpdateSupervisionCriteriaMutation,
    useDeleteSupervisionCriteriaMutation,
} = SupervisionCriteria;
