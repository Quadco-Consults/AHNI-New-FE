import { TProjectData, TProjectFormValues } from "definations/project";
import baseAPI from "..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/projects/";

const ProjectAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        addProject: builder.mutation<
            TResponse<TProjectData>,
            TProjectFormValues
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        getAllProjects: builder.query<
            TPaginatedResponse<TProjectData>,
            TRequest & { has_fund_requests?: boolean }
        >({
            query: (params) => {
                return {
                    url: `${BASE_URL}`,
                    params,
                };
            },
            providesTags: ["PROJECTS"],
        }),

        getSingleProject: builder.query<TResponse<TProjectData>, string>({
            query: (id) => {
                return {
                    url: `${BASE_URL}${id}/`,
                };
            },
            providesTags: ["PROJECTS"],
        }),

        updateProject: builder.mutation<
            TResponse<TProjectData>,
            { id: string; body: any }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        patchProject: builder.mutation<
            TResponse<TProjectData>,
            { id: string; body: { status: string } }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        deleteProject: builder.mutation<
            TResponse<TProjectData>,
            { path: { id: string } }
        >({
            query: ({ path }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),
    }),
});

export const {
    useAddProjectMutation,
    useGetAllProjectsQuery,
    useGetSingleProjectQuery,
    useUpdateProjectMutation,
    usePatchProjectMutation,
    useDeleteProjectMutation,
} = ProjectAPI;

// getProjectsParams: builder.query<ProjectsResultsData[], {}>({
//     query: (config) => {
//         return {
//             url: `${BASE_URL}`,
//             ...config,
//         };
//     },
//     providesTags: ["PROJECTS"],
// }),
