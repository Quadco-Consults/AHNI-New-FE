/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from ".";
import { z } from "zod";
import {
  PartnerResultsData,
  PartnersData,
  PartnersResponse,
} from "definations/partners";
import { ProjectPartnerSchema } from "definations/validator";

const BASE_URL = "/projects/partners/";

const partnersAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<PartnersData, { params: {} }>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PARTNERS", data) : [],
    }),

    createPartner: builder.mutation<
      PartnersResponse,
      z.infer<typeof ProjectPartnerSchema>
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("PARTNERS") : [],
    }),

    getPartner: builder.query<PartnerResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("PARTNERS", data) : [],
    }),

    updatePartner: builder.mutation<
      PartnersResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PARTNERS", { ids: [path.id] }) : [],
    }),

    modifyPartner: builder.mutation<
      PartnersResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("PARTNERS", { ids: [path.id] }) : [],
    }),

    deletePartner: builder.mutation<PartnersResponse, { path: { id: string } }>(
      {
        query: ({ path }) => ({
          url: `${BASE_URL}${path.id}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { path }) =>
          !error ? invalidateTags("PARTNERS", { ids: [path.id] }) : [],
      }
    ),
  }),
});

export default partnersAPi;
