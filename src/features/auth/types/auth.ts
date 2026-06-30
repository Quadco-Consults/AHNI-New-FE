import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(1, "Please enter your email"),
    password: z.string().min(1, "Please enter your password"),
});

export type TLoginFormValues = z.infer<typeof LoginSchema>;

export interface IEmployee {
    department?: IDepartment;
    position?: IPosition;
    location?: ILocation;
    supervisor?: IUser;
    data_access_level?: 'own' | 'department' | 'location' | 'global';
    employment_type?: 'full_time' | 'part_time' | 'contract' | 'consultant';
    join_date?: string;
}

export interface IUser {
    id: string;
    username?: string;
    first_name: string;
    last_name: string;
    email: string;
    last_login: string;
    date_joined?: string;
    user_type?: string;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    groups?: any[];
    user_permissions?: any[];
    // Organizational structure fields (from backend)
    employee_id?: string;
    employee?: IEmployee; // New nested employee structure
    department?: IDepartment;
    position?: IPosition;
    role?: IRole;
    location?: ILocation;
    supervisor?: IUser;
    data_access_level?: 'own' | 'department' | 'location' | 'global';
    employment_type?: 'full_time' | 'part_time' | 'contract' | 'consultant';
    join_date?: string;
    profile_picture?: string;
    phone?: string;
    bio?: string;
    // Permission fields
    roles?: IRole[];
    permissions?: IPermission[];
}

export interface IDepartment {
    id: string;
    name: string;
    code: string;
    description?: string;
    color_code?: string;
    icon_name?: string;
}

export interface IPosition {
    id: string;
    title: string;
    code: string;
    level: 'intern' | 'junior' | 'staff' | 'senior_staff' | 'manager' | 'director' | 'executive';
    department?: IDepartment;
    can_approve: boolean;
    can_authorize: boolean;
    financial_approval_limit?: number;
}

export interface ILocation {
    id: string;
    name: string;
    code: string;
    type: 'headquarters' | 'country_office' | 'field_office' | 'remote';
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
}

export interface IRole {
    id: string;
    name: string;
    code: string;
    department?: IDepartment;
    position_level?: string;
    is_system_role?: boolean;
    is_leadership_role?: boolean;
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
    isAuthenticated: boolean;
    loading: boolean;
    user: IUser;
    permissions?: IPermission[]; // Permissions can be at root level
    roles?: IRole[]; // Roles can also be at root level
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
        pagination: {
            count: number;
            page_size: number;
            page: number;
            total_pages: number;
            next: string | null;
            previous: string | null;
            next_page_number: number | null;
            previous_page_number: number | null;
        };
    };
    status: boolean;
    message: string;
}
