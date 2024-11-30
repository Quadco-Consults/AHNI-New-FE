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
                url: "/auth/password/reset/",
                method: "POST",
                body,
            }),
        }),

        changePassword: builder.mutation<
            any,
            {
                email: string | null;
                otp: string;
                new_password: string;
                confirm_password: string;
            }
        >({
            query: (body) => ({
                url: "/auth/password/reset/confirm/",
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
