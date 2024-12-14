import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TDepartmentData,
    TDepartmentFormValues,
} from "definations/modules/config/department";
import baseAPI from "services/index";

const DepartmentAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllDepartments: builder.query<
            TPaginatedResponse<TDepartmentData>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/departments/",
                params,
            }),
            providesTags: ["Departments"],
        }),

        addDepartment: builder.mutation<
            TResponse<TDepartmentData>,
            TDepartmentFormValues
        >({
            query: (body) => ({
                url: "/config/departments/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Departments"],
        }),

        updateDepartment: builder.mutation<
            TResponse<TDepartmentData>,
            { id: string; body: TDepartmentFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/config/departments/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Departments"],
        }),

        deleteDepartment: builder.mutation<TResponse<TDepartmentData>, string>({
            query: (id) => ({
                url: `/config/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Departments"],
        }),
    }),
});

export const {
    useGetAllDepartmentsQuery,
    useAddDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
} = DepartmentAPI;
