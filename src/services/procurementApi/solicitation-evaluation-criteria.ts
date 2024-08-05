/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import {
  SolicitationCriteriaData,
  SolicitationCriteriaResultsData,
} from "definations/procurement-types/solicitation-criteria";

const BASE_URL = "/procurement/solicitation-evaluation-criteria/";

const SolicitationCriteriaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSolicitationCriteriaList: builder.query<
      SolicitationCriteriaResultsData[],
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["SOLICITATION_CRITERIA"],
    }),

    // createSolicitation: builder.mutation<
    //   SolicitationResponse,
    //   z.infer<typeof SolicitationSchema>
    // >({
    //   query: (body) => ({
    //     url: `${BASE_URL}`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["SOLICITATION"],
    // }),

    // getSolicitation: builder.query<
    //   SolicitationResultsData,
    //   { path: { id: string } }
    // >({
    //   query: ({ path }) => {
    //     return {
    //       url: `${BASE_URL}${path.id}/`,
    //     };
    //   },
    //   providesTags: ["SOLICITATION"],
    // }),

    // updateSolicitation: builder.mutation<
    //   SolicitationResponse,
    //   { path: { id: string }; body: any }
    // >({
    //   query: ({ path, body }) => ({
    //     url: `${BASE_URL}${path.id}/`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["SOLICITATION"],
    // }),

    // modifySolicitation: builder.mutation<
    //   SolicitationResponse,
    //   { path: { id: string }; body: any }
    // >({
    //   query: ({ path, body }) => ({
    //     url: `${BASE_URL}${path.id}/`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["SOLICITATION"],
    // }),

    // deleteSolicitation: builder.mutation<void, { path: { id: string } }>({
    //   query: ({ path }) => ({
    //     url: `${BASE_URL}${path.id}/`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["SOLICITATION"],
    // }),
  }),
});

export default SolicitationCriteriaAPI;
