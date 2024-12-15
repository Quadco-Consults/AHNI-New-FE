import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TFCONumberData,
    TFCONumberFormValues,
} from "definations/modules/finance/fco-number";
import baseAPI from "services/index";

const FCONumberAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllFCONumbers: builder.query<
            TPaginatedResponse<TFCONumberData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/fco-numbers/",
                params,
            }),
            providesTags: ["FCONumber"],
        }),

        addFCONumber: builder.mutation<
            TResponse<TFCONumberData>,
            TFCONumberFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/finance/fco-numbers/",
                body,
            }),
            invalidatesTags: ["FCONumber"],
        }),

        updateFCONumber: builder.mutation<
            TResponse<TFCONumberData>,
            { id: number; body: TFCONumberFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/fco-numbers/${id}/`,
                body,
            }),
            invalidatesTags: ["FCONumber"],
        }),

        deleteFCONumber: builder.mutation<TResponse<TFCONumberData>, string>({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/fco-numbers/${id}/`,
            }),
            invalidatesTags: ["FCONumber"],
        }),
    }),
});

export const {
    useGetAllFCONumbersQuery,
    useAddFCONumberMutation,
    useUpdateFCONumberMutation,
    useDeleteFCONumberMutation,
} = FCONumberAPI;
