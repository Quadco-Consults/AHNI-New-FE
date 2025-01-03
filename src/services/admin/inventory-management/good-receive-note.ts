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
            TResponse<IGoodReceiveNotePaginatedData>,
            TGoodReceiveNoteFormValues
        >({
            query: () => ({
                method: "POST",
                url: BASE_URL,
            }),
        }),

        getAllGoodReceiveNote: builder.query<
            TPaginatedResponse<IGoodReceiveNotePaginatedData>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: BASE_URL,
            }),
        }),

        getSingleGoodReceiveNote: builder.query<
            TResponse<IGoodReceiveNoteSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
        }),

        editGoodReceiveNote: builder.mutation<
            TResponse<IGoodReceiveNoteSingleData>,
            string
        >({
            query: (id) => ({
                url: `${BASE_URL}${id}/`,
                method: "PUT",
            }),
        }),

        deleteGoodReceiveNote: builder.mutation<
            TResponse<IGoodReceiveNoteSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
        }),
    }),
});

export const {
    useCreateGoodReceiveNoteMutation,
    useGetAllGoodReceiveNoteQuery,
    useGetSingleGoodReceiveNoteQuery,
    useEditGoodReceiveNoteMutation,
    useDeleteGoodReceiveNoteMutation,
} = GoodReceiveNoteAPI;
