import baseAPI from "..";
import {
    ProjectsResponse,
    ProjectsResultsData,
} from "definations/project-types/projects";
import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";

const BASE_URL = "/projects/";

const projectsAPi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<
            TBasePaginatedResponse<ProjectsResultsData>,
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

        getProjectsParams: builder.query<ProjectsResultsData[], {}>({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["PROJECTS"],
        }),

        createProject: builder.mutation<ProjectsResponse, any>({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        getSingleProject: builder.query<TResponse<ProjectsResultsData>, string>(
            {
                query: (id) => {
                    return {
                        url: `${BASE_URL}${id}/`,
                    };
                },
                providesTags: ["PROJECTS"],
            }
        ),

        updateProject: builder.mutation<
            ProjectsResponse,
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
            ProjectsResponse,
            { id: string; body: { status: string } }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        deleteProject: builder.mutation<void, { path: { id: string } }>({
            query: ({ path }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),
    }),
});

export const {
    useCreateProjectMutation,
    useUpdateProjectMutation,
    usePatchProjectMutation,
    useGetProjectsQuery,
    useGetSingleProjectQuery,
    useDeleteProjectMutation,
    useGetProjectsParamsQuery,
} = projectsAPi;
