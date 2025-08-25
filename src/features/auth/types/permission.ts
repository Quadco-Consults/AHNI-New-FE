import { z } from "zod";

export const RoleSchema = z.object({
    role_name: z.string().min(1, "Please enter a role name"),
});

export type TRoleFormValue = z.infer<typeof RoleSchema>;

export interface Permission {
    module: string;
    permissions: IPermission[];
}

export interface IPermission {
    id: number;
    name: string;
    codename: string;
}

export interface IRole {
    id: string;
    name: string;
    permissions: Permission[];
}
