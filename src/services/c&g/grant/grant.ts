import {
    IGrantPaginatedData,
    IGrantSingleData,
    TGrantFormData,
} from "definations/c&g/grants";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

// TEST COMMENT

const BASE_URL = "/contract-grants/grants/";

const GrantAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createGrant: builder.mutation<
            TResponse<IGrantSingleData>,
            TGrantFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["GRANT"],
        }),

        getAllGrants: builder.query<
            TPaginatedResponse<IGrantPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["GRANT"],
        }),

        getSingleGrant: builder.query<TResponse<IGrantSingleData>, string>({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "GRANT", id }],
        }),

        modifyGrant: builder.mutation<
            TResponse<IGrantSingleData>,
            { id: string; body: TGrantFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["GRANT"],
        }),

        deleteGrant: builder.mutation<TResponse<IGrantSingleData>, string>({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["GRANT"],
        }),
    }),
});

export const {
    useCreateGrantMutation,
    useGetAllGrantsQuery,
    useGetSingleGrantQuery,
    useModifyGrantMutation,
    useDeleteGrantMutation,
} = GrantAPI;
