import ConfirmationDialog from "components/ConfirmationDialog";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { Shield, Key, Trash2, Users, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useDeleteRole, useGetAllRoles } from "../../controllers/roleController";
import { toast } from "sonner";
import { openDialog } from "store/ui";

export default function AllRoles() {
  const [roleId, setRoleId] = useState("");

  const { data: role, isLoading, error } = useGetAllRoles({
    page: 1,
    size: 2000000,
  });

  const dispatch = useAppDispatch();

  // Debug logging
  console.log('📊 RoleList Data:', {
    role,
    isLoading,
    error,
    hasData: !!role?.data,
    hasResults: !!(role as any)?.data?.results,
    resultsLength: (role as any)?.data?.results?.length
  });

  const onRoleClick = (id: string, name: string, permission: string) => {
    dispatch(
      openDialog({
        type: DialogType.AddPermissionToRole,
        dialogProps: {
          ...largeDailogScreen,
          id,
          name,
          permission: permission,
        },
      })
    );
  };

  const { deleteRole, isLoading: isDeleteLoading } = useDeleteRole(roleId);

  const onDeleteRole = async () => {
    if (!roleId) {
      toast.error("Role ID is missing");
      return;
    }
    try {
      await deleteRole();
      toast.success("Role deleted successfully");
      setRoleId("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete role");
    }
  };

  // Calculate permission counts
  const getRoleStats = (permissions: any) => {
    if (!permissions || !Array.isArray(permissions)) return { total: 0, modules: 0 };

    const total = permissions.reduce((acc, module) => {
      return acc + (module.permissions?.length || 0);
    }, 0);

    return {
      total,
      modules: permissions.length,
    };
  };

  // Check if role has approval permissions
  const hasApprovalPermissions = (permissions: any) => {
    if (!permissions || !Array.isArray(permissions)) return false;
    return permissions.some(module => module.module === 'approvals');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const rolesList = (role as any)?.data?.results || [];

  if (!rolesList || rolesList.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Shield className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No roles found</h3>
              <p className="text-sm text-gray-500 mt-1">
                Create your first role to get started
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{rolesList.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Click any role to manage permissions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rolesList.map(({ id, name, permissions }: any, i: number) => {
          const stats = getRoleStats(permissions);
          const isApprovalRole = hasApprovalPermissions(permissions);

          return (
            <Card
              key={id}
              className="group hover:shadow-lg transition-all duration-200 hover:border-gray-400 cursor-pointer relative overflow-hidden"
            >
              {/* Role Number Badge */}
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 group-hover:bg-gray-200 transition-colors">
                  #{i + 1}
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Shield className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold capitalize text-gray-900 group-hover:text-gray-700 transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isApprovalRole && (
                          <Badge variant="outline" className="text-xs gap-1 bg-gray-100 text-gray-700 border-gray-300">
                            <ShieldCheck className="w-3 h-3" />
                            Approval Role
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Permissions</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stats.total}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Modules</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stats.modules}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() =>
                      onRoleClick(
                        String(id),
                        name,
                        permissions as unknown as string
                      )
                    }
                  >
                    <Key className="w-4 h-4" />
                    Manage
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    onClick={() => setRoleId(id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(roleId)}
        title="Delete Role?"
        loading={isDeleteLoading}
        onCancel={() => setRoleId("")}
        onOk={onDeleteRole}
      />
    </div>
  );
}
