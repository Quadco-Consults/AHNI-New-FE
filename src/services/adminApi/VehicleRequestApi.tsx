// VehicleRequestApi.tsx

import { TBasePaginatedRespose, TRequest } from "definations/auth";
import baseAPI from "..";
import { IVehicleRequest } from "components/Table/columns/vehicleRequest";
import { FuelRecordForm } from "pages/protectedPages/admin/FleetManagment/CreateFuelRecord";

export interface VehicleRequest {
  id?: string;
  supervisor: string;
  point_of_departure: string;
  destination: string;
  request_date: string;
  departure_date: string;
  return_date: string;
  status: "Pending" | "Approved" | "Rejected"; // Adjust status options as needed
  recommendations: string;
  approved_by: string;
  requesting_staff: string;
  location: string;
  team_members: string[];
}

export interface FuelRecord {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  odometer: number;
  distance_covered: number;
  price_per_liter: string;
  quantity: number;
  amount: string;
  vehicle: {
    id: string;
    implementer: {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
    };
    location: {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      address: string;
      city: string;
      state: string;
      email: string;
      phone: string;
    };
    asset_type: {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      manufacturer: string;
      model: string;
    };
    asset_condition: {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
    };
    created_at: string;
    updated_at: string;
    asset_code: string;
    serial_number: string;
    assignee: string;
    date_of_acquisition: string;
    state: string;
    estimated_life_span: string;
    classification: string;
    cost_in_usd: string;
    cost_in_ngn: string;
    unit: string;
  };
}

export const vehicleRequestApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createVehicleRequest: builder.mutation<
      VehicleRequest,
      Partial<VehicleRequest>
    >({
      query: (data) => ({
        url: "/admins/vehicle-requests/",
        method: "POST",
        body: data,
      }),
    }),

    getVehicleRequests: builder.query<
      TBasePaginatedRespose<IVehicleRequest[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/admins/vehicle-requests/",
        params,
      }),
      providesTags: ["VehicleRequest"],
    }),

    getOneVehicleRequests: builder.query<IVehicleRequest, TRequest>({
      query: (params) => ({
        url: `/admins/vehicle-requests/${params.id}`,
      }),
    }),

    updateVehicleRequest: builder.mutation<
      VehicleRequest,
      Partial<VehicleRequest> & Pick<VehicleRequest, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/admins/vehicle-requests/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["VehicleRequest"],
    }),

    deleteVehicleRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admins/vehicle-requests/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleRequest"],
    }),
    approveRequest: builder.mutation<
      void,
      {
        id: string;
        body: {
          vehicles: {
            vehicle: string;
            driver: string;
          }[];
          recommendations: string;
          status: string;
        };
      }
    >({
      query: ({ body, id }) => ({
        url: `/admins/vehicle-requests/${id}/approve_request/`,
        body,
        method: "POST",
      }),
    }),
    createVehicleFuelRecord: builder.mutation<
      VehicleRequest,
      Partial<FuelRecordForm>
    >({
      query: (data) => ({
        url: "/admins/fuel-consumptions/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FuelRecord"],
    }),
    getVehicleFuelRecord: builder.query<
      TBasePaginatedRespose<FuelRecord[]>,
      TRequest
    >({
      query: (params) => ({
        url: "/admins/fuel-consumptions/",
        params,
      }),
      providesTags: ["FuelRecord"],
    }),
    DeleteFuelRecord: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admins/fuel-consumptions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["FuelRecord"],
    }),
    getOneVehicleFuelRecord: builder.query<FuelRecord, TRequest>({
      query: (params) => ({
        url: `/admins/fuel-consumptions/${params.id}`,
      }),
      providesTags: ["FuelRecord"],
    }),
    updateVehicleFuelRecord: builder.mutation<
      VehicleRequest,
      Partial<VehicleRequest> & Pick<VehicleRequest, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/admins/fuel-consumptions/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["FuelRecord"],
    }),
  }),
});

export const {
  useCreateVehicleRequestMutation,
  useGetVehicleRequestsQuery,
  useUpdateVehicleRequestMutation,
  useDeleteVehicleRequestMutation,
  useApproveRequestMutation,
  useGetOneVehicleRequestsQuery,
  useCreateVehicleFuelRecordMutation,
  useGetVehicleFuelRecordQuery,
  useGetOneVehicleFuelRecordQuery,
  useDeleteFuelRecordMutation,
} = vehicleRequestApi;
