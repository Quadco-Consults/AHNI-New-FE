"use client";

import FormButton from "@/components/FormButton";
import EmptyTodoIcon from "@/components/icons/EmptyTodoIcon";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IPermission } from "@/features/auth/types/permission";
import { cn } from "@/lib/utils";
import { capitalize } from "lodash";
import { FC, useEffect, useState, useMemo } from "react";
import { useGetAllPermissionsManager, useGetSingleRoleManager, useUpdateRoleManager } from "@/features/auth/controllers/roleController";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import { ShieldCheck, Info, Search, Shield, CheckCircle2, Key } from "lucide-react";

type TPermissionSelector = {
  selectedPermissions: number[];
  onSelectPermission: (permissionId: number) => void;
  onCheckAllPermissions: (permissions: number[]) => void;
  searchQuery: string;
};

const PermissionCheckbox: FC<{
  permission: IPermission;
  checked: boolean;
  highlighted?: boolean;
  onChange: (checked: boolean) => void;
}> = ({ permission, checked, onChange, highlighted = false }) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-all duration-200",
        highlighted
          ? checked
            ? "border-gray-400 bg-gray-100 shadow-sm hover:shadow-md"
            : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400"
          : checked
            ? "border-gray-400 bg-gray-100 shadow-sm hover:shadow-md"
            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
      )}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        checked={checked}
        className={cn(
          "h-4 w-4 rounded border-2",
          checked ? "border-gray-700 bg-gray-700" : "border-gray-300"
        )}
      />
      <span className={cn(
        "text-xs font-medium flex-1",
        checked ? "text-gray-900" : "text-gray-700"
      )}>
        {permission.name}
      </span>
      {checked && (
        <CheckCircle2 className="w-3.5 h-3.5 text-gray-700" />
      )}
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

  const selectedCount = approvalPermissions.filter(p => selectedPermissions.includes(p.id)).length;

  return (
    <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-5 mb-6 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ShieldCheck className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">
            Approval Permissions
          </h3>
        </div>
        <Badge variant="secondary" className="bg-gray-200 text-gray-700 border-gray-300">
          {selectedCount} / {approvalPermissions.length} selected
        </Badge>
      </div>
      <div className="flex items-start gap-2 mb-4 p-3 bg-white border border-gray-300 rounded-lg">
        <Info className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-700">
          These permissions control who can review, authorize, and approve requests across the entire system.
          Users with these permissions will appear in approval workflow dropdowns.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
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

const PermissionSelector: FC<TPermissionSelector> = ({
  selectedPermissions,
  onSelectPermission,
  onCheckAllPermissions,
  searchQuery,
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

  // Filter permissions based on search query
  const filteredPermissions = useMemo(() => {
    if (!permission?.data) return { approvalPermissions: [], otherPermissions: [] };

    const query = searchQuery.toLowerCase().trim();

    // Find approval permissions module
    const approvalModule = permission.data.find((p: any) => p.module === 'approvals');
    let approvalPerms = approvalModule?.permissions || [];

    // Filter approval permissions if search query exists
    if (query) {
      approvalPerms = approvalPerms.filter((perm: any) =>
        perm.name.toLowerCase().includes(query) ||
        perm.codename.toLowerCase().includes(query)
      );
    }

    // Filter other modules
    let otherModules = permission.data.filter((p: any) => p.module !== 'approvals') || [];

    if (query) {
      // Filter each module's permissions based on search
      otherModules = otherModules
        .map((module: any) => ({
          ...module,
          permissions: module.permissions.filter((perm: any) =>
            perm.name.toLowerCase().includes(query) ||
            perm.codename.toLowerCase().includes(query) ||
            module.module.toLowerCase().includes(query)
          ),
        }))
        // Only keep modules that have matching permissions or matching module name
        .filter((module: any) =>
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
      {otherPermissions.map((permission: any) => {
        const moduleSelectedCount = permission.permissions.filter((p: IPermission) =>
          selectedPermissions.includes(p.id)
        ).length;

        return (
          <Card key={permission.module} className="mb-5 border-l-4 border-l-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 rounded-md">
                    <Key className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {capitalize(permission.module)}
                  </h3>
                  <Badge variant="outline" className="ml-2">
                    {moduleSelectedCount} / {permission.permissions.length}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`select-all-${permission.module}`}
                    checked={moduleSelectedCount === permission.permissions.length && permission.permissions.length > 0}
                    onCheckedChange={(checked) =>
                      handleCheckAllPermissions(
                        permission.module,
                        checked as boolean
                      )
                    }
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor={`select-all-${permission.module}`}
                    className="text-xs text-gray-600 cursor-pointer font-medium"
                  >
                    Select all
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2">
                {permission?.permissions?.map((item: IPermission) => (
                  <PermissionCheckbox
                    key={item.id}
                    permission={item}
                    checked={selectedPermissions.includes(item.id)}
                    onChange={() => onSelectPermission(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

interface AssignPermissionProps {
  id?: string;
  name?: string;
}

const AssignPermission = ({ id: roleId, name: roleName }: AssignPermissionProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const totalPermissionsCount = useMemo(() => {
    return selectedPermissions.length;
  }, [selectedPermissions]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gray-50 border-b-2 border-gray-200 -mx-6 -mt-6 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-md">
              <Shield className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Permissions
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Role: <span className="font-semibold text-gray-900 capitalize">{roleName}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-gray-900 text-white px-4 py-2 text-base">
              {totalPermissionsCount} Selected
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search permissions by name or module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-24 py-6 w-full text-sm border-2 focus:border-gray-400"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 text-xs hover:bg-gray-100"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Permissions Content */}
      <Card className="border-2">
        <CardContent className="p-5">
          <ScrollArea className="h-[50vh] pr-4">
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onSelectPermission={handleSelectPermission}
              onCheckAllPermissions={(permissions: number[]) =>
                setSelectedPermissions(permissions)
              }
              searchQuery={searchQuery}
            />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t-2">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalPermissionsCount}</span> permission{totalPermissionsCount !== 1 ? 's' : ''} selected
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => dispatch(closeDialog())}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <FormButton
            onClick={onSubmit}
            loading={isLoading}
            className="min-w-[140px]"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Changes
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default AssignPermission;