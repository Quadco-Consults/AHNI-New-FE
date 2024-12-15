import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TLotData, TLotFormValues } from "definations/modules/procurement/lot";
import baseAPI from "services/index";

const LotAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllLots: builder.query<TPaginatedResponse<TLotData>, TRequest>({
            query: (params) => ({
                url: "/procurements/lots/",
                params,
            }),
            providesTags: ["Lots"],
        }),

        addLot: builder.mutation<TResponse<TLotData>, TLotFormValues>({
            query: (body) => ({
                url: "/procurements/lots/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Lots"],
        }),

        updateLot: builder.mutation<
            TResponse<TLotData>,
            { id: string; body: TLotFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/procurements/lots/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Lots"],
        }),

        deleteLot: builder.mutation<TResponse<TLotData>, string>({
            query: (id) => ({
                url: `/procurements/lots/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lots"],
        }),
    }),
});

export const {
    useAddLotMutation,
    useGetAllLotsQuery,
    useUpdateLotMutation,
    useDeleteLotMutation,
} = LotAPI;
