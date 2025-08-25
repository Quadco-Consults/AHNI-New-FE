import FormButton from "@/components/FormButton";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { ScrollArea } from "components/ui/scroll-area";
import { IPermission } from "definations/auth/permission";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import { capitalize } from "lodash";
import { FC, useEffect, useState } from "react";
import {
    useGetAllPermissions,
    useGetSingleRole,
    useUpdateRole,
} from "@/features/auth/controllers/roleController";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";

interface Permission {
    id: number;
    name: string;
    codename: string;
    module: string;
}

type TPermissionSelector = {
    selectedPermissions: number[];
    onSelectPermission: (permissionId: number) => void;
    onCheckAllPermissions: () => void;
};

const PermissionCheckbox: FC<{
    permission: IPermission;
    checked: boolean;

    // eslint-disable-next-line no-unused-vars
    onChange: (checked: boolean) => void;
}> = ({ permission, checked, onChange }) => {
    return (
        <div
            className={cn(
                "flex items-center space-x-2 rounded-md border px-2 py-3 cursor-pointer",
                checked
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
            )}
            onClick={() => onChange(!checked)}
        >
            <Checkbox
                checked={checked}
                className={cn(
                    "h-4 w-4 rounded-sm border-2",
                    checked ? "border-red-500 bg-red-500" : "border-gray-300"
                )}
            />
            <span className="text-xs font-medium">{permission.name}</span>
        </div>
    );
};

const PermissionSelector: FC<TPermissionSelector> = ({
    selectedPermissions,
    onSelectPermission,
    onCheckAllPermissions,
}) => {
    const { data: permission, isLoading } = useGetAllPermissions({
        page: 1,
        size: 2000000,
        search: "",
    });

    const handleCheckAllPermissions = (module: string, checked: boolean) => {
        const modulePermission = permission?.data.find(
            (permission) => permission.module === module
        )?.permissions;

        const modulePermissionIds = modulePermission?.map(
            (permission) => permission.id
        );

        if (checked) {
            // @ts-ignore
            onCheckAllPermissions([
                // @ts-ignore
                ...selectedPermissions,
                // @ts-ignore
                ...modulePermissionIds,
            ]);
        } else {
            const deletedPermissions = selectedPermissions.filter(
                (permission) => !modulePermissionIds?.includes(permission)
            );

            console.log(deletedPermissions);

            // @ts-ignore
            onCheckAllPermissions(deletedPermissions);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    if (permission?.data?.length === 0)
        return (
            <div className="flex flex-col items-center gap-2.5">
                <EmptyTodoIcon />
                <h3 className="font-bold text-md">No permissions found.</h3>
            </div>
        );

    return (
        <>
            {permission?.data?.map((permission) => (
                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">
                            {capitalize(permission.module)}
                        </h3>

                        <div className="space-x-1 mr-3">
                            <label className="text-sm text-gray-500">
                                Select all
                            </label>
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    handleCheckAllPermissions(
                                        permission.module,
                                        e.target.checked
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 pb-10 mt-1.5">
                        {permission?.permissions?.map((item) => (
                            <PermissionCheckbox
                                key={item.id}
                                permission={item}
                                checked={selectedPermissions.includes(item.id)}
                                onChange={() => onSelectPermission(item.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

const AssignPermission = () => {
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        []
    );

    const { dialogProps } = useAppSelector(dailogSelector);

    const dispatch = useAppDispatch();

    const roleId = dialogProps?.id as string;
    const roleName = dialogProps?.name as string;

    const { updateRole, isLoading } = useUpdateRole(roleId);
    const { data: role } = useGetSingleRole(roleId, !!roleId);

    useEffect(() => {
        const prevPermissions = role?.data?.permissions
            ?.map((permission) => permission)
            .map((item) =>
                item.permissions.map((_permission) => _permission.id)
            );

        if (prevPermissions) {
            setSelectedPermissions([...prevPermissions.flat()]);
        }
    }, [role]);

    const handleSelectPermission = (permissionId: number) => {
        const isSelected = selectedPermissions.indexOf(permissionId);

        if (isSelected > -1) {
            setSelectedPermissions(
                selectedPermissions.filter(
                    (permission) => permission !== permissionId
                )
            );
            return;
        }

        setSelectedPermissions([...selectedPermissions, permissionId]);
    };

    const onSubmit = async () => {
        try {
            await updateRole({ 
                name: roleName, 
                permissions: selectedPermissions 
            });
            dispatch(closeDialog());
            toast.success("Permission added successfully");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center w-full py-7">
                <div className="w-full space-y-7">
                    <div className="flex justify-center">
                        <img
                            src="/imgs/logo.png"
                            alt="logo"
                            className="text-center"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-center ">
                        Permissions
                    </h2>
                </div>
            </div>
            <Card className="w-full mx-auto min-h-56">
                <CardContent className="w-full p-4">
                    <ScrollArea className="h-[50vh]">
                        <PermissionSelector
                            selectedPermissions={selectedPermissions}
                            onSelectPermission={handleSelectPermission}
                            // @ts-ignore
                            onCheckAllPermissions={(permissions: number[]) =>
                                setSelectedPermissions(permissions)
                            }
                        />
                    </ScrollArea>
                </CardContent>
            </Card>
            <div className="flex items-center justify-end gap-4 mt-7 px-7">
                <Button
                    variant="outline"
                    onClick={() => dispatch(closeDialog())}
                >
                    Cancel
                </Button>
                <FormButton onClick={() => onSubmit()} loading={isLoading}>
                    Save & Continue
                </FormButton>
            </div>
        </div>
    );
};

export default AssignPermission;
