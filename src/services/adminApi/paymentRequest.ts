import baseAPI from "..";
import { TBasePaginatedRespose, TRequest } from "definations/auth";

export interface TPaymentRequest {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  payment_to: string;
  tax_identification_number: string;
  amount_in_figures: string;
  amount_in_words: string;
  account_number: string;
  bank: string;
  requested_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    designation: string;
  };
}

export type TPaymentRequestPayload = {
  date: string;
  payment_to: string;
  tax_identification_number: string;
  amount_in_figures: string;
  amount_in_words: string;
  account_number: string;
  bank: string;
  requested_by_id: string;
};

export interface CreatePaymentRequestPayload {
  date: string;
  payment_to: string;
  tax_identification_number?: string;
  amount_in_figures: string;
  amount_in_words: string;
  account_number: string;
  bank: string;
  requested_by: string;
}

const url = "/admins/payment-requests/";

const paymentRequests = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentRequests: builder.query<
      TBasePaginatedRespose<TPaymentRequest[]>,
      TRequest
    >({
      query: (params) => ({
        url,
        params,
      }),
      providesTags: ["PAYMENT"],
    }),
    getOnePaymentRequest: builder.query<TPaymentRequest, { id: string }>({
      query: ({ id }) => ({
        url: `${url}${id}/`,
      }),
      providesTags: ["PAYMENT"],
    }),
    createPaymentRequest: builder.mutation<
      TPaymentRequest,
      TPaymentRequestPayload
    >({
      query: (body) => ({
        url: `/admins/payment-requests/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PAYMENT"],
    }),
    updatePaymentRequest: builder.mutation<
      TPaymentRequest,
      { id: string; body: Partial<CreatePaymentRequestPayload> }
    >({
      query: ({ id, body }) => ({
        url: `${url}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PAYMENT"],
    }),
    deletePaymentRequest: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${url}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PAYMENT"],
    }),
    uploadDocument: builder.mutation<void, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/admins/payment-requests/${id}/upload_document/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetPaymentRequestsQuery,
  useGetOnePaymentRequestQuery,
  useCreatePaymentRequestMutation,
  useUpdatePaymentRequestMutation,
  useDeletePaymentRequestMutation,
  useUploadDocumentMutation,
} = paymentRequests;
