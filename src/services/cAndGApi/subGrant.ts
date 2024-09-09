import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const SUB_GRANT_BASE_URL = "/contract-grants/sub-grants/";
const SUB_GRANT_APPLICATIONS_BASE_URL = "/contract-grants/sub-grants-applications/";
const SUB_GRANT_APPLICATIONS_DOCS_BASE_URL = "/contract-grants/sub-grants-applications-docs/";

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
