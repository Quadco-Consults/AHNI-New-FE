import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  VendorsResponse,
  VendorsResultsData,
} from "definations/procurement-types/vendors";
import { TPaginatedResponse, TRequest } from "definations/index";

const BASE_URL = "/procurements/vendors/";

const VendorsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<TPaginatedResponse<VendorsResultsData>, TRequest>(
      {
        query: (config) => {
          return {
            url: `${BASE_URL}`,
            // params: params,
            ...config,
          };
        },
        providesTags: (data, error) =>
          !error ? provideTags("VENDOR", data) : [],
      }
    ),

    getVendorList: builder.query<VendorsResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("VENDOR", data) : [],
    }),

    createVendor: builder.mutation<VendorsResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("VENDOR") : [],
    }),

    getVendor: builder.query<VendorsResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("VENDOR", data) : [],
    }),

    updateVendor: builder.mutation<
      VendorsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR", { ids: [path.id] }) : [],
    }),

    modifyVendor: builder.mutation<
      VendorsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR", { ids: [path.id] }) : [],
    }),

    deleteVendor: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("VENDOR", { ids: [path.id] }) : [],
    }),
  }),
});

export default VendorsAPI;
