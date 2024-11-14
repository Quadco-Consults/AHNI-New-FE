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
        verifyOTP: builder.mutation<any, { email: string; token: string }>({
            query: (body) => ({
                method: "POST",
                url: "/auth/verify-reset-token/",
                body,
            }),
        }),
        changePassword: builder.mutation<
            any,
            {
                email: string | null;
                token: string;
                new_password: string;
                confirm_password: string;
            }
        >({
            query: (body) => ({
                url: "/auth/reset_password/",
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
    useVerifyOTPMutation,
} = authAPi;
