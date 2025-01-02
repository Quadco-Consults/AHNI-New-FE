import baseAPI from "..";
import { TResponse } from "definations/index";
import { ILoginData, TLoginFormValues } from "definations/auth/auth";

const AuthAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TResponse<ILoginData>, TLoginFormValues>({
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
} = AuthAPI;
