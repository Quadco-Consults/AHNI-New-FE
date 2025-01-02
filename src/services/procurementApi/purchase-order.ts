/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import { PurchaseOrderSchema } from "definations/procurement-validator";
import {
  PurchaseOrderData,
  PurchaseOrderResponse,
  PurchaseOrderResultsData,
} from "definations/procurement-types/purchase-order";

const BASE_URL = "/procurements/purchase-orders/";

const PurchaseOrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query<PurchaseOrderData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["PURCHASE_ORDER"],
    }),

    createPurchaseOrder: builder.mutation<
      PurchaseOrderResponse,
      z.infer<typeof PurchaseOrderSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PURCHASE_ORDER"],
    }),

    getPurchaseOrder: builder.query<
      PurchaseOrderResultsData,
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
      PurchaseOrderResponse,
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
      PurchaseOrderResponse,
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

export default PurchaseOrderAPI;
