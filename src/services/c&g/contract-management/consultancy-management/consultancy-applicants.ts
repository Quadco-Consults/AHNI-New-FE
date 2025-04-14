import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IConsultancyApplicantPaginatedData,
    IConsultancyApplicantSingleData,
    TConsultancyApplicantFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-application";

const BASE_URL = "/contract-grants/consultancy/applicants/";

const ConsultancyApplicationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsultancyApplication: builder.mutation<
            TResponse<IConsultancyApplicantSingleData>,
            TConsultancyApplicantFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_APPLICATION"],
        }),

        getAllConsultancyApplications: builder.query<
            TPaginatedResponse<IConsultancyApplicantPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["CONSULTANCY_APPLICATION"],
        }),

        getSingleConsultancyApplication: builder.query<
            TResponse<IConsultancyApplicantSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["CONSULTANCY_APPLICATION"],
        }),

        getExistingConsultancyApplicants: builder.query<
            TPaginatedResponse<IConsultancyApplicantPaginatedData>,
            TRequest
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}existing/`,
            }),
            providesTags: ["CONSULTANCY_APPLICATION"],
        }),

        modifyConsultancyApplication: builder.mutation<
            TPaginatedResponse<IConsultancyApplicantSingleData>,
            {
                id: string;
                body: TConsultancyApplicantFormData;
            }
        >({
            query: ({ id, body }) => ({
                method: "PATCH",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_APPLICATION"],
        }),

        deleteConsultancyApplication: builder.mutation<
            TResponse<IConsultancyApplicantSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["CONSULTANCY_APPLICATION"],
        }),
    }),
});

export const {
    useCreateConsultancyApplicationMutation,
    useGetAllConsultancyApplicationsQuery,
    useGetSingleConsultancyApplicationQuery,
    useGetExistingConsultancyApplicantsQuery,
    useModifyConsultancyApplicationMutation,
    useDeleteConsultancyApplicationMutation,
} = ConsultancyApplicationAPI;
