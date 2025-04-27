import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { IConsultancyStaffPaginatedData, IConsultancyStaffSingleData, TConsultancyStaffFormData } from "definations/c&g/contract-management/consultancy-management/consultancy-application";

const BASE_URL = "/contract-grants/consultancy/applicants/";

const ConsultancyStaffAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsultancyStaff: builder.mutation<
            TResponse<IConsultancyStaffSingleData>,
            TConsultancyStaffFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["CONSULTANCY_STAFF"],
        }),

        getAllConsultancyStaffs: builder.query<
            TPaginatedResponse<IConsultancyStaffPaginatedData>,
            TRequest
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

        // getExistingConsultancyApplicants: builder.query<
        //     TPaginatedResponse<IConsultancyApplicantPaginatedData>,
        //     TRequest
        // >({
        //     query: (id) => ({
        //         method: "GET",
        //         url: `${BASE_URL}existing/`,
        //     }),
        //     providesTags: ["CONSULTANCY_STAFF"],
        // }),

        modifyConsultancyStaff: builder.mutation<
            TPaginatedResponse<IConsultancyStaffSingleData>,
            {
                id: string;
                body: TConsultancyStaffFormData;
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
} = ConsultancyStaffAPI;
