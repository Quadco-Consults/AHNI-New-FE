/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import {
  CbaApprovalSchema,
  CbaSchema,
} from "definations/procurement-validator";
import {
  CbaData,
  CbaResponse,
  CbaResultsData,
  CbaSubmitPayload,
} from "definations/procurement-types/cba";

const BASE_URL = "/procurement/cba/";

const CbaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCbaList: builder.query<CbaData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["CBA"],
    }),

    createCba: builder.mutation<CbaResponse, z.infer<typeof CbaSchema>>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CBA"],
    }),

    createSubmitCba: builder.mutation<
      CbaResponse,
      { path: { id: string }; body: CbaSubmitPayload }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/submit/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CBA"],
    }),

    createApprovalCba: builder.mutation<
      CbaResponse,
      { path: { id: string }; body: z.infer<typeof CbaApprovalSchema> }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/approve/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CBA"],
    }),

    getCba: builder.query<CbaResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["CBA"],
    }),

    updateCba: builder.mutation<
      CbaResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CBA"],
    }),

    modifyCba: builder.mutation<
      CbaResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CBA"],
    }),

    deleteCba: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CBA"],
    }),
  }),
});

export default CbaAPI;
