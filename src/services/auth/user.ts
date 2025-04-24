import {
    IUser,
    TCreateUserFormValues,
    TUpdateUserFormValues,
} from "definations/auth/user";
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

const UserAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation<TResponse<IUser>, TCreateUserFormValues>({
            query: (body) => ({
                url: "/users/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),

        getAllUsers: builder.query<TPaginatedResponse<IUser>, TRequest>({
            query: (params) => ({
                url: "/users/",
                params,
            }),
            providesTags: ["Users"],
        }),

        getSingleUser: builder.query<TResponse<IUser>, null>({
            query: (id) => ({
                url: `/users/${id}/`,
            }),
        }),

        getUserProfile: builder.query<TResponse<IUser>, null>({
            query: () => ({
                method: "GET",
                url: `/users/profile/`,
            }),
        }),

        updateUser: builder.mutation<
            TResponse<IUser>,
            {
                id: string;
                body: TUpdateUserFormValues;
            }
        >({
            query: ({ id, body }) => ({
                url: `/users/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Users"],
        }),

        addUserToRole: builder.mutation<
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

        activateUser: builder.mutation<TResponse<IUser>, string>({
            query: (id) => ({
                method: "POST",
                url: `/users/${id}/activate/`,
            }),
            invalidatesTags: ["Users"],
        }),

        deactivateUser: builder.mutation<TResponse<IUser>, string>({
            query: (id) => ({
                method: "POST",
                url: `/users/${id}/deactivate/`,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useCreateUserMutation,
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useLazyGetSingleUserQuery,
    useGetUserProfileQuery,
    useUpdateUserMutation,
    useAddUserToRoleMutation,
    useActivateUserMutation,
    useDeactivateUserMutation,
} = UserAPI;
