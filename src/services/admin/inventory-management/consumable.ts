import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TConsumableFormValues,
    TConsumablePaginatedData,
    TConsumableSingleData,
} from "definations/admin/inventory-management/consumable";

const BASE_URL = `/admins/inventory/consumables/`;

const ConsumableAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsumable: builder.mutation<
            TResponse<TConsumableSingleData>,
            TConsumableFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["Consumable"],
        }),

        getAllConsumables: builder.query<
            TPaginatedResponse<TConsumablePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["Consumable"],
        }),

        getSingleConsumable: builder.query<
            TResponse<TConsumableSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        editConsumable: builder.mutation<
            TResponse<TConsumableSingleData>,
            { id: string; body: TConsumableFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["Consumable"],
        }),

        deleteConsumable: builder.mutation<
            TResponse<TConsumableSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["Consumable"],
        }),
    }),
});

export const {
    useCreateConsumableMutation,
    useGetAllConsumablesQuery,
    useGetSingleConsumableQuery,
    useEditConsumableMutation,
    useDeleteConsumableMutation,
} = ConsumableAPI;

// create validation tags
