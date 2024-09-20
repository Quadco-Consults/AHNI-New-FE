import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const SUB_GRANT_BASE_URL = "/contract-grants/sub-grants/";
const SUB_GRANT_APPLICATIONS_BASE_URL = "/contract-grants/sub-grants-applications/";
const SUB_GRANT_APPLICATIONS_DOCS_BASE_URL = "/contract-grants/sub-grants-applications-docs/";
const SUB_GRANT_PRE_AWARDS_BASE_URL = "/contract-grants/sub-grants-pre-awards/";

export const SubGrantApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSubGrants: builder.query({
      query: ({ params }) => ({
        url: SUB_GRANT_BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    addSubGrant: builder.mutation({
      query: (body) => ({
        url: SUB_GRANT_BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    getSingleSubGrants: builder.query({
      query: ({ id }) => ({
        url: `${SUB_GRANT_BASE_URL}${id}/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    editSingleSubGrants: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_BASE_URL}${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    deleteSingleSubGrants: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_BASE_URL}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
  }),
});

export const SubGrantApplicationsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSubGrantsApplication: builder.query({
      query: ({ params }) => ({
        url: SUB_GRANT_APPLICATIONS_BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    addSubGrantApplication: builder.mutation({
      query: (body) => ({
        url: SUB_GRANT_APPLICATIONS_BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    getSingleSubGrantsApplication: builder.query({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_BASE_URL}${id}/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    editSingleSubGrantsApplication: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_BASE_URL}${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    deleteSingleSubGrantsApplication: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_BASE_URL}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
  }),
});

export const SubGrantApplicationsDocsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSubGrantsApplicationDocs: builder.query({
      query: ({ params }) => ({
        url: SUB_GRANT_APPLICATIONS_DOCS_BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    addSubGrantApplicationDocs: builder.mutation({
      query: (body) => ({
        url: SUB_GRANT_APPLICATIONS_DOCS_BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    getSingleSubGrantsApplicationDocs: builder.query({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_DOCS_BASE_URL}${id}/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    editSingleSubGrantsApplicationDocs: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_DOCS_BASE_URL}${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS_DOCS", data) : []),
    }),
    deleteSingleSubGrantsApplicationDocs: builder.mutation({
      query: ({ id }) => ({
        url: `${SUB_GRANT_APPLICATIONS_DOCS_BASE_URL}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS_DOCS", data) : []),
    }),
  }),
});

export const SubGrantPreAwardsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSubGrantPreAwardsDocs: builder.query({
      query: ({ id }) => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}${id}/award_assessment_document/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),

    getSubGrantPreAwardsDocumentNames: builder.query({
      query: () => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}award_assessment_document_types/`,
        method: "GET",
      }),
    }),

    getSubGrantPreAwardsStepOneQuestions: builder.query({
      query: () => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}program_capacity_questions/`,
        method: "GET",
      }),
    }),

    addSubGrantPreAwardsStep1: builder.mutation({
      query: ({ body, id }) => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}${id}/program_capacity_response/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),

    getSubGrantPreAwardsStepTwoQuestions: builder.query({
      query: () => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}rating_questions/`,
        method: "GET",
      }),
    }),
    addSubGrantPreAwardsStepTwo: builder.mutation({
      query: ({ body, id }) => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}${id}/application_rating/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    addSubGrantPreAwardsStep3: builder.mutation({
      query: ({ body, id }) => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}${id}/assessment-recommendation/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    addSubGrantPreAwardsStep4: builder.mutation({
      query: ({ body, id }) => ({
        url: `${SUB_GRANT_PRE_AWARDS_BASE_URL}${id}/award_assessment_document/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
  }),
});
