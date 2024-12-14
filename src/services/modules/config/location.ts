import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TLocationData,
    TLocationFormValues,
} from "definations/modules/config/location";
import baseAPI from "services/index";

const LocationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllLocations: builder.query<
            TPaginatedResponse<TLocationData>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/locations/",
                params,
            }),
            providesTags: ["Locations"],
        }),

        getSingleLocation: builder.query<TResponse<TLocationData>, string>({
            query: (id) => ({
                method: "GET",
                url: `/config/locations/${id}/`,
            }),
        }),

        addLocation: builder.mutation<
            TResponse<TLocationData>,
            TLocationFormValues
        >({
            query: (body) => ({
                url: "/config/locations/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Locations"],
        }),

        updateLocation: builder.mutation<
            TResponse<TLocationData>,
            { id: string; body: TLocationFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/config/locations/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Locations"],
        }),

        deleteLocation: builder.mutation<TResponse<TLocationData>, string>({
            query: (id) => ({
                url: `/config/locations/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Locations"],
        }),
    }),
});

export const {
    useGetAllLocationsQuery,
    useGetSingleLocationQuery,
    useAddLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
} = LocationAPI;
