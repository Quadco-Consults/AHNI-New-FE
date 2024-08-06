import { TBasePaginatedRespose, TRequest } from "definations/auth";

import baseAPI from "..";

export type Agreement = {
  id: string;
  created_at: string;
  updated_at: string;
  provider: string;
  service: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
};

type CreateAgreementPayload = {
  provider: string;
  service: string;
  type: string;
  status?: string;
  start_date: string;
  end_date: string;
};

export const agrrementsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query<TBasePaginatedRespose<Agreement[]>, TRequest>({
      query: (params) => ({
        url: "/admins/agreements/",
        params,
      }),
      providesTags: ["Agreement"],
    }),
    getAgreement: builder.query<Agreement, string>({
      query: (id) => `/admins/agreements/${id}/`,
      providesTags: ["Agreement"],
    }),
    createAgreement: builder.mutation<Agreement, CreateAgreementPayload>({
      query: (payload) => ({
        url: "/admins/agreements",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Agreement"],
    }),
    updateAgreement: builder.mutation<
      Agreement,
      { id: string; payload: CreateAgreementPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admins/agreements/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Agreement"],
    }),
    deleteAgreement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admins/agreements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agreement"],
    }),
  }),
});

export const {
  useCreateAgreementMutation,
  useGetAgreementQuery,
  useDeleteAgreementMutation,
  useGetAgreementsQuery,
  useUpdateAgreementMutation,
} = agrrementsAPI;
