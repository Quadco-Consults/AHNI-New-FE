import {
    IFacilityMaintenancePaginatedData,
    IFacilityMaintenanceSingleData,
    TFacilityMaintenanceFormValues,
} from "definations/admin/facility-management/facility-maintenance";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const BASE_URL = `/admins/facilities/maintenance/tickets/`;

const FacilityMaintenanceAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createFacilityMaintenance: builder.mutation<
            TResponse<IFacilityMaintenanceSingleData>,
            TFacilityMaintenanceFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["FACILITY_MAINTENANCE"],
        }),

        getAllFacilityMaintenance: builder.query<
            TPaginatedResponse<IFacilityMaintenancePaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["FACILITY_MAINTENANCE"],
        }),

        getSingleFacilityMaintenance: builder.query<
            TResponse<IFacilityMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["FACILITY_MAINTENANCE"],
        }),

        modifyFacilityMaintenance: builder.mutation<
            TResponse<IFacilityMaintenanceSingleData>,
            { id: string; body: TFacilityMaintenanceFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}`,
                body,
            }),
            invalidatesTags: ["FACILITY_MAINTENANCE"],
        }),

        deleteFacilityMaintenance: builder.mutation<
            TResponse<IFacilityMaintenanceSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["FACILITY_MAINTENANCE"],
        }),
    }),
});

export const {
    useCreateFacilityMaintenanceMutation,
    useGetAllFacilityMaintenanceQuery,
    useGetSingleFacilityMaintenanceQuery,
    useModifyFacilityMaintenanceMutation,
    useDeleteFacilityMaintenanceMutation,
} = FacilityMaintenanceAPI;
