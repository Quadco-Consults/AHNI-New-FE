import baseAPI from ".";
import {
  LoginResponse,
  TBasePaginatedRespose,
  TRequest,
} from "definations/auth";
import { TCreateUser, TUser } from "definations/users";

const usersAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    roles: builder.query<LoginResponse, TRequest>({
      query: (params) => ({
        url: "/auth/roles/",
        params,
      }),
    }),
    createUser: builder.mutation<TUser, TCreateUser>({
      query: (body) => ({
        url: "/auth/users/",
        method: "POST",
        body: body,
      }),
    }),
    updateUser: builder.mutation<
      TUser,
      {
        id: string;
        body: TCreateUser;
      }
    >({
      query: ({ id, body }) => ({
        url: `/auth/users/${id}/`,
        method: "PATCH",
        body: body,
      }),
    }),
    getUser: builder.query<TBasePaginatedRespose<TUser[]>, TRequest>({
      query: (params) => ({
        url: "/auth/users/",
        params,
      }),
    }),
  }),
});

export const {
  useRolesQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = usersAPi;
