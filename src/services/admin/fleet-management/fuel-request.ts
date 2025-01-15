import {
    IFuelRequestPaginatedData,
    IFuelRequestSingleData,
    TFuelRequestFormValues,
} from "definations/admin/fleet-management/fuel-request";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = `/admins/fleets/fuel-consumptions/`;

const FuelRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createFuelRequest: builder.mutation<
            TResponse<IFuelRequestSingleData>,
            TFuelRequestFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["FUEL_REQUEST"],
        }),

        getAllFuelRequests: builder.query<
            TPaginatedResponse<IFuelRequestPaginatedData>,
            TRequest & { asset?: string }
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["FUEL_REQUEST"],
        }),

        getSingleFuelRequest: builder.query<
            TResponse<IFuelRequestSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["FUEL_REQUEST"],
        }),

        modifyFuelRequest: builder.mutation<
            TResponse<IFuelRequestSingleData>,
            { id: string; body: TFuelRequestFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["FUEL_REQUEST"],
        }),

        deleteFuelRequest: builder.mutation<
            TResponse<IFuelRequestSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["FUEL_REQUEST"],
        }),
    }),
});

export const {
    useCreateFuelRequestMutation,
    useGetAllFuelRequestsQuery,
    useGetSingleFuelRequestQuery,
    useModifyFuelRequestMutation,
    useDeleteFuelRequestMutation,
} = FuelRequestAPI;
