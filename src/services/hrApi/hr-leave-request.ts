import { LeaveRequest } from "definations/hr-types/leave-request";
import baseAPI from "..";

const BASE_URL = "hr/leave-request/";

const LeavePackageAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLeavePackages: builder.query<
      LeaveRequest[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["LEAVE_REQUEST"],
    }),

    getLeavePackage: builder.query<LeaveRequest, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["LEAVE_REQUEST"],
    }),

    createLeavePackage: builder.mutation<LeaveRequest, Partial<LeaveRequest>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LEAVE_REQUEST"],
    }),

    updateLeavePackage: builder.mutation<
      LeaveRequest,
      { id: string; body: Partial<LeaveRequest> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LEAVE_REQUEST"],
    }),

    patchLeavePackage: builder.mutation<
      LeaveRequest,
      { id: string; body: Partial<LeaveRequest> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LEAVE_REQUEST"],
    }),
  }),
});

export default LeavePackageAPI;
