import ConfirmationDialog from "components/ConfirmationDialog";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { Shield, Key, Trash2, Users, ShieldCheck, Search, RefreshCw, Eye, Edit } from "lucide-react";
import { useState, useMemo } from "react";
import { useDeleteRole, useGetAllRoles } from "../../controllers/roleController";
import { useGetRolesEnhanced, useBulkRoleOperationsEnhanced } from "../../controllers/enhancedRoleController";
import { toast } from "sonner";
import { openDialog } from "store/ui";
import { cn } from "@/lib/utils";

export default function AllRoles() {
  const [roleId, setRoleId] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: role, isLoading, error, refetch } = useGetAllRoles({
    page: currentPage,
    size: 50,
    search: searchTerm,
  });

  const { bulkDeleteRoles, isLoading: isBulkLoading } = useBulkRoleOperationsEnhanced();

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
      refetch(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete role");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRoles.length === 0) {
      toast.error("No roles selected");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedRoles.length} role(s)?`)) {
      try {
        await bulkDeleteRoles(selectedRoles);
        toast.success("Roles deleted successfully");
        setSelectedRoles([]);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete roles");
      }
    }
  };

  const handleRoleSelect = (roleId: string, selected: boolean) => {
    setSelectedRoles(prev =>
      selected
        ? [...prev, roleId]
        : prev.filter(id => id !== roleId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRoles(selected ? rolesList.map(role => String(role.id)) : []);
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

  const rolesList = (role as any)?.data?.results || [];
  const isAllSelected = rolesList.length > 0 && selectedRoles.length === rolesList.length;
  const isSomeSelected = selectedRoles.length > 0 && selectedRoles.length < rolesList.length;

  // Filter roles based on search term - must be called before any early returns
  const filteredRoles = useMemo(() => {
    if (!searchTerm) return rolesList;
    return rolesList.filter((role: any) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rolesList, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

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
      {/* Clean Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedRoles.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedRoles.length} selected
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkLoading}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedRoles.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedRoles([])}
              >
                Clear
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Clean Roles List */}
      <div className="space-y-3">
        {filteredRoles.map(({ id, name, permissions }: any, i: number) => {
          const stats = getRoleStats(permissions);
          const isApprovalRole = hasApprovalPermissions(permissions);
          const isSelected = selectedRoles.includes(String(id));

          return (
            <Card
              key={id}
              className={cn(
                "hover:shadow-md transition-all duration-200",
                isSelected ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/30" : ""
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleRoleSelect(String(id), checked as boolean)
                      }
                    />

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{stats.total} permissions</span>
                          <span>{stats.modules} modules</span>
                          {isApprovalRole && (
                            <Badge variant="outline" className="text-xs">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Approval Role
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRoleClick(
                          String(id),
                          name,
                          permissions as unknown as string
                        );
                      }}
                    >
                      <Key className="w-4 h-4" />
                      Manage Permissions
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          openDialog({
                            type: DialogType.EditRoleModal,
                            dialogProps: {
                              header: "Edit Role",
                              width: "max-w-md",
                              height: "max-h-[700px]",
                              roleId: String(id),
                              roleName: name,
                            },
                          })
                        );
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleId(id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
