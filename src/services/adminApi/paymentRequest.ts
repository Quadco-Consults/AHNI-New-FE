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
  requested_by: string;
}

export type TPaymentRequestPayload = {
  date: string;
  payment_to: string;
  tax_identification_number: string;
  amount_in_figures: string;
  amount_in_words: string;
  account_number: string;
  bank: string;
  requested_by: string;
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
    }),
    getOnePaymentRequest: builder.query<TPaymentRequest, { id: string }>({
      query: ({ id }) => ({
        url: `${url}${id}/`,
      }),
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
    }),
    deletePaymentRequest: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${url}${id}/`,
        method: "DELETE",
      }),
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
