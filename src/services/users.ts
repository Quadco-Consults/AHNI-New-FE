import baseAPI from ".";
import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import { Permission, TCreateUser, TRole, TUser } from "definations/users";

interface TRolePermission {
    id: string;
    name: string;
    permissions: {
        module: string;
        permissions: { codename: string; id: number; name: string }[];
    }[];
}

const usersAPi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<TResponse<TUser>, null>({
            query: () => ({
                method: "GET",
                url: `/users/profile/`,
            }),
        }),

        roles: builder.query<TBasePaginatedResponse<TRole>, TRequest>({
            query: (params) => ({
                url: "/roles/",
                params,
            }),
            providesTags: ["Roles"],
        }),

        createRole: builder.mutation<null, { name: string }>({
            query: (body) => ({
                url: "/roles/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        getSingleRole: builder.query<TResponse<TRolePermission>, string>({
            query: (roleId) => ({
                method: "GET",
                url: `/roles/${roleId}/`,
            }),
        }),

        permissions: builder.query<
            { status: string; message: string; data: Permission[] },
            TRequest
        >({
            query: (params) => ({
                url: "/permissions/",
                params,
            }),
            providesTags: ["Permission"],
        }),

        getRolePermissions: builder.query<
            { status: string; message: string; data: Permission[] },
            string
        >({
            query: (id) => ({
                url: `/permissions/${id}/`,
            }),
        }),

        createUser: builder.mutation<TUser, TCreateUser>({
            query: (body) => ({
                url: "/users/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),
        updateUser: builder.mutation<
            TUser,
            {
                id: string;
                body: TUser;
            }
        >({
            query: ({ id, body }) => ({
                url: `/users/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),

        getUser: builder.query<TBasePaginatedResponse<TUser>, TRequest>({
            query: (params) => ({
                url: "/users/",
                params,
            }),
            providesTags: ["Users"],
        }),

        getSingleUser: builder.query<
            { status: string; message: string; data: TUser },
            string
        >({
            query: (id) => ({
                url: `/users/${id}/`,
            }),
        }),

        addUserRole: builder.mutation<
            any,
            {
                id: string;
                body: {
                    roles: string[];
                };
            }
        >({
            query: ({ id, body }) => ({
                url: `/users/${id}/roles/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
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

        activateUser: builder.mutation<TUser, string>({
            query: (id) => ({
                method: "POST",
                url: `/users/${id}/activate/`,
            }),
            invalidatesTags: ["Users"],
        }),

        deactivateUser: builder.mutation<TUser, string>({
            query: (id) => ({
                method: "POST",
                url: `/users/${id}/deactivate/`,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useRolesQuery,
    useCreateRoleMutation,
    useGetSingleRoleQuery,
    useCreateUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useAddUserRoleMutation,
    usePermissionsQuery,
    useLazyPermissionsQuery,
    useAddPermissionToRoleMutation,
    useGetSingleUserQuery,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useUpdateRoleMutation,
    useGetRolePermissionsQuery,
} = usersAPi;
