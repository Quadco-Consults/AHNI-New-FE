import {
    IAgreementPaginatedData,
    IAgreementSingleData,
    TAgreementFormData,
} from "definations/c&g/contract-management/agreement";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = "/contract-grants/agreements/";

const AgreementAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createAgreement: builder.mutation<
            TResponse<IAgreementSingleData>,
            TAgreementFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["AGREEMENT"],
        }),

        getAllAgreements: builder.query<
            TPaginatedResponse<IAgreementPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["AGREEMENT"],
        }),

        getSingleAgreement: builder.query<
            TResponse<IAgreementSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["AGREEMENT"],
        }),

        modifyAgreement: builder.mutation<
            TPaginatedResponse<IAgreementSingleData>,
            {
                id: string;
                body: TAgreementFormData;
            }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["AGREEMENT"],
        }),

        deleteAgreement: builder.mutation<
            TResponse<IAgreementSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["AGREEMENT"],
        }),
    }),
});

export const {
    useCreateAgreementMutation,
    useGetAllAgreementsQuery,
    useGetSingleAgreementQuery,
    useModifyAgreementMutation,
    useDeleteAgreementMutation,
} = AgreementAPI;
