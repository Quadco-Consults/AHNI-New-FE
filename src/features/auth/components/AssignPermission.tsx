"use client";

import FormButton from "@/components/FormButton";
import EmptyTodoIcon from "@/components/icons/EmptyTodoIcon";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IPermission } from "@/features/auth/types/user";
import { cn } from "@/lib/utils";
import { capitalize } from "lodash";
import { FC, useEffect, useState } from "react";
import { useGetAllPermissionsManager, useGetSingleRoleManager, useUpdateRoleManager } from "@/features/auth/controllers/roleController";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";

interface Permission {
  id: number;
  name: string;
  codename: string;
  module: string;
}

type TPermissionSelector = {
  selectedPermissions: number[];
  onSelectPermission: (permissionId: number) => void;
  onCheckAllPermissions: (permissions: number[]) => void;
};

const PermissionCheckbox: FC<{
  permission: IPermission;
  checked: boolean;
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
  const { data: permission, isLoading } = useGetAllPermissionsManager({
    page: 1,
    size: 2000000,
  });

  const handleCheckAllPermissions = (module: string, checked: boolean) => {
    const modulePermission = permission?.data.find(
      (permission: any) => permission.module === module
    )?.permissions;

    const modulePermissionIds = modulePermission?.map(
      (permission: any) => permission.id
    );

    if (checked) {
      onCheckAllPermissions([
        ...selectedPermissions,
        ...(modulePermissionIds || []),
      ]);
    } else {
      const deletedPermissions = selectedPermissions.filter(
        (permission) => !modulePermissionIds?.includes(permission)
      );

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
      {permission?.data?.map((permission: any) => (
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
            {permission?.permissions?.map((item: IPermission) => (
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

interface AssignPermissionProps {
  id?: string;
  name?: string;
  onClose?: () => void;
}

const AssignPermission = ({ id: roleId, name: roleName, onClose }: AssignPermissionProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const dispatch = useAppDispatch();

  const { updateRole, isLoading } = useUpdateRoleManager(roleId || "");
  const { data: role } = useGetSingleRoleManager(roleId || "");

  useEffect(() => {
    const prevPermissions = role?.data?.permissions
      ?.map((permission: any) => permission)
      .map((item: any) =>
        item.permissions.map((_permission: any) => _permission.id)
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
    if (!roleId || !roleName) return;

    try {
      await updateRole({ 
        name: roleName, 
        permissions: selectedPermissions 
      });
      toast.success("Permission added successfully");
      dispatch(closeDialog());
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
          <h2 className="text-3xl font-bold text-center">
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
        <FormButton onClick={onSubmit} loading={isLoading}>
          Save & Continue
        </FormButton>
      </div>
    </div>
  );
};

export default AssignPermission;