import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TItemRequisitionFormValues,
    TItemRequisitionPaginatedData,
    TItemRequisitionSingleData,
} from "definations/admin/inventory-management/item-requisition";

const BASE_URL = "/admins/inventory/item-requisitions/";

const ItemRequisitionAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createItemRequisition: builder.mutation<
            TResponse<TItemRequisitionSingleData>,
            TItemRequisitionFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["ITEM_REQUISITION"],
        }),

        getAllItemRequisitions: builder.query<
            TPaginatedResponse<TItemRequisitionPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["ITEM_REQUISITION"],
        }),

        getSingleItemRequisition: builder.query<
            TResponse<TItemRequisitionSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["ITEM_REQUISITION"],
        }),

        editItemRequisition: builder.mutation<
            TResponse<TItemRequisitionSingleData>,
            { id: string; body: TItemRequisitionFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}`,
                body,
            }),
            invalidatesTags: ["ITEM_REQUISITION"],
        }),

        deleteItemRequisition: builder.mutation<
            TResponse<TItemRequisitionSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["ITEM_REQUISITION"],
        }),
    }),
});

export const {
    useCreateItemRequisitionMutation,
    useGetAllItemRequisitionsQuery,
    useGetSingleItemRequisitionQuery,
    useEditItemRequisitionMutation,
    useDeleteItemRequisitionMutation,
} = ItemRequisitionAPI;
