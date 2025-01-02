import {
    IVehicleRequestPaginatedData,
    IVehicleSingleData,
    TVehicleRequestFormValues,
} from "definations/admin/fleet-management/vehicle-request";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = `/admins/fleets/vehicles/requests/`;

const VehicleRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createVehicleRequest: builder.mutation<
            TResponse<IVehicleSingleData>,
            TVehicleRequestFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
        }),

        getAllVehicleRequest: builder.query<
            TPaginatedResponse<IVehicleRequestPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
        }),

        getSingleVehicleRequest: builder.query<
            TResponse<IVehicleSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        editVehicleRequest: builder.mutation<
            TResponse<IVehicleSingleData>,
            { id: string; body: TVehicleRequestFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}`,
                body,
            }),
        }),

        deleteVehicleRequest: builder.mutation<
            TResponse<IVehicleSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
        }),
    }),
});

export const {
    useCreateVehicleRequestMutation,
    useGetAllVehicleRequestQuery,
    useGetSingleVehicleRequestQuery,
    useEditVehicleRequestMutation,
    useDeleteVehicleRequestMutation,
} = VehicleRequestAPI;

// create validation tags
