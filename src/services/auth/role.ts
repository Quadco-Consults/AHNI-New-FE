import { IRole, Permission } from "definations/auth/permission";
import baseAPI from "..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

interface TRolePermission {
    id: string;
    name: string;
    permissions: {
        module: string;
        permissions: { codename: string; id: number; name: string }[];
    }[];
}

const PermissionAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createRole: builder.mutation<TResponse<IRole>, { name: string }>({
            query: (body) => ({
                url: "/roles/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        getAllRoles: builder.query<TPaginatedResponse<IRole>, TRequest>({
            query: (params) => ({
                url: "/roles/",
                params,
            }),
            providesTags: ["Roles"],
        }),

        getSingleRole: builder.query<TResponse<TRolePermission>, string>({
            query: (roleId) => ({
                method: "GET",
                url: `/roles/${roleId}/`,
            }),
        }),

        getAllPermissions: builder.query<TResponse<Permission[]>, TRequest>({
            query: (params) => ({
                url: "/permissions/",
                params,
            }),
            providesTags: ["Permission"],
        }),

        getPermissionsByRole: builder.query<TResponse<Permission[]>, string>({
            query: (id) => ({
                url: `/permissions/${id}/`,
            }),
        }),

        updateRole: builder.mutation<
            null,
            {
                roleId: string;
                body: { name: string; permissions: number[] };
            }
        >({
            query: ({ roleId, body }) => ({
                url: `/roles/${roleId}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        addPermissionToRole: builder.mutation<
            any,
            {
                id: string;
                body: {
                    items: string[];
                };
            }
        >({
            query: ({ id, body }) => ({
                url: `/auth/roles/${id}/assign_permission/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Permission"],
        }),

        deleteRole: builder.mutation<null, string>({
            query: (id) => ({
                url: `/roles/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),
    }),
});

export const {
    useCreateRoleMutation,
    useGetAllRolesQuery,
    useGetSingleRoleQuery,
    useGetAllPermissionsQuery,
    useGetPermissionsByRoleQuery,
    useUpdateRoleMutation,
    useAddPermissionToRoleMutation,
    useDeleteRoleMutation,
} = PermissionAPI;
