/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import { z } from "zod";
import {
  UsersData,
  UsersResponse,
  UsersResultsData,
  UsersSchema,
} from "definations/users";
import baseAPI from ".";

const BASE_URL = "/auth/users/";

const usersAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("USERS", data) : []),
    }),

    createUser: builder.mutation<UsersResponse, z.infer<typeof UsersSchema>>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("USERS") : [],
    }),

    createUserRole: builder.mutation<
      UsersResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/assign_role/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error, {}) =>
        !error ? invalidateTags("USERS") : [],
    }),

    getUser: builder.query<UsersResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: (data, error) => (!error ? provideTags("USERS", data) : []),
    }),

    updateUser: builder.mutation<
      UsersResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("USERS", { ids: [path.id] }) : [],
    }),

    modifyUser: builder.mutation<
      UsersResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("USERS", { ids: [path.id] }) : [],
    }),

    deleteUser: builder.mutation<UsersResponse, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, { path }) =>
        !error ? invalidateTags("USERS", { ids: [path.id] }) : [],
    }),
  }),
});

export default usersAPI;
