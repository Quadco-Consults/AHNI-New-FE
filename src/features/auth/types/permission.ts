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
    module?: string;
    description?: string;
}

export interface IRole {
    id: string;
    name: string;
    permissions: Permission[];
}

// Approval permission types
export interface ApprovalPermissions {
    can_review: boolean;
    can_authorize: boolean;
    can_approve: boolean;
}

// Helper function to extract approval permissions from role
export function getApprovalPermissions(role: IRole): ApprovalPermissions {
    const approvalModule = role.permissions.find(p => p.module === 'approvals');

    if (!approvalModule) {
        return {
            can_review: false,
            can_authorize: false,
            can_approve: false,
        };
    }

    return {
        can_review: approvalModule.permissions.some(p => p.codename === 'can_review'),
        can_authorize: approvalModule.permissions.some(p => p.codename === 'can_authorize'),
        can_approve: approvalModule.permissions.some(p => p.codename === 'can_approve'),
    };
}

// Helper to check if role has any approval permissions
export function hasAnyApprovalPermission(role: IRole): boolean {
    const permissions = getApprovalPermissions(role);
    return permissions.can_review || permissions.can_authorize || permissions.can_approve;
}
