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
        addUserRole: builder.mutation<
            any,
            {
                id: string;
                body: {
                    roles: number[];
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
