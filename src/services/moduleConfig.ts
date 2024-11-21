import baseAPI from ".";
import { TBasePaginatedResponse, TRequest } from "definations/auth";
import {
    TCategories,
    Categories,
    TDepartments,
    Departments,
    TFinancialYear,
    FinancialYear,
    TItems,
    Items,
    TLocations,
    Locations,
} from "definations/module-config";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        categories: builder.query<TBasePaginatedResponse<Categories>, TRequest>(
            {
                query: (params) => ({
                    url: "/config/category/",
                    params,
                }),
                providesTags: ["Categories"],
            }
        ),
        addCategories: builder.mutation<Categories, TCategories>({
            query: (body) => ({
                url: "/config/category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Categories"],
        }),
        updateCategories: builder.mutation<
            Categories,
            { id: string; body: TCategories }
        >({
            query: ({ id, body }) => ({
                url: `/config/category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Categories"],
        }),
        deleteCategories: builder.mutation<Categories, string>({
            query: (id) => ({
                url: `/config/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),

        departments: builder.query<
            TBasePaginatedResponse<Departments>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/departments/",
                params,
            }),
            providesTags: ["Departments"],
        }),
        addDepartments: builder.mutation<Departments, TDepartments>({
            query: (body) => ({
                url: "/config/departments/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Departments"],
        }),
        updateDepartments: builder.mutation<
            Departments,
            { id: string; body: TDepartments }
        >({
            query: ({ id, body }) => ({
                url: `/config/departments/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Departments"],
        }),
        deleteDepartments: builder.mutation<Departments, string>({
            query: (id) => ({
                url: `/config/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Departments"],
        }),

        financialYear: builder.query<
            TBasePaginatedResponse<FinancialYear>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/financial-year/",
                params,
            }),
            providesTags: ["FinancialYear"],
        }),
        addFinancialYear: builder.mutation<FinancialYear, TFinancialYear>({
            query: (body) => ({
                url: "/config/financial-year/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["FinancialYear"],
        }),
        updateFinancialYear: builder.mutation<
            FinancialYear,
            { id: string; body: TFinancialYear }
        >({
            query: ({ id, body }) => ({
                url: `/config/financial-year/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["FinancialYear"],
        }),

        deleteFinancialYear: builder.mutation<FinancialYear, string>({
            query: (id) => ({
                url: `/config/financial-year/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FinancialYear"],
        }),

        items: builder.query<TBasePaginatedResponse<Items>, TRequest>({
            query: (params) => ({
                url: "/config/items/",
                params,
            }),
            providesTags: ["Items"],
        }),
        addItems: builder.mutation<Items, TItems>({
            query: (body) => ({
                url: "/config/items/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Items"],
        }),
        updateItems: builder.mutation<Items, { id: string; body: TItems }>({
            query: ({ id, body }) => ({
                url: `/config/items/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Items"],
        }),
        deleteItems: builder.mutation<Items, string>({
            query: (id) => ({
                url: `/config/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Items"],
        }),

        locations: builder.query<TBasePaginatedResponse<Locations>, TRequest>({
            query: (params) => ({
                url: "/config/locations/",
                params,
            }),
            providesTags: ["Locations"],
        }),
        addLocations: builder.mutation<Locations, TLocations>({
            query: (body) => ({
                url: "/config/locations/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Locations"],
        }),
        updateLocations: builder.mutation<
            Locations,
            { id: string; body: TLocations }
        >({
            query: ({ id, body }) => ({
                url: `/config/locations/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Locations"],
        }),
        deleteLocations: builder.mutation<Locations, string>({
            query: (id) => ({
                url: `/config/locations/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Locations"],
        }),
    }),
});

export const {
    useCategoriesQuery,
    useAddCategoriesMutation,
    useUpdateCategoriesMutation,
    useDeleteCategoriesMutation,
    useDepartmentsQuery,
    useAddDepartmentsMutation,
    useUpdateDepartmentsMutation,
    useDeleteDepartmentsMutation,
    useFinancialYearQuery,
    useAddFinancialYearMutation,
    useUpdateFinancialYearMutation,
    useDeleteFinancialYearMutation,
    useItemsQuery,
    useAddItemsMutation,
    useUpdateItemsMutation,
    useDeleteItemsMutation,
    useLocationsQuery,
    useAddLocationsMutation,
    useUpdateLocationsMutation,
    useDeleteLocationsMutation,
} = projectsAPI;
