import {
  IContractRequestPaginatedData,
  IContractRequestSingleData,
  TContractRequestFormData,
} from "definations/c&g/contract-management/contract-request";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

// TEST COMMENT

const BASE_URL = "/contract-grants/contract-requests/";
const INTERVIEW_BASE_URL =
  "/contract-grants/consultancy/applicant-interviews/bulk-create/";

const ContractRequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createContractRequest: builder.mutation<
      TResponse<IContractRequestSingleData>,
      TContractRequestFormData
    >({
      query: (body) => ({
        method: "POST",
        url: `${BASE_URL}`,
        body,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),
    createContractInterview: builder.mutation<
      TResponse<IContractRequestSingleData>,
      TContractRequestFormData
    >({
      query: (body) => ({
        method: "POST",
        url: `${INTERVIEW_BASE_URL}`,
        body,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),

    modifyContractInterview: builder.mutation<
      TResponse<IContractRequestSingleData>,
      { id: string; body: TContractRequestFormData }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `${INTERVIEW_BASE_URL}${id}/`,
        body,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),

    getAllContractRequests: builder.query<
      TPaginatedResponse<IContractRequestPaginatedData>,
      TRequest
    >({
      query: (params) => ({
        method: "GET",
        url: `${BASE_URL}`,
        params,
      }),
      providesTags: ["CONTRACT_REQUEST"],
    }),

    getSingleContractRequest: builder.query<
      TResponse<IContractRequestSingleData>,
      string
    >({
      query: (id) => ({
        method: "GET",
        url: `${BASE_URL}${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "CONTRACT_REQUEST", id }],
    }),

    modifyContractRequest: builder.mutation<
      TResponse<IContractRequestSingleData>,
      { id: string; body: TContractRequestFormData }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `${BASE_URL}${id}/`,
        body,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),

    modifyContractStatus: builder.mutation<
      TResponse<IContractRequestSingleData>,
      { id: string; body: TContractRequestFormData }
    >({
      query: ({ id, body }) => ({
        method: "PATCH",
        url: `/contract-grants/consultancy/applicants/${id}/`,
        body,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),

    deleteContractRequest: builder.mutation<
      TResponse<IContractRequestSingleData>,
      string
    >({
      query: (id) => ({
        method: "DELETE",
        url: `${BASE_URL}${id}`,
      }),
      invalidatesTags: ["CONTRACT_REQUEST"],
    }),
  }),
});

export const {
  useCreateContractRequestMutation,
  useGetAllContractRequestsQuery,
  useGetSingleContractRequestQuery,
  useModifyContractRequestMutation,
  useDeleteContractRequestMutation,
  // interview request
  useModifyContractStatusMutation,
  useCreateContractInterviewMutation,
  useModifyContractInterviewMutation,
} = ContractRequestAPI;
