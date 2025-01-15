import {
    ITravelExpensePaginatedData,
    ITravelExpenseSingleData,
    TTravelExpenseFormData,
} from "definations/admin/travel-expense";
import baseAPI from "../";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/reports/travel-expenses/`;

const TravelExpenseAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createTravelExpense: builder.mutation<
            TResponse<ITravelExpenseSingleData>,
            TTravelExpenseFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["TRAVEL_EXPENSE"],
        }),

        getAllTravelExpenses: builder.query<
            TPaginatedResponse<ITravelExpensePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["TRAVEL_EXPENSE"],
        }),

        getSingleTravelExpense: builder.query<
            TResponse<ITravelExpenseSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        modifyTravelExpense: builder.mutation<
            TResponse<ITravelExpenseSingleData>,
            { id: string; body: TTravelExpenseFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["TRAVEL_EXPENSE"],
        }),

        deleteTravelExpense: builder.mutation<
            TResponse<ITravelExpenseSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["TRAVEL_EXPENSE"],
        }),
    }),
});

export const {
    useCreateTravelExpenseMutation,
    useGetAllTravelExpensesQuery,
    useGetSingleTravelExpenseQuery,
    useModifyTravelExpenseMutation,
    useDeleteTravelExpenseMutation,
} = TravelExpenseAPI;
