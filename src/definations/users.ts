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
        password: z.string().min(1, "Please enter a password"),
        confirm_password: z.string().min(1, "Please enter a password"),
        // designation: z.string(),
        // password: z.string(),
        // confirm_password: z.string(),
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
    password: z.string().min(1, "Please enter a password"),
    confirm_password: z.string().min(1, "Please enter a password"),
});

export type TCreateUser = z.infer<typeof userSchema>;
export type TUpdateUser = z.infer<typeof updateUserSchema>;
interface Role {
    id: number;
    name: string;
}

export interface Permission {
    id: number;
    name: string;
    codename: string;
    module: string;
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
    gender: "Male" | "Female" | "Other";
    designation: string;
    fullName: string;
    action: string;
    department: string;
    position: string;
    actions: string; //
}

export interface TRole {
    id: number;
    name: string;
    permissions: Permission[];
}
