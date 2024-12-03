import { createColumnHelper } from "@tanstack/react-table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "components/ui/alert-dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Button } from "components/ui/button";

import { MoreHorizontal, Edit, RefreshCw, UserMinus } from "lucide-react";
import { TUser } from "definations/users";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import {
    DialogType,
    largeDailogScreen,
    mediumDailogScreen,
} from "constants/dailogs";
import { useState } from "react";
import {
    useActivateUserMutation,
    useDeactivateUserMutation,
} from "services/users";
import { toast } from "sonner";
import { Badge } from "components/ui/badge";

// Action handlers (implement these in your component)

// eslint-disable-next-line react-refresh/only-export-components
const ActionDropdown = ({
    id,
    first_name,
    last_name,
    mobile_number,
    designation,
    gender,
    email,
    is_active,
    roles,
    position,
}: TUser) => {
    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);

    const [activateUser, { isLoading: isActivateLoading }] =
        useActivateUserMutation();
    const [deactivateUser, { isLoading: isDeactivateLoading }] =
        useDeactivateUserMutation();

    const handleEdit = (id: string) => {
        dispatch(
            openDialog({
                type: DialogType.EditUser,
                dialogProps: {
                    ...mediumDailogScreen,
                    header: "Edit User",
                    data: JSON.stringify({
                        id,
                        first_name,
                        last_name,
                        mobile_number,
                        designation,
                        gender,
                        email,
                        position,
                    }),
                },
            })
        );
    };

    const handleUpdate = (id: string) => {
        dispatch(
            openDialog({
                type: DialogType.AssingRoleToUser,
                dialogProps: {
                    ...largeDailogScreen,
                    id,
                    roles: roles as unknown as string,
                },
            })
        );
    };

    const handleDeactivate = async () => {
        try {
            is_active
                ? await deactivateUser(id).unwrap()
                : await activateUser(id).unwrap();

            toast.success("Action Successful");
        } catch (error: any) {
            toast.error(error.data.message);
        } finally {
            setDialogOpen(false);
        }
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer "
                        onClick={() => handleEdit(id)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        <span>Edit User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer "
                        onClick={() => handleUpdate(id)}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span>Update Role</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setDialogOpen(true)}
                    >
                        <UserMinus className="w-4 h-4 mr-2" />
                        <span>
                            {is_active ? "Deactivate User" : "Activate User"}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={dialogOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you certain you want to perform this action?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible, but you will have the
                            option to reactivate/deactivate them later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeactivate}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const columnHelper = createColumnHelper<TUser>();

export const userColums = [
    columnHelper.accessor("fullName", {
        header: "Full Name",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("mobile_number", {
        header: "Phone Number",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("position", {
        header: "Position",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("roles", {
        header: "Roles",
        cell: (info) =>
            info
                .getValue()
                .map((role) => role)
                .join(", "),
    }),

    columnHelper.accessor("is_active", {
        header: "Status",
        cell: (info) =>
            info.getValue() ? (
                <Badge className="bg-green-500">Activated</Badge>
            ) : (
                <Badge className="bg-red-500">Deactivated</Badge>
            ),
    }),

    columnHelper.accessor("actions", {
        header: "",
        cell: ({ row }) => <ActionDropdown {...row.original} />, // This represents the actions column with the three dots
    }),
];

// const permissionHelper = createColumnHelper<Permission>();

// export const permissionColums = [
//     permissionHelper.accessor("name", {
//         header: "Name",
//         cell: (info) => info.getValue(),
//     }),
//     permissionHelper.accessor("module", {
//         header: "Module",
//         cell: (info) => info.getValue(),
//     }),
//     permissionHelper.accessor("codename", {
//         header: "Code Name",
//         cell: (info) => info.getValue(),
//     }),
// ];
