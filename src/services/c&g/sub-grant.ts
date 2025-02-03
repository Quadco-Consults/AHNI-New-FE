import {
    ISubGrantPaginatedData,
    ISubGrantSingleData,
    TSubGrantFormData,
} from "definations/c&g/sub-grant";
import baseAPI from "../";
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
        }),

        // modifyGrant: builder.mutation<
        //     TResponse<IGrantSingleData>,
        //     { id: string; body: TGrantFormData }
        // >({
        //     query: ({ id, body }) => ({
        //         method: "PUT",
        //         url: `${BASE_URL}${id}/`,
        //         body,
        //     }),
        //     invalidatesTags: ["GRANT"],
        // }),

        // deleteGrant: builder.mutation<TResponse<IGrantSingleData>, string>({
        //     query: (id) => ({
        //         method: "DELETE",
        //         url: `${BASE_URL}${id}`,
        //     }),
        //     invalidatesTags: ["GRANT"],
        // }),
    }),
});

export const {
    useCreateSubGrantMutation,
    useGetAllSubGrantsQuery,
    useGetSingleSubGrantQuery,
} = SubGrantAPI;
