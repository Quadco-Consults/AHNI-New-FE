import baseAPI from "..";
import { z } from "zod";
import {
    SolicitationSchema,
    SolicitationSubmissionSchema,
    TSolicitationQuotationFormData,
} from "definations/procurement-validator";
import {
    ISolicitationRFQData,
    SolicitationData,
    SolicitationResponse,
    SolicitationResultsData,
    SolicitationSubmissionData,
} from "definations/procurement-types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/solicitations/";

const SolicitationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSolicitation: builder.mutation<
            SolicitationResponse,
            TSolicitationQuotationFormData
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["SOLICITATION"],
        }),

        getAllSolicitations: builder.query<
            TPaginatedResponse<ISolicitationRFQData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["SOLICITATION"],
        }),

        getSingleSolicitation: builder.query<
            TResponse<ISolicitationRFQData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["SOLICITATION"],
        }),

        // getSolicitationSubmission: builder.query<
        //     SolicitationSubmissionData,
        //     { path: { id: string } }
        // >({
        //     query: ({ path }) => {
        //         return {
        //             url: `${BASE_URL}${path.id}/submissions/`,
        //         };
        //     },
        //     providesTags: ["SOLICITATION"],
        // }),

        // updateSolicitation: builder.mutation<
        //     SolicitationResponse,
        //     { path: { id: string }; body: any }
        // >({
        //     query: ({ path, body }) => ({
        //         url: `${BASE_URL}${path.id}/`,
        //         method: "PUT",
        //         body,
        //     }),
        //     invalidatesTags: ["SOLICITATION"],
        // }),

        // modifySolicitation: builder.mutation<
        //     SolicitationResponse,
        //     { path: { id: string }; body: any }
        // >({
        //     query: ({ path, body }) => ({
        //         url: `${BASE_URL}${path.id}/`,
        //         method: "PATCH",
        //         body,
        //     }),
        //     invalidatesTags: ["SOLICITATION"],
        // }),

        // deleteSolicitation: builder.mutation<void, { path: { id: string } }>({
        //     query: ({ path }) => ({
        //         url: `${BASE_URL}${path.id}/`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["SOLICITATION"],
        // }),
    }),
});

export const {
    useCreateSolicitationMutation,
    useGetAllSolicitationsQuery,
    useGetSingleSolicitationQuery,
} = SolicitationAPI;
