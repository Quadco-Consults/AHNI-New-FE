import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email().min(1, "Please enter your email"),
    password: z.string().min(1, "Please enter your password"),
});

export type LoginData = {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        last_login: string;
        roles: string[];
        permissions: string[];
    };
};

export interface LoginResponse {
    message: string;
    data: LoginData;
}

