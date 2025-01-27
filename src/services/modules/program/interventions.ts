import baseAPI from "services/index";

import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TInterventionAreaData,
  TInterventionAreaFormValues,
} from "definations/modules/program/intervention-area";

const BASE_URL = "/procurements/intervention-areas/";

const InterventionAreaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllInterventionArea: builder.query<
      TPaginatedResponse<TInterventionAreaData>,
      TRequest
    >({
      query: (params) => ({
        url: `${BASE_URL}`,
        params,
      }),
      providesTags: ["InterventionArea"],
    }),

    addInterventionArea: builder.mutation<
      TResponse<TInterventionAreaData>,
      TInterventionAreaFormValues
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["InterventionArea"],
    }),

    updateInterventionArea: builder.mutation<
      TResponse<TInterventionAreaData>,
      { id: string; body: TInterventionAreaFormValues }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["InterventionArea"],
    }),

    deleteInterventionArea: builder.mutation<
      TResponse<TInterventionAreaData>,
      string
    >({
      query: (id) => ({
        url: `${BASE_URL}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InterventionArea"],
    }),
  }),
});

export const {
  useGetAllInterventionAreaQuery,
  useAddInterventionAreaMutation,
  useUpdateInterventionAreaMutation,
  useDeleteInterventionAreaMutation,
} = InterventionAreaAPI;
