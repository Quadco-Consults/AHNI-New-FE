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
  }),
});

export const { useLoginMutation } = authAPi;
