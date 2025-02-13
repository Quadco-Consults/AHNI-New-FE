import {
    IExpenditurePaginatedData,
    IExpenditureSingleData,
    TExpenditureFormData,
} from "definations/c&g/grants";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

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
            invalidatesTags: ["EXPENDITURE", "GRANT"],
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

        modifyExpenditure: builder.mutation<
            TPaginatedResponse<IExpenditurePaginatedData>,
            {
                grantId: string;
                expenditureId: string;
                body: TExpenditureFormData;
            }
        >({
            query: ({ grantId, expenditureId, body }) => ({
                method: "PUT",
                url: `/contract-grants/grants/${grantId}/expenditures/${expenditureId}/`,
                body,
            }),
            invalidatesTags: ["EXPENDITURE", "GRANT"],
        }),

        deleteExpenditure: builder.mutation<
            TResponse<IExpenditurePaginatedData>,
            { grantId: string; expenditureId: string }
        >({
            query: ({ grantId, expenditureId }) => ({
                method: "DELETE",
                url: `/contract-grants/grants/${grantId}/expenditures/${expenditureId}/`,
            }),
            invalidatesTags: ["EXPENDITURE", "GRANT"],
        }),
    }),
});

export const {
    useCreateExpenditureMutation,
    useGetAllExpendituresQuery,
    useModifyExpenditureMutation,
    useDeleteExpenditureMutation,
} = ExpenditureAPI;
