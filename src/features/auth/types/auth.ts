import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(1, "Please enter your email"),
    password: z.string().min(1, "Please enter your password"),
});

export type TLoginFormValues = z.infer<typeof LoginSchema>;

export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    last_login: string;
    roles: string[];
    permissions: string[];
}

export interface ILoginData {
    access_token: string;
    refresh_token: string;
    user: IUser;
}

export const ChangePasswordSchema = z
    .object({
        new_password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .trim()
            .regex(
                /[@$!%*?&]/,
                "Password must contain at least one special character"
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase character"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirm_password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .trim()
            .regex(
                /[@$!%*?&]/,
                "Password must contain at least one special character"
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase character"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"], // path of error
    });

export type TChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
