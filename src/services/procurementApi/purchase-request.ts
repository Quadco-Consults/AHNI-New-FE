/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import {
    PurchaseRequestData,
    PurchaseRequestResponse,
    PurchaseRequestResultsData,
} from "definations/procurement-types/purchase-request";
import baseAPI from "..";
import { z } from "zod";
import { PurchaseRequestSchema } from "definations/procurement-validator";
import { TPaginatedResponse } from "definations/index";

const BASE_URL = "/procurements/purchase-request/";

const PurchaseRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getPurchaseRequests: builder.query<
            TPaginatedResponse<PurchaseRequestResultsData>,
            {}
        >({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["PURCHASE_REQUEST"],
        }),
        getPurchaseRequestList: builder.query<PurchaseRequestResultsData[], {}>(
            {
                query: (config) => {
                    return {
                        url: `${BASE_URL}`,
                        ...config,
                    };
                },
                providesTags: ["PURCHASE_REQUEST"],
            }
        ),

        createPurchaseRequest: builder.mutation<
            PurchaseRequestResponse,
            z.infer<typeof PurchaseRequestSchema>
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["PURCHASE_REQUEST"],
        }),

        getPurchaseRequest: builder.query<
            PurchaseRequestResultsData,
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/`,
                };
            },
            providesTags: ["PURCHASE_REQUEST"],
        }),

        updatePurchaseRequest: builder.mutation<
            PurchaseRequestResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["PURCHASE_REQUEST"],
        }),

        modifyPurchaseRequest: builder.mutation<
            PurchaseRequestResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PURCHASE_REQUEST"],
        }),

        deletePurchaseRequest: builder.mutation<void, { path: { id: string } }>(
            {
                query: ({ path }) => ({
                    url: `${BASE_URL}${path.id}/`,
                    method: "DELETE",
                }),
                invalidatesTags: ["PURCHASE_REQUEST"],
            }
        ),
    }),
});

export default PurchaseRequestAPI;
