import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TProjectClassData,
    TProjectClassFormValues,
} from "definations/modules/finance/project-class";

const ProjectClassAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllProjectClasses: builder.query<
            TPaginatedResponse<TProjectClassData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/project-classes/",
                params,
            }),
            providesTags: ["ProjectClass"],
        }),

        addProjectClass: builder.mutation<
            TResponse<TProjectClassData>,
            TProjectClassFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/finance/project-classes/",
                body,
            }),
            invalidatesTags: ["ProjectClass"],
        }),

        updateProjectClass: builder.mutation<
            TResponse<TProjectClassData>,
            { id: number; body: TProjectClassFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/project-classes/${id}/`,
                body,
            }),
            invalidatesTags: ["ProjectClass"],
        }),

        deleteProjectClass: builder.mutation<
            TResponse<TProjectClassData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/project-classes/${id}/`,
            }),
            invalidatesTags: ["ProjectClass"],
        }),
    }),
});

export const {
    useGetAllProjectClassesQuery,
    useAddProjectClassMutation,
    useUpdateProjectClassMutation,
    useDeleteProjectClassMutation,
} = ProjectClassAPI;
