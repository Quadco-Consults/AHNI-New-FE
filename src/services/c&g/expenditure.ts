import {
    IExpenditurePaginatedData,
    IExpenditureSingleData,
    TExpenditureFormData,
} from "definations/c&g/grants";
import baseAPI from "..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

//

const ExpenditureAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createExpenditure: builder.mutation<
            TResponse<IExpenditureSingleData>,
            { grantId: string; body: TExpenditureFormData }
        >({
            query: ({ grantId, body }) => ({
                method: "POST",
                url: `/contract-grants/grants/${grantId}/expenditures/`,
                body,
            }),
            invalidatesTags: ["EXPENDITURE"],
        }),

        getAllExpenditures: builder.query<
            TPaginatedResponse<IExpenditurePaginatedData>,
            TRequest & { grantId: string }
        >({
            query: ({ grantId, ...rest }) => ({
                method: "GET",
                url: `/contract-grants/grants/${grantId}/expenditures/`,
                params: { ...rest },
            }),
            providesTags: ["EXPENDITURE"],
        }),

        // deleteExpenditure: builder.mutation<
        //     TResponse<IExpenditurePaginatedData>,
        //     {}
        // >({
        //     query: (id) => ({
        //         method: "DELETE",
        //         url: `/contract-grants/grants/${grantId}/expenditures/`,
        //     }),
        //     invalidatesTags: ["EXPENDITURE"],
        // }),
    }),
});

export const { useCreateExpenditureMutation, useGetAllExpendituresQuery } =
    ExpenditureAPI;
