import baseAPI from ".";
import { TBasePaginatedResponse, TRequest } from "definations/auth";
import {
    FundingSource,
    TFundingSource,
    TBeneficiaries,
    Beneficiaries,
    TDocumentTypes,
    DocumentTypes,
    Partners,
    TPartners,
} from "definations/module-projects";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        fundingSources: builder.query<
            TBasePaginatedResponse<FundingSource>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/funding-sources/",
                params,
            }),
            providesTags: ["FundingSource"],
        }),
        addFundingSource: builder.mutation<FundingSource, TFundingSource>({
            query: (body) => ({
                url: "/projects/funding-sources/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["FundingSource"],
        }),
        updateFundingSource: builder.mutation<
            FundingSource,
            { id: string; body: TFundingSource }
        >({
            query: ({ id, body }) => ({
                url: `/projects/funding-sources/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["FundingSource"],
        }),
        deleteFundingSource: builder.mutation<FundingSource, string>({
            query: (id) => ({
                url: `/projects/funding-sources/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FundingSource"],
        }),

        beneficiaries: builder.query<
            TBasePaginatedResponse<Beneficiaries>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/beneficiaries/",
                params,
            }),
            providesTags: ["Beneficiaries"],
        }),
        addBeneficiaries: builder.mutation<Beneficiaries, TBeneficiaries>({
            query: (body) => ({
                url: "/projects/beneficiaries/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Beneficiaries"],
        }),
        updateBeneficiaries: builder.mutation<
            Beneficiaries,
            { id: string; body: TBeneficiaries }
        >({
            query: ({ id, body }) => ({
                url: `/projects/beneficiaries/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Beneficiaries"],
        }),
        deleteBeneficiaries: builder.mutation<Beneficiaries, string>({
            query: (id) => ({
                url: `/projects/beneficiaries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Beneficiaries"],
        }),

        documentTypes: builder.query<
            TBasePaginatedResponse<DocumentTypes>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/document-types/",
                params,
            }),
            providesTags: ["DocumentTypes"],
        }),
        addDocumentTypes: builder.mutation<DocumentTypes, TDocumentTypes>({
            query: (body) => ({
                url: "/projects/document-types/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["DocumentTypes"],
        }),
        updateDocumentTypes: builder.mutation<
            DocumentTypes,
            { id: string; body: TDocumentTypes }
        >({
            query: ({ id, body }) => ({
                url: `/projects/document-types/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["DocumentTypes"],
        }),
        deleteDocumentTypes: builder.mutation<DocumentTypes, string>({
            query: (id) => ({
                url: `/projects/document-types/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DocumentTypes"],
        }),

        partners: builder.query<TBasePaginatedResponse<Partners>, TRequest>({
            query: (params) => ({
                url: "/projects/partners/",
                params,
            }),
            providesTags: ["Partners"],
        }),
        
        addPartners: builder.mutation<Partners, TPartners>({
            query: (body) => ({
                url: "/projects/partners/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Partners"],
        }),

        updatePartners: builder.mutation<
            Partners,
            { id: string; body: TPartners }
        >({
            query: ({ id, body }) => ({
                url: `/projects/partners/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Partners"],
        }),

        deletePartners: builder.mutation<Partners, string>({
            query: (id) => ({
                url: `/projects/partners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Partners"],
        }),

        states: builder.query<any, any>({
            query: () => ({
                url: "/config/states/",
            }),
        }),
        
        location: builder.query<any, TRequest>({
            query: (params) => ({
                url: "/config/locations/",
                params,
            }),
        }),
    }),
});

export const {
    useFundingSourcesQuery,
    useAddFundingSourceMutation,
    useBeneficiariesQuery,
    useAddBeneficiariesMutation,
    useDocumentTypesQuery,
    useAddDocumentTypesMutation,
    usePartnersQuery,
    useAddPartnersMutation,
    useStatesQuery,
    useLocationQuery,
    useDeleteFundingSourceMutation,
    useUpdateFundingSourceMutation,
    useUpdateBeneficiariesMutation,
    useDeleteBeneficiariesMutation,
    useDeleteDocumentTypesMutation,
    useUpdateDocumentTypesMutation,
    useUpdatePartnersMutation,
    useDeletePartnersMutation,
} = projectsAPI;
