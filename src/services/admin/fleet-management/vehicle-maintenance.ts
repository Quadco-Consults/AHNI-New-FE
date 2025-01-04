import {
    IVehicleMaintenancePaginatedData,
    IVehicleMaintenanceSingleData,
    TVehicleMaintenanceFormValues,
} from "definations/admin/fleet-management/vehicle-maintenance";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = `/admins/fleets/vehicles/maintenance/tickets/`;

const VehicleMaintenanceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createVehicleMaintenance: builder.mutation<
            TResponse<IVehicleMaintenanceSingleData>,
            TVehicleMaintenanceFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["VEHICLE_MAINTENANCE"],
        }),

        getAllVehicleMaintenance: builder.query<
            TPaginatedResponse<IVehicleMaintenancePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),

            providesTags: ["VEHICLE_MAINTENANCE"],
        }),

        getSingleVehicleMaintenance: builder.query<
            TResponse<IVehicleMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),

            providesTags: ["VEHICLE_MAINTENANCE"],
        }),

        editVehicleMaintenance: builder.mutation<
            TResponse<IVehicleMaintenanceSingleData>,
            { id: string; body: TVehicleMaintenanceFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["VEHICLE_MAINTENANCE"],
        }),

        deleteVehicleMaintenance: builder.mutation<
            TResponse<IVehicleMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["VEHICLE_MAINTENANCE"],
        }),
    }),
});

export const {
    useCreateVehicleMaintenanceMutation,
    useGetAllVehicleMaintenanceQuery,
    useGetSingleVehicleMaintenanceQuery,
    useEditVehicleMaintenanceMutation,
    useDeleteVehicleMaintenanceMutation,
} = VehicleMaintenanceAPI;
