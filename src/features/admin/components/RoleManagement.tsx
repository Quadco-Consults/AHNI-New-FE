'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  Users,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/PermissionGuard';
import {
  useGetRoles,
  useDeleteRole,
  useBulkRoleOperations,
  IRole
} from '../controllers/roleController';
import RoleForm from './RoleForm';
import PermissionAssignment from './PermissionAssignment';

interface RoleTableProps {
  roles: IRole[];
  onEdit: (role: IRole) => void;
  onDelete: (role: IRole) => void;
  onViewPermissions: (role: IRole) => void;
  selectedRoles: number[];
  onRoleSelect: (roleId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isLoading?: boolean;
}

interface BulkActionsProps {
  selectedRoles: number[];
  onClearSelection: () => void;
  onBulkAction: (action: string) => void;
  isLoading: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedRoles,
  onClearSelection,
  onBulkAction,
  isLoading
}) => {
  if (selectedRoles.length === 0) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-primary/5 border rounded-lg">
      <span className="text-sm font-medium">
        {selectedRoles.length} role(s) selected
      </span>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('activate')}
          disabled={isLoading}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Activate
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkAction('deactivate')}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Deactivate
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onBulkAction('delete')}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClearSelection}
      >
        Clear
      </Button>
    </div>
  );
};

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onDelete,
  onViewPermissions,
  selectedRoles,
  onRoleSelect,
  onSelectAll,
  isLoading
}) => {
  const isAllSelected = roles.length > 0 && selectedRoles.length === roles.length;
  const isSomeSelected = selectedRoles.length > 0 && selectedRoles.length < roles.length;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Permissions</TableHead>
            <TableHead className="text-center">Users</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Loading roles...</p>
              </TableCell>
            </TableRow>
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No roles found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first role to get started
                </p>
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) =>
                      onRoleSelect(role.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {role.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={role.description}>
                    {role.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {role.permissions?.reduce((count, module) =>
                      count + (module.permissions?.length || 0), 0
                    ) || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {role.users_count || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={role.is_active ? "default" : "secondary"}
                    className={cn(
                      role.is_active
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    )}
                  >
                    {role.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(role.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewPermissions(role)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(role)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(role)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

  const { hasPermission } = usePermissions();
  const { getRoles, data: rolesData, isLoading, error } = useGetRoles();
  const { deleteRole, isLoading: isDeleting } = useDeleteRole();
  const {
    bulkActivateRoles,
    bulkDeactivateRoles,
    bulkDeleteRoles,
    isLoading: isBulkLoading
  } = useBulkRoleOperations();

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      await getRoles({
        search: searchTerm || undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
      });
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  // Reload when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRoles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const filteredRoles = rolesData || [];

  const handleRoleSelect = (roleId: number, selected: boolean) => {
    setSelectedRoles(prev =>
      selected
        ? [...prev, roleId]
        : prev.filter(id => id !== roleId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRoles(selected ? filteredRoles.map(role => role.id) : []);
  };

  const handleEdit = (role: IRole) => {
    setSelectedRole(role);
    setShowEditDialog(true);
  };

  const handleDelete = async (role: IRole) => {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        await deleteRole(role.id);
        loadRoles();
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleViewPermissions = (role: IRole) => {
    setSelectedRole(role);
    setShowPermissionsDialog(true);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRoles.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          await bulkActivateRoles(selectedRoles);
          break;
        case 'deactivate':
          await bulkDeactivateRoles(selectedRoles);
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedRoles.length} role(s)?`)) {
            await bulkDeleteRoles(selectedRoles);
          } else {
            return;
          }
          break;
      }
      setSelectedRoles([]);
      loadRoles();
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
    }
  };

  const handleRoleSuccess = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedRole(null);
    loadRoles();
  };

  return (
    <PermissionGuard permission="manage_roles" fallback={
      <Alert>
        <AlertDescription>
          You don't have permission to manage roles.
        </AlertDescription>
      </Alert>
    }>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">
              Create and manage user roles and permissions
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <RoleForm
                onSuccess={handleRoleSuccess}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Roles</span>
                <Badge variant="outline">
                  {filteredRoles.length} total
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadRoles}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4 mr-2",
                    isLoading && "animate-spin"
                  )} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
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
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            <BulkActions
              selectedRoles={selectedRoles}
              onClearSelection={() => setSelectedRoles([])}
              onBulkAction={handleBulkAction}
              isLoading={isBulkLoading}
            />

            {/* Roles Table */}
            <RoleTable
              roles={filteredRoles}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewPermissions={handleViewPermissions}
              selectedRoles={selectedRoles}
              onRoleSelect={handleRoleSelect}
              onSelectAll={handleSelectAll}
              isLoading={isLoading}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load roles. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <RoleForm
                role={selectedRole}
                onSuccess={handleRoleSuccess}
                onCancel={() => setShowEditDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <PermissionAssignment
                roleId={selectedRole.id}
                onPermissionsChanged={() => {
                  loadRoles();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default RoleManagement;