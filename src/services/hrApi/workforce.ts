import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    WorkforceBankAccount,
    WorkforcePension,
    WorkforceQualificationResult,
    WorkforceResults,
} from "definations/hr-types/workforce";
import {
    WorkforceBankAccountFormValues,
    WorkforcePensionFormValues,
} from "definations/hr-validator";

const BASE_URL = "/hr/hr-workforce/";

const WorkforceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getWorkforces: builder.query<
        TPaginatedResponse<WorkforceResults[]>,
        TRequest
        >({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["WORKFORCE"],
        }),
        getWorkforceQualifications: builder.query<
            WorkforceQualificationResult[],
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/qualifications/`,
                };
            },
            providesTags: ["WORKFORCE"],
        }),
        getWorkforce: builder.query<WorkforceResults, { path: { id: string } }>(
            {
                query: ({ path }) => {
                    return {
                        url: `${BASE_URL}${path.id}/`,
                    };
                },
                providesTags: ["WORKFORCE"],
            }
        ),
        getWorkforcePension: builder.query<
            WorkforcePension,
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/pension-administrator/`,
                };
            },
            providesTags: ["WORKFORCE"],
        }),
        createWorkforcePension: builder.mutation<
        TResponse<WorkforcePension>,
            { path: { id: string }; body: WorkforcePensionFormValues }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/pension-administrator/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
        getWorkforceBankAccount: builder.query<
            WorkforceBankAccount,
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/bank-account/`,
                };
            },
            providesTags: ["WORKFORCE"],
        }),
        createWorkforceBankAccount: builder.mutation<
        TResponse<WorkforceBankAccount>,
            { path: { id: string }; body: WorkforceBankAccountFormValues }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/bank-account/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
        createWorkforceQualification: builder.mutation<
        TResponse<WorkforcePension>,
            { path: { id: string }; body: FormData }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/qualifications/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
        createWorkforce: builder.mutation<
        TResponse<WorkforceResults>,
            any
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
        updateWorkforce: builder.mutation<
        TResponse<WorkforceResults>,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
        updateWorkforceAdditionalInfo: builder.mutation<
        TResponse<WorkforceResults>,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/additional-info/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["WORKFORCE"],
        }),
    }),
});

export const {
    useCreateWorkforceBankAccountMutation,
    useCreateWorkforceMutation,
    useCreateWorkforcePensionMutation,
    useCreateWorkforceQualificationMutation,
    useGetWorkforceBankAccountQuery,
    useGetWorkforcePensionQuery,
    useGetWorkforceQualificationsQuery,
    useGetWorkforceQuery,
    useGetWorkforcesQuery,
    useUpdateWorkforceAdditionalInfoMutation,
    useUpdateWorkforceMutation
} = WorkforceAPI;
