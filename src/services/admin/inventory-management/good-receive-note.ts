import {
    IGoodReceiveNotePaginatedData,
    IGoodReceiveNoteSingleData,
    TGoodReceiveNoteFormValues,
} from "definations/admin/inventory-management/good-receive-note";
import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/inventory/good-receive-notes/`;

const GoodReceiveNoteAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createGoodReceiveNote: builder.mutation<
            TResponse<IGoodReceiveNoteSingleData>,
            TGoodReceiveNoteFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["GOOD_RECEIVE_NOTE"],
        }),

        getAllGoodReceiveNote: builder.query<
            TPaginatedResponse<IGoodReceiveNotePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["GOOD_RECEIVE_NOTE"],
        }),

        getSingleGoodReceiveNote: builder.query<
            TResponse<IGoodReceiveNoteSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["GOOD_RECEIVE_NOTE"],
        }),

        modifyGoodReceiveNote: builder.mutation<
            TResponse<IGoodReceiveNoteSingleData>,
            { id: string; body: TGoodReceiveNoteFormValues }
        >({
            query: ({ id, body }) => ({
                url: `${BASE_URL}${id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["GOOD_RECEIVE_NOTE"],
        }),

        deleteGoodReceiveNote: builder.mutation<
            TResponse<IGoodReceiveNoteSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["GOOD_RECEIVE_NOTE"],
        }),
    }),
});

export const {
    useCreateGoodReceiveNoteMutation,
    useGetAllGoodReceiveNoteQuery,
    useGetSingleGoodReceiveNoteQuery,
    useModifyGoodReceiveNoteMutation,
    useDeleteGoodReceiveNoteMutation,
} = GoodReceiveNoteAPI;
