import { z } from "zod";
import baseAPI from ".";
import { LoginResponse, loginSchema } from "definations/auth";

const authAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, z.infer<typeof loginSchema>>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot_password/",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      any,
      {
        old_password: string;
        new_password: string;
        confirm_new_password: string;
      }
    >({
      query: (body) => ({
        url: "/auth/change_password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
} = authAPi;
