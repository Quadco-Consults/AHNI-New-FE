import baseAPI from "..";
import { z } from "zod";
import { PurchaseOrderSchema } from "definations/procurement-validator";
import {
  IPurchaseOrderPaginatedData,
  IPurchaseOrderSingleData,
} from "definations/procurement-types/purchase-order";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/purchase-order/";

const PurchaseOrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchaseOrders: builder.query<
      TPaginatedResponse<IPurchaseOrderPaginatedData>,
      TRequest
    >({
      query: (params) => {
        return {
          url: `${BASE_URL}`,
          params,
        };
      },
      providesTags: ["PURCHASE_ORDER"],
    }),

    createPurchaseOrder: builder.mutation<
      TResponse<IPurchaseOrderSingleData>,
      z.infer<typeof PurchaseOrderSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PURCHASE_ORDER"],
    }),

    getSinglePurchaseOrder: builder.query<
      TResponse<IPurchaseOrderSingleData>,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["PURCHASE_ORDER"],
    }),

    updatePurchaseOrder: builder.mutation<
      TResponse<IPurchaseOrderSingleData>,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PURCHASE_ORDER"],
    }),

    modifyPurchaseOrder: builder.mutation<
      TResponse<IPurchaseOrderSingleData>,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PURCHASE_ORDER"],
    }),

    deletePurchaseOrder: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PURCHASE_ORDER"],
    }),
  }),
});

export const { useGetAllPurchaseOrdersQuery, useCreatePurchaseOrderMutation } =
  PurchaseOrderAPI;
