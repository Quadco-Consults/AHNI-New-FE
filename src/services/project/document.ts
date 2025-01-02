import { TPaginatedResponse, TResponse } from "definations/index";
import baseAPI from "..";
import { invalidateTags, provideTags } from "utils/QueryUtils";
import { TProjectDocumentData } from "definations/project/document";

const BASE_URL = "/projects/documents/";

const ProjectDocumentAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createProjectDocument: builder.mutation<
            TResponse<TProjectDocumentData>,
            { title: string; project: string; file: File }
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",

                body,
            }),
            invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("PROJECT_DOCUMENT") : [],
        }),

        getAllProjectDocuments: builder.query<
            TPaginatedResponse<TProjectDocumentData>,
            string
        >({
            query: (projectId) => {
                return {
                    url: `${BASE_URL}`,
                    params: { project: projectId },
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("PROJECT_DOCUMENT", data) : [],
        }),

        deleteProjectDocument: builder.mutation<void, { path: { id: string } }>(
            {
                query: ({ path }) => ({
                    url: `${BASE_URL}${path.id}/`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, error, { path }) =>
                    !error
                        ? invalidateTags("PROJECT_DOCUMENT", { ids: [path.id] })
                        : [],
            }
        ),
    }),
});

export const {
    useCreateProjectDocumentMutation,
    useGetAllProjectDocumentsQuery,
    useDeleteProjectDocumentMutation,
} = ProjectDocumentAPI;

/*  invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("PROJECT_DOCUMENT") : [], */
