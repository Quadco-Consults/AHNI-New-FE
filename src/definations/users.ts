import { z } from "zod";

export const userSchema = z
    .object({
        first_name: z.string().min(1, "Please enter first name"),
        last_name: z.string().min(1, "Please enter last name"),
        email: z
            .string()
            .min(1, "Please enter an email")
            .email("Email is not valid"),
        last_login: z.string().datetime().optional(),
        mobile_number: z.string().min(1, "Please enter a mobile number"),
        gender: z.enum(["MALE", "FEMALE", "Other"]),
        password: z.string().min(1, "Please enter a password").optional(),
        department: z.string().min(1, "Please select a department"),
        position: z.string().min(1, "Please select position"),
        confirm_password: z
            .string()
            .min(1, "Please enter a password")
            .optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });

export const updateUserSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    last_login: z.string().datetime().optional(),
    phone_number: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
    department: z.string(),
});

export type TCreateUser = z.infer<typeof userSchema>;
export type TUpdateUser = z.infer<typeof updateUserSchema>;
interface Role {
    id: string;
    name: string;
}

export interface Permission {
    module: string;
    permissions: TPermission[];
}

export interface TPermission {
    id: number;
    name: string;
    codename: string;
}

export interface TUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    last_login: string;
    roles: Role[];
    permissions: Permission[];
    mobile_number: string;
    gender: "MALE" | "FEMALE" | "Other";
    designation: string;
    fullName: string;
    action: string;
    department: string;
    position: string;
    actions: string;
    is_active: boolean;
}

export interface TRole {
    id: string;
    name: string;
    permissions: Permission[];
}
