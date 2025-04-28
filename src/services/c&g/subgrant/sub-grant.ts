import {
    ISubGrantPaginatedData,
    ISubGrantSingleData,
    TSubGrantFormData,
} from "definations/c&g/contract-management/sub-grant/sub-grant";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/contract-grants/sub-grants/";

const SubGrantAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSubGrant: builder.mutation<
            TResponse<ISubGrantSingleData>,
            TSubGrantFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["SUB_GRANT"],
        }),

        getAllSubGrants: builder.query<
            TPaginatedResponse<ISubGrantPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["SUB_GRANT"],
        }),

        getSingleSubGrant: builder.query<
            TResponse<ISubGrantSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["SUB_GRANT"],
        }),

        modifySubGrant: builder.mutation<
            TResponse<ISubGrantSingleData>,
            { id: string; body: TSubGrantFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["SUB_GRANT"],
        }),

        deleteSubGrant: builder.mutation<
            TResponse<ISubGrantSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["SUB_GRANT"],
        }),
    }),
});

export const {
    useCreateSubGrantMutation,
    useGetAllSubGrantsQuery,
    useGetSingleSubGrantQuery,
    useModifySubGrantMutation,
    useDeleteSubGrantMutation,
} = SubGrantAPI;
