import { TBasePaginatedResponse, TRequest } from "definations/auth";
import baseAPI from ".";
import {
    BudgetLine,
    ChartAccount,
    CostCategory,
    CostInput,
    FCONumber,
    ProjectClass,
    TBudgetLine,
    TChartAccount,
    TCostCategory,
    TCostInput,
    TFCONumber,
    TProjectClass,
} from "definations/module-finance";

const ModuleFinanceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getCostCategory: builder.query<
            TBasePaginatedResponse<CostCategory>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/cost-categories/",
                params,
            }),
            providesTags: ["Cost_Category"],
        }),

        addCostCategory: builder.mutation<CostCategory, TCostCategory>({
            query: (body) => ({
                method: "POST",
                url: "/finance/cost-categories/",
                body,
            }),
            invalidatesTags: ["Cost_Category"],
        }),

        updateCostCategory: builder.mutation<
            CostCategory,
            { id: number; body: TCostCategory }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/cost-categories/${id}/`,
                body,
            }),
            invalidatesTags: ["Cost_Category"],
        }),

        deleteCostCategory: builder.mutation<CostCategory, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/cost-categories/${id}/`,
            }),
            invalidatesTags: ["Cost_Category"],
        }),

        getCostInput: builder.query<
            TBasePaginatedResponse<CostInput>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/cost-inputs/",
                params,
            }),
            providesTags: ["Cost_Input"],
        }),

        addCostInput: builder.mutation<CostInput, TCostInput>({
            query: (body) => ({
                method: "POST",
                url: "/finance/cost-inputs/",
                body,
            }),
            invalidatesTags: ["Cost_Input"],
        }),

        updateCostInput: builder.mutation<
            CostInput,
            { id: number; body: TCostInput }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/cost-inputs/${id}/`,
                body,
            }),
            invalidatesTags: ["Cost_Input"],
        }),

        deleteCostInput: builder.mutation<CostInput, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/cost-inputs/${id}/`,
            }),
            invalidatesTags: ["Cost_Input"],
        }),

        getBudgetLine: builder.query<
            TBasePaginatedResponse<BudgetLine>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/budget-lines/",
                params,
            }),
            providesTags: ["BudgetLine"],
        }),

        addBudgetLine: builder.mutation<BudgetLine, TBudgetLine>({
            query: (body) => ({
                method: "POST",
                url: "/finance/budget-lines/",
                body,
            }),
            invalidatesTags: ["BudgetLine"],
        }),

        updateBudgetLine: builder.mutation<
            BudgetLine,
            { id: number; body: TBudgetLine }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/budget-lines/${id}/`,
                body,
            }),
            invalidatesTags: ["BudgetLine"],
        }),

        deleteBudgetLine: builder.mutation<BudgetLine, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/budget-lines/${id}/`,
            }),
            invalidatesTags: ["BudgetLine"],
        }),

        getFCONumber: builder.query<
            TBasePaginatedResponse<FCONumber>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/fco-numbers/",
                params,
            }),
            providesTags: ["FCONumber"],
        }),

        addFCONumber: builder.mutation<FCONumber, TFCONumber>({
            query: (body) => ({
                method: "POST",
                url: "/finance/fco-numbers/",
                body,
            }),
            invalidatesTags: ["FCONumber"],
        }),

        updateFCONumber: builder.mutation<
            BudgetLine,
            { id: number; body: TBudgetLine }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/fco-numbers/${id}/`,
                body,
            }),
            invalidatesTags: ["FCONumber"],
        }),

        deleteFCONumber: builder.mutation<BudgetLine, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/fco-numbers/${id}/`,
            }),
            invalidatesTags: ["FCONumber"],
        }),

        getProjectClass: builder.query<
            TBasePaginatedResponse<ProjectClass>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/project-classes/",
                params,
            }),
            providesTags: ["ProjectClass"],
        }),

        addProjectClass: builder.mutation<ProjectClass, TProjectClass>({
            query: (body) => ({
                method: "POST",
                url: "/finance/project-classes/",
                body,
            }),
            invalidatesTags: ["ProjectClass"],
        }),

        updateProjectClass: builder.mutation<
            ProjectClass,
            { id: number; body: TProjectClass }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/project-classes/${id}/`,
                body,
            }),
            invalidatesTags: ["ProjectClass"],
        }),

        deleteProjectClass: builder.mutation<ProjectClass, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/project-classes/${id}/`,
            }),
            invalidatesTags: ["ProjectClass"],
        }),

        getChartAccount: builder.query<
            TBasePaginatedResponse<ChartAccount>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/charts-of-accounts/",
                params,
            }),
            providesTags: ["ChartAccount"],
        }),

        addChartAccount: builder.mutation<ChartAccount, TChartAccount>({
            query: (body) => ({
                method: "POST",
                url: "/finance/charts-of-accounts/",
                body,
            }),
            invalidatesTags: ["ChartAccount"],
        }),

        updateChartAccount: builder.mutation<
            ChartAccount,
            { id: number; body: TChartAccount }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/charts-of-accounts/${id}/`,
                body,
            }),
            invalidatesTags: ["ChartAccount"],
        }),

        deleteChartAccount: builder.mutation<ChartAccount, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/charts-of-accounts/${id}/`,
            }),
            invalidatesTags: ["ChartAccount"],
        }),
    }),
});

export const {
    useGetCostCategoryQuery,
    useAddCostCategoryMutation,
    useUpdateCostCategoryMutation,
    useDeleteCostCategoryMutation,
    useGetCostInputQuery,
    useAddCostInputMutation,
    useUpdateCostInputMutation,
    useDeleteCostInputMutation,
    useGetBudgetLineQuery,
    useAddBudgetLineMutation,
    useUpdateBudgetLineMutation,
    useDeleteBudgetLineMutation,
    useGetFCONumberQuery,
    useAddFCONumberMutation,
    useUpdateFCONumberMutation,
    useDeleteFCONumberMutation,
    useGetProjectClassQuery,
    useAddProjectClassMutation,
    useUpdateProjectClassMutation,
    useDeleteProjectClassMutation,
    useGetChartAccountQuery,
    useAddChartAccountMutation,
    useUpdateChartAccountMutation,
    useDeleteChartAccountMutation,
} = ModuleFinanceAPI;
