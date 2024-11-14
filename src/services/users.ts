import baseAPI from ".";
import { TBasePaginatedResponse, TRequest } from "definations/auth";
import {
    Permission,
    TCreateUser,
    TRole,
    TUpdateUser,
    TUser,
} from "definations/users";

const usersAPi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        roles: builder.query<TRole[], TRequest>({
            query: (params) => ({
                url: "/auth/roles/",
                params,
            }),
            providesTags: ["Roles"],
        }),
        createRole: builder.mutation<null, { name: string }>({
            query: (body) => ({
                url: "/auth/roles/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),
        permissions: builder.query<Permission[], TRequest>({
            query: (params) => ({
                url: "/auth/permissions/",
                params,
            }),
            providesTags: ["Permission"],
        }),
        createUser: builder.mutation<TUser, TCreateUser>({
            query: (body) => ({
                url: "/auth/users/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),
        updateUser: builder.mutation<
            TUser,
            {
                id: string;
                body: TUpdateUser;
            }
        >({
            query: ({ id, body }) => ({
                url: `/auth/users/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),
        getUser: builder.query<TBasePaginatedResponse<TUser[]>, TRequest>({
            query: (params) => ({
                url: "/auth/users/",
                params,
            }),
            providesTags: ["Users"],
        }),
        addUserRole: builder.mutation<
            any,
            {
                id: string;
                body: {
                    items: string[];
                };
            }
        >({
            query: ({ id, body }) => ({
                url: `/auth/users/${id}/assign_role/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
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
    }),
});

export const {
    useRolesQuery,
    useCreateRoleMutation,
    useCreateUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useAddUserRoleMutation,
    usePermissionsQuery,
    useLazyPermissionsQuery,
    useAddPermissionToRoleMutation,
} = usersAPi;
