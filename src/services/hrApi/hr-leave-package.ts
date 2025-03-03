import { LeavePackage } from "definations/hr-types/leave-package";
import baseAPI from "..";

const BASE_URL = "hr/leave-package/";

const LeavePackageAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLeavePackages: builder.query<
      LeavePackage[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["LEAVE_PACKAGE"],
    }),

    getLeavePackage: builder.query<LeavePackage, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["LEAVE_PACKAGE"],
    }),

    createLeavePackage: builder.mutation<LeavePackage, Partial<LeavePackage>>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LEAVE_PACKAGE"],
    }),

    updateLeavePackage: builder.mutation<
      LeavePackage,
      { id: string; body: Partial<LeavePackage> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LEAVE_PACKAGE"],
    }),

    patchLeavePackage: builder.mutation<
      LeavePackage,
      { id: string; body: Partial<LeavePackage> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LEAVE_PACKAGE"],
    }),
  }),
});

export default LeavePackageAPI;
