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

export interface TFacilityResponse<T> {
    id: string;
    name: string;
    state: string;
    local_govt: string;
    facility_contacts: T;
}

export type TFacilityResponseArray<T> = TFacilityResponse<T>[];

export interface TSupervisionCategoryResponse {
    id: string;
    code: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    serial_number: number;
    job_category: string;
}
export type TSupervisionCategoryResponseArray = TSupervisionCategoryResponse[];
