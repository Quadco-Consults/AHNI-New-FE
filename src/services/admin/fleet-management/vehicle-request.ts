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
            invalidatesTags: ["VEHICLE_REQUEST"],
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
            providesTags: ["VEHICLE_REQUEST"],
        }),

        getSingleVehicleRequest: builder.query<
            TResponse<IVehicleSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["VEHICLE_REQUEST"],
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
            invalidatesTags: ["VEHICLE_REQUEST"],
        }),

        deleteVehicleRequest: builder.mutation<
            TResponse<IVehicleSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["VEHICLE_REQUEST"],
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
