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
    user_type?: string;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    // Updated to match our backend response structure
    roles: IRole[];
    permissions: IPermission[];
}

export interface IRole {
    id: string;
    name: string;
}

export interface IPermission {
    module: string;
    permissions: IPermissionDetail[];
}

export interface IPermissionDetail {
    id: number;
    name: string;
    codename: string;
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

// Base paginated response type
export interface TBasePaginatedResponse<T> {
    data: {
        results: T[];
        paginator: {
            count: number;
            page_size: number;
            page?: number;
            next?: string | null;
            previous?: string | null;
        };
    };
    status: boolean;
    message: string;
}
