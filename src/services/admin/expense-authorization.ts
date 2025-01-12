import {
    IExpenseAuthorizationPaginatedData,
    IExpenseAuthorizationSingleData,
    TExpenseAuthorizationFormData,
} from "definations/admin/expense-authorization";
import baseAPI from "../";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/authorization/expenses/`;

const ExpenseAuthorizationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createExpenseAuthorization: builder.mutation<
            TResponse<IExpenseAuthorizationSingleData>,
            TExpenseAuthorizationFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["EXPENSE_AUTHORIZATION"],
        }),

        getAllExpenseAuthorizations: builder.query<
            TPaginatedResponse<IExpenseAuthorizationPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["EXPENSE_AUTHORIZATION"],
        }),

        getSingleExpenseAuthorization: builder.query<
            TResponse<IExpenseAuthorizationSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        modifyExpenseAuthorization: builder.mutation<
            TResponse<IExpenseAuthorizationSingleData>,
            { id: string; body: TExpenseAuthorizationFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["EXPENSE_AUTHORIZATION"],
        }),

        deleteExpenseAuthorization: builder.mutation<
            TResponse<IExpenseAuthorizationSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["EXPENSE_AUTHORIZATION"],
        }),
    }),
});

export const {
    useCreateExpenseAuthorizationMutation,
    useGetAllExpenseAuthorizationsQuery,
    useGetSingleExpenseAuthorizationQuery,
    useModifyExpenseAuthorizationMutation,
    useDeleteExpenseAuthorizationMutation,
} = ExpenseAuthorizationAPI;
