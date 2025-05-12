import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IConsultancyStaffPaginatedData,
    IConsultancyStaffSingleData,
    TConsultancyStaffFormData,
    TExistingApplicantFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-application";

const BASE_URL = "/contract-grants/consultancy/applicants/";

const ConsultancyStaffAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsultancyStaff: builder.mutation<
            TResponse<IConsultancyStaffSingleData>,
            TConsultancyStaffFormData & {
                documents: { name: string; document: any }[];
            }
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_STAFF"],
        }),

        createExistingApplicantStaff: builder.mutation<
            TResponse<IConsultancyStaffSingleData>,
            TExistingApplicantFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}existing/`,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_STAFF"],
        }),

        getAllConsultancyStaffs: builder.query<
            TPaginatedResponse<IConsultancyStaffPaginatedData>,
            TRequest & { consultants?: string }
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["CONSULTANCY_STAFF"],
        }),

        getSingleConsultancyStaff: builder.query<
            TResponse<IConsultancyStaffSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["CONSULTANCY_STAFF"],
        }),

        modifyConsultancyStaff: builder.mutation<
            TPaginatedResponse<IConsultancyStaffSingleData>,
            {
                id: string;
                body: TConsultancyStaffFormData & {
                    documents: { name: string; document: any }[];
                };
            }
        >({
            query: ({ id, body }) => ({
                method: "PATCH",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_STAFF"],
        }),

        deleteConsultancyStaff: builder.mutation<
            TResponse<IConsultancyStaffSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["CONSULTANCY_STAFF"],
        }),
    }),
});

export const {
    useCreateConsultancyStaffMutation,
    useCreateExistingApplicantStaffMutation,
    useGetAllConsultancyStaffsQuery,
    useGetSingleConsultancyStaffQuery,
    useModifyConsultancyStaffMutation,
    useDeleteConsultancyStaffMutation,
} = ConsultancyStaffAPI;
