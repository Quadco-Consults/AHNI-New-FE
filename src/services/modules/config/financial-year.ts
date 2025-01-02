import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TFinancialYearData,
    TFinancialYearFormValues,
} from "definations/modules/config/financial-year";
import baseAPI from "services/index";

const FinancialYearAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllFinancialYears: builder.query<
            TPaginatedResponse<TFinancialYearData>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/financial-year/",
                params,
            }),
            providesTags: ["FinancialYear"],
        }),

        addFinancialYear: builder.mutation<
            TResponse<TFinancialYearData>,
            TFinancialYearFormValues
        >({
            query: (body) => ({
                url: "/config/financial-year/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["FinancialYear"],
        }),

        getSingleFinancialYear: builder.query<
            TResponse<TFinancialYearData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/config/financial-year/${id}/`,
            }),
        }),

        updateFinancialYear: builder.mutation<
            TResponse<TFinancialYearData>,
            { id: string; body: TFinancialYearFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/config/financial-year/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["FinancialYear"],
        }),

        deleteFinancialYear: builder.mutation<
            TResponse<TFinancialYearData>,
            string
        >({
            query: (id) => ({
                url: `/config/financial-year/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FinancialYear"],
        }),
    }),
});

export const {
    useGetAllFinancialYearsQuery,
    useGetSingleFinancialYearQuery,
    useAddFinancialYearMutation,
    useUpdateFinancialYearMutation,
    useDeleteFinancialYearMutation,
} = FinancialYearAPI;
