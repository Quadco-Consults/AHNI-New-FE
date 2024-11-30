import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
    ProjectsData,
    ProjectsResponse,
    ProjectsResultsData,
} from "definations/project-types/projects";
import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";

const BASE_URL = "/projects/";

const projectsAPi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<
            TBasePaginatedResponse<ProjectsResultsData>,
            TRequest
        >({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("PROJECTS", data) : [],
        }),

        getProjectsParams: builder.query<ProjectsResultsData[], {}>({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("PROJECTS", data) : [],
        }),

        createProject: builder.mutation<ProjectsResponse, any>({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("PROJECTS") : [],
        }),

        getSingleProject: builder.query<TResponse<ProjectsResultsData>, string>(
            {
                query: (id) => {
                    return {
                        url: `${BASE_URL}${id}/`,
                    };
                },
                providesTags: (data, error) =>
                    !error ? provideTags("PROJECTS", data) : [],
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
            invalidatesTags: (_, error, { id }) =>
                !error ? invalidateTags("PROJECTS", { ids: [id] }) : [],
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
            invalidatesTags: (_, error, { id }) =>
                !error ? invalidateTags("PROJECTS", { ids: [id] }) : [],
        }),

        deleteProject: builder.mutation<void, { path: { id: string } }>({
            query: ({ path }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_, error, { path }) =>
                !error ? invalidateTags("PROJECTS", { ids: [path.id] }) : [],
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
