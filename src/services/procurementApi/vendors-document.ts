/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  VendorsDocumentData,
  VendorsDocumentResponse,
  VendorsDocumentResultsData,
} from "definations/procurement-types/vendors-document";

const BASE_URL = "/procurement/vendor-documents/";

const VendorsDocumentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDocuments: builder.query<VendorsDocumentData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("VENDOR_DOCUMENT", data) : [],
    }),

    createVendorDocument: builder.mutation<VendorsDocumentResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("VENDOR_DOCUMENT") : [],
    }),

    getVendorDocument: builder.query<
      VendorsDocumentResultsData,
      { path: { id: string } }
    >({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("VENDOR_DOCUMENT", data) : [],
    }),

    updateVendorDocument: builder.mutation<
      VendorsDocumentResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR_DOCUMENT", { ids: [path.id] }) : [],
    }),

    modifyVendorDocument: builder.mutation<
      VendorsDocumentResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR_DOCUMENT", { ids: [path.id] }) : [],
    }),

    deleteVendorDocument: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR_DOCUMENT", { ids: [path.id] }) : [],
    }),
  }),
});

export default VendorsDocumentAPI;
