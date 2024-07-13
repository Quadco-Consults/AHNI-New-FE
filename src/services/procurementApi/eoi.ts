/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import {
  EOIData,
  EOIResponse,
  EOIResultsData,
} from "definations/procurement-types/eoi";

const BASE_URL = "/procurement/expression-of-interest/";

const EoiAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEois: builder.query<EOIData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("EOI", data) : []),
    }),

    createEoi: builder.mutation<EOIResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) => (!error ? invalidateTags("EOI") : []),
    }),

    getEoi: builder.query<EOIResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("EOI", data) : []),
    }),

    updateEoi: builder.mutation<
      EOIResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("EOI", { ids: [path.id] }) : [],
    }),

    modifyEoi: builder.mutation<
      EOIResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("EOI", { ids: [path.id] }) : [],
    }),

    deleteEoi: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("EOI", { ids: [path.id] }) : [],
    }),
  }),
});

export default EoiAPI;
