// VehicleRequestApi.tsx

import { TBasePaginatedRespose, TRequest } from "definations/auth";
import baseAPI from "..";
import { IVehicleRequest } from "components/Table/columns/vehicleRequest";

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
    }),

    deleteVehicleRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admins/vehicle-requests/${id}/`,
        method: "DELETE",
      }),
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
  }),
});

export const {
  useCreateVehicleRequestMutation,
  useGetVehicleRequestsQuery,
  useUpdateVehicleRequestMutation,
  useDeleteVehicleRequestMutation,
  useApproveRequestMutation,
  useGetOneVehicleRequestsQuery,
} = vehicleRequestApi;
