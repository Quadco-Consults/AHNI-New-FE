import {
    IPaymentRequestPaginatedData,
    IPaymentRequestSingleData,
    TPaymentRequestFormData,
} from "definations/admin/payment-request";
import baseAPI from "../";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = `/admins/payments/requests/`;

const PaymentRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentRequest: builder.mutation<
            TResponse<IPaymentRequestSingleData>,
            TPaymentRequestFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["PAYMENT_REQUEST"],
        }),

        getAllPaymentRequests: builder.query<
            TPaginatedResponse<IPaymentRequestPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["PAYMENT_REQUEST"],
        }),

        getSinglePaymentRequest: builder.query<
            TResponse<IPaymentRequestSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        modifyPaymentRequest: builder.mutation<
            TResponse<IPaymentRequestSingleData>,
            { id: string; body: TPaymentRequestFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["PAYMENT_REQUEST"],
        }),

        deletePaymentRequest: builder.mutation<
            TResponse<IPaymentRequestSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["PAYMENT_REQUEST"],
        }),
    }),
});

export const {
    useCreatePaymentRequestMutation,
    useGetAllPaymentRequestsQuery,
    useGetSinglePaymentRequestQuery,
    useModifyPaymentRequestMutation,
    useDeletePaymentRequestMutation,
} = PaymentRequestAPI;
