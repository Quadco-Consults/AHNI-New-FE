import FormButton from "@/components/FormButton";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { ScrollArea } from "components/ui/scroll-area";
import { Input } from "components/ui/input";
import { IPermission } from "definations/auth/permission";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import { capitalize } from "lodash";
import { FC, useEffect, useState, useMemo } from "react";
import {
    useGetAllPermissions,
    useGetSingleRole,
    useUpdateRole,
} from "@/features/auth/controllers/roleController";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";
import { ShieldCheck, Info, Search } from "lucide-react";

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
    highlighted?: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: (checked: boolean) => void;
}> = ({ permission, checked, onChange, highlighted = false }) => {
    return (
        <div
            className={cn(
                "flex items-center space-x-2 rounded-md border px-2 py-3 cursor-pointer transition-colors",
                highlighted
                    ? checked
                        ? "border-blue-500 bg-blue-50"
                        : "border-blue-200 bg-blue-25 hover:bg-blue-50"
                    : checked
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
            )}
            onClick={() => onChange(!checked)}
        >
            <Checkbox
                checked={checked}
                className={cn(
                    "h-4 w-4 rounded-sm border-2",
                    highlighted
                        ? checked ? "border-blue-500 bg-blue-500" : "border-blue-300"
                        : checked ? "border-red-500 bg-red-500" : "border-gray-300"
                )}
            />
            <span className="text-xs font-medium">{permission.name}</span>
        </div>
    );
};

// Special section for approval permissions
const ApprovalPermissionsSection: FC<{
    approvalPermissions: IPermission[];
    selectedPermissions: number[];
    onSelectPermission: (permissionId: number) => void;
}> = ({ approvalPermissions, selectedPermissions, onSelectPermission }) => {
    if (approvalPermissions.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-xl text-blue-900">
                    Approval Permissions
                </h3>
            </div>
            <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                    These permissions control who can review, authorize, and approve requests across the entire system.
                    Users with these permissions will appear in approval workflow dropdowns.
                </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {approvalPermissions.map((permission) => (
                    <PermissionCheckbox
                        key={permission.id}
                        permission={permission}
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => onSelectPermission(permission.id)}
                        highlighted={true}
                    />
                ))}
            </div>
        </div>
    );
};

const PermissionSelector: FC<TPermissionSelector & {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}> = ({
    selectedPermissions,
    onSelectPermission,
    onCheckAllPermissions,
    searchQuery,
    onSearchChange,
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

    // Filter permissions based on search query
    const filteredPermissions = useMemo(() => {
        if (!permission?.data) return { approvalPermissions: [], otherPermissions: [] };

        const query = searchQuery.toLowerCase().trim();

        // Find approval permissions module
        const approvalModule = permission.data.find((p) => p.module === 'approvals');
        let approvalPerms = approvalModule?.permissions || [];

        // Filter approval permissions if search query exists
        if (query) {
            approvalPerms = approvalPerms.filter((perm) =>
                perm.name.toLowerCase().includes(query) ||
                perm.codename.toLowerCase().includes(query)
            );
        }

        // Filter other modules
        let otherModules = permission.data.filter((p) => p.module !== 'approvals') || [];

        if (query) {
            // Filter each module's permissions based on search
            otherModules = otherModules
                .map((module) => ({
                    ...module,
                    permissions: module.permissions.filter((perm) =>
                        perm.name.toLowerCase().includes(query) ||
                        perm.codename.toLowerCase().includes(query) ||
                        module.module.toLowerCase().includes(query)
                    ),
                }))
                // Only keep modules that have matching permissions or matching module name
                .filter((module) =>
                    module.permissions.length > 0 ||
                    module.module.toLowerCase().includes(query)
                );
        }

        return {
            approvalPermissions: approvalPerms,
            otherPermissions: otherModules,
        };
    }, [permission?.data, searchQuery]);

    if (isLoading) return <LoadingSpinner />;

    if (permission?.data?.length === 0)
        return (
            <div className="flex flex-col items-center gap-2.5">
                <EmptyTodoIcon />
                <h3 className="font-bold text-md">No permissions found.</h3>
            </div>
        );

    const { approvalPermissions, otherPermissions } = filteredPermissions;

    return (
        <>
            {/* No results message */}
            {searchQuery && approvalPermissions.length === 0 && otherPermissions.length === 0 && (
                <div className="flex flex-col items-center gap-2.5 py-8">
                    <Search className="w-12 h-12 text-gray-300" />
                    <h3 className="font-bold text-md text-gray-600">No permissions found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search query</p>
                </div>
            )}

            {/* Approval Permissions Section - Always shown first if available */}
            {approvalPermissions.length > 0 && (
                <ApprovalPermissionsSection
                    approvalPermissions={approvalPermissions}
                    selectedPermissions={selectedPermissions}
                    onSelectPermission={onSelectPermission}
                />
            )}

            {/* Regular Permission Modules */}
            {otherPermissions.map((permission) => (
                <div key={permission.module}>
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
    const [searchQuery, setSearchQuery] = useState("");

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
                    {/* Search Input - Fixed at top */}
                    <div className="mb-4 pb-3 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search permissions by name or module..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-20 py-2 w-full"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 text-xs"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[45vh]">
                        <PermissionSelector
                            selectedPermissions={selectedPermissions}
                            onSelectPermission={handleSelectPermission}
                            // @ts-ignore
                            onCheckAllPermissions={(permissions: number[]) =>
                                setSelectedPermissions(permissions)
                            }
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
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
