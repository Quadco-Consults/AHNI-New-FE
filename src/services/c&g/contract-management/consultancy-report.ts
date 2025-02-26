import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IConsultancyReportPaginatedData,
    IConsultancyReportSingleData,
    TConsultancyReportFormData,
} from "definations/c&g/contract-management/consultancy-report";

const BASE_URL = "/contract-grants/consultancy/reports/";

const ConsultancyReportAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsultancyReport: builder.mutation<
            TResponse<IConsultancyReportSingleData>,
            TConsultancyReportFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_REPORT"],
        }),

        getAllConsultancyReports: builder.query<
            TPaginatedResponse<IConsultancyReportPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["CONSULTANCY_REPORT"],
        }),

        getSingleConsultancyReport: builder.query<
            TResponse<IConsultancyReportSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["CONSULTANCY_REPORT"],
        }),

        modifyConsultancyReport: builder.mutation<
            TPaginatedResponse<IConsultancyReportSingleData>,
            {
                id: string;
                body: TConsultancyReportFormData;
            }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_REPORT"],
        }),

        deleteConsultancyReport: builder.mutation<
            TResponse<IConsultancyReportSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["CONSULTANCY_REPORT"],
        }),
    }),
});

export const {
    useCreateConsultancyReportMutation,
    useGetAllConsultancyReportsQuery,
    useGetSingleConsultancyReportQuery,
    useModifyConsultancyReportMutation,
    useDeleteConsultancyReportMutation,
} = ConsultancyReportAPI;
