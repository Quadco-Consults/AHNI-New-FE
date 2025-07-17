import { LeaveRequest } from "definations/hr-types/leave-request";
import baseAPI from "..";

const BASE_URL = "hr/leave-request/";

const LeaveRequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveRequests: builder.query<
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

    getLeaveRequest: builder.query<LeaveRequest, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["LEAVE_REQUEST"],
    }),

    createLeaveRequest: builder.mutation<LeaveRequest, Partial<LeaveRequest>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LEAVE_REQUEST"],
    }),

    updateLeaveRequest: builder.mutation<
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

    patchLeaveRequest: builder.mutation<
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

export default LeaveRequestAPI;
