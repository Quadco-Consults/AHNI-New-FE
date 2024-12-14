import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TItemData, TItemFormValues } from "definations/modules/config/item";
import baseAPI from "services/index";

const ItemAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllItems: builder.query<TPaginatedResponse<TItemData>, TRequest>({
            query: (params) => ({
                url: "/config/items/",
                params,
            }),
            providesTags: ["Items"],
        }),

        addItem: builder.mutation<TResponse<TItemData>, TItemFormValues>({
            query: (body) => ({
                url: "/config/items/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Items"],
        }),

        updateItem: builder.mutation<
            TResponse<TItemData>,
            { id: string; body: TItemFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/config/items/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Items"],
        }),

        deleteItem: builder.mutation<TResponse<TItemData>, string>({
            query: (id) => ({
                url: `/config/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Items"],
        }),
    }),
});

export const {
    useGetAllItemsQuery,
    useAddItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = ItemAPI;
