import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const BASE_URL_DETAILS = "contract-grants/consultancy-details/";
const BASE_URL_APPLICATIONS = "contract-grants/consultancy-applications/";
const BASE_URL_APPLICATIONS_DOCS = "contract-grants/consultancy-app-docs/";
const BASE_URL_SCOPES = "contract-grants/consultancy-scopes/";
const TAG = "CONSULTANCY";

export const consultancyAPIs = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllConsultancy: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL_DETAILS}`,
        method: "GET",
        ...config,
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    getSingleConsultancy: builder.query<any, any>({
      query: (id) => ({
        url: `${BASE_URL_DETAILS}${id}`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    addConsultancyDetails: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL_DETAILS}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),
    // scopes
    getAllConsultancyScope: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL_SCOPES}`,
        method: "GET",
        ...config,
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    getSingleConsultancyScope: builder.query<any, any>({
      query: (id) => ({
        url: `${BASE_URL_DETAILS}${id}/scope-of-work/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    addConsultancyScopeDetails: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL_SCOPES}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),

    // applications
    getAllConsultancyApplications: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL_APPLICATIONS}`,
        method: "GET",
        ...config,
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    getSingleConsultancyApplication: builder.query<any, any>({
      query: ({ id }) => ({
        url: `${BASE_URL_APPLICATIONS}${id}`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    addConsultancyApplicationDetails: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL_APPLICATIONS}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),

    shortlistConsultant1: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL_APPLICATIONS}short-list/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),

    getMetricQuestions: builder.query<any, any>({
      query: () => ({
        url: `${BASE_URL_DETAILS}consultancy_evaluation/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),

    postConsultantMetrics: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL_DETAILS}consultancy_evaluation/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),
    // application
  }),
});

// application docs
export const ConsultancyApplicationsDocsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getConsultancysApplicationDocs: builder.query({
      query: ({ params }) => ({
        url: BASE_URL_APPLICATIONS_DOCS,
        method: "GET",
        params,
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    addConsultancyApplicationDocs: builder.mutation({
      query: (body) => ({
        url: BASE_URL_APPLICATIONS_DOCS,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS", data) : []),
    }),
    getSingleConsultancysApplicationDocs: builder.query({
      query: ({ id }) => ({
        url: `${BASE_URL_APPLICATIONS_DOCS}${id}/`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("SUB_GRANTS", data) : []),
    }),
    editSingleConsultancysApplicationDocs: builder.mutation({
      query: ({ id }) => ({
        url: `${BASE_URL_APPLICATIONS_DOCS}${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS_DOCS", data) : []),
    }),
    deleteSingleConsultancysApplicationDocs: builder.mutation({
      query: ({ id }) => ({
        url: `$BASE_URL_APPLICATIONS_DOCSL}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("SUB_GRANTS_DOCS", data) : []),
    }),
  }),
});
