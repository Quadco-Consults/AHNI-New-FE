import {
    IConsultantPaginatedData,
    IConsultantSingleData,
    TConsultantanagementDetailsFormData,
    TScopeOfWorkFormData,
} from "definations/c&g/contract-management/consultancy-management";
import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/contract-grants/consultants/";

const ConsultantManagementAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createConsultantManagement: builder.mutation<
            TResponse<IConsultantSingleData>,
            TConsultantanagementDetailsFormData & TScopeOfWorkFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["CONSULTANT_MANAGEMENT"],
        }),

        getAllConsultantManagements: builder.query<
            TPaginatedResponse<IConsultantPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["CONSULTANT_MANAGEMENT"],
        }),

        getSingleConsultantManagement: builder.query<
            TResponse<IConsultantSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["CONSULTANT_MANAGEMENT"],
        }),

        modifyConsultantManagement: builder.mutation<
            TPaginatedResponse<IConsultantSingleData>,
            {
                id: string;
                body: TConsultantanagementDetailsFormData &
                    TScopeOfWorkFormData;
            }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["CONSULTANT_MANAGEMENT"],
        }),

        deleteConsultantManagement: builder.mutation<
            TResponse<IConsultantSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["CONSULTANT_MANAGEMENT"],
        }),
    }),
});

export const {
    useCreateConsultantManagementMutation,
    useGetAllConsultantManagementsQuery,
    useGetSingleConsultantManagementQuery,
    useModifyConsultantManagementMutation,
    useDeleteConsultantManagementMutation,
} = ConsultantManagementAPI;
