import baseAPI from ".";
import { TBasePaginatedRespose, TRequest } from "definations/auth";
import { 
    FundingSource, 
    TFundingSource, 
    TBeneficiaries, 
    Beneficiaries ,
    TDocumentTypes,
    DocumentTypes,
    Partners,
    TPartners,
} from "definations/module-projects";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        fundingSources: builder.query<TBasePaginatedRespose<FundingSource[]>, TRequest>({
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

        beneficiaries: builder.query<TBasePaginatedRespose<Beneficiaries[]>, TRequest>({
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

        documentTypes: builder.query<TBasePaginatedRespose<DocumentTypes[]>, TRequest>({
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

        partners: builder.query<TBasePaginatedRespose<Partners[]>, TRequest>({
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
        states: builder.query({
            query: (params) => ({
                url: "/config/states/",
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
    useStatesQuery
} = projectsAPI