import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TFacilityData,
    TFacilityFormValues,
} from "definations/modules/program/facility";
import { FacilityData } from "definations/program-types/facilities";
import baseAPI from "services/index";

const FacilityAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllFacility: builder.query<
            TPaginatedResponse<TFacilityData>,
            TRequest
        >({
            query: (params) => ({
                url: "/programs/facility/",
                params,
            }),
            providesTags: ["Facilities"],
        }),

        getSingleFacility: builder.query<TResponse<FacilityData>, string>({
            query: (id) => ({
                method: "GET",
                url: `/programs/facility/${id}`,
            }),
        }),

        addFacility: builder.mutation<
            TResponse<FacilityData>,
            TFacilityFormValues
        >({
            query: (body) => ({
                url: "/programs/facility/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Facilities"],
        }),

        updateFacility: builder.mutation<
            TResponse<FacilityData>,
            { id: string; body: TFacilityFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/programs/facility/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Facilities"],
        }),

        deleteFacility: builder.mutation<TResponse<FacilityData>, string>({
            query: (id) => ({
                url: `/programs/facility/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facilities"],
        }),
    }),
});

export const {
    useGetAllFacilityQuery,
    useGetSingleFacilityQuery,
    useAddFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
} = FacilityAPI;
