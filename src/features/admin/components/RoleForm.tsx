'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X, Users, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCreateRole,
  useUpdateRole,
  useGetPermissions,
  useAssignPermissions,
  IRoleCreateRequest,
  IRoleUpdateRequest,
  IRole,
  IPermissionModule
} from '../controllers/roleController';

// Form validation schema
const roleFormSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  role?: IRole | null;
  onSuccess?: (role: IRole) => void;
  onCancel?: () => void;
  className?: string;
}

interface PermissionSectionProps {
  module: IPermissionModule;
  selectedPermissions: number[];
  onPermissionChange: (permissionId: number, checked: boolean) => void;
}

const PermissionSection: React.FC<PermissionSectionProps> = ({
  module,
  selectedPermissions,
  onPermissionChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const modulePermissions = module.permissions || [];
  const selectedCount = modulePermissions.filter(p =>
    selectedPermissions.includes(p.id)
  ).length;

  const handleModuleToggle = (checked: boolean) => {
    modulePermissions.forEach(permission => {
      onPermissionChange(permission.id, checked);
    });
  };

  const isAllSelected = modulePermissions.length > 0 &&
    selectedCount === modulePermissions.length;
  const isSomeSelected = selectedCount > 0 && selectedCount < modulePermissions.length;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-1"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                onCheckedChange={handleModuleToggle}
              />
              <CardTitle className="text-lg capitalize">
                {module.module} Module
              </CardTitle>
            </div>
          </div>
          <Badge variant={selectedCount > 0 ? "default" : "secondary"}>
            {selectedCount}/{modulePermissions.length} selected
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modulePermissions.map((permission) => (
              <div
                key={permission.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border",
                  selectedPermissions.includes(permission.id)
                    ? "bg-primary/5 border-primary/20"
                    : "bg-gray-50/50 border-gray-200"
                )}
              >
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) =>
                    onPermissionChange(permission.id, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium leading-none cursor-pointer">
                    {permission.name}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {permission.codename}
                  </p>
                  {permission.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {permission.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const RoleForm: React.FC<RoleFormProps> = ({
  role,
  onSuccess,
  onCancel,
  className
}) => {
  const isEditing = !!role;
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const { createRole, isLoading: isCreating } = useCreateRole();
  const { updateRole, isLoading: isUpdating } = useUpdateRole();
  const { getPermissions, data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissions();
  const { assignPermissions, isLoading: isAssigningPermissions } = useAssignPermissions();

  const isLoading = isCreating || isUpdating || isAssigningPermissions;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      is_active: role?.is_active ?? true,
    },
  });

  // Load permissions on component mount
  useEffect(() => {
    getPermissions(role?.id);
  }, [role?.id]);

  // Set selected permissions when data loads
  useEffect(() => {
    if (role && permissionsData) {
      const currentPermissionIds: number[] = [];
      role.permissions?.forEach(module => {
        module.permissions?.forEach(permission => {
          currentPermissionIds.push(permission.id);
        });
      });
      setSelectedPermissions(currentPermissionIds);
    }
  }, [role, permissionsData]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(id => id !== permissionId);
      }
    });
  };

  const onSubmit = async (data: RoleFormValues) => {
    try {
      let savedRole: IRole;

      if (isEditing && role) {
        // Update existing role
        const updateData: IRoleUpdateRequest = {
          id: role.id,
          ...data,
          permission_ids: selectedPermissions
        };
        const response = await updateRole(updateData);
        savedRole = response.data;
      } else {
        // Create new role
        const createData: IRoleCreateRequest = {
          ...data,
          permission_ids: selectedPermissions
        };
        const response = await createRole(createData);
        savedRole = response.data;
      }

      // If role was created/updated successfully and we have permissions to assign
      if (savedRole && selectedPermissions.length > 0) {
        await assignPermissions(savedRole.id, selectedPermissions);
      }

      onSuccess?.(savedRole);
    } catch (error) {
      console.error('Role form submission error:', error);
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>{isEditing ? 'Edit Role' : 'Create New Role'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., HR Manager, Finance Officer"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Role Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={form.watch('is_active')}
                    onCheckedChange={(checked) => form.setValue('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="text-sm">
                    {form.watch('is_active') ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role's responsibilities and purpose..."
                rows={3}
                {...form.register('description')}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Permissions</h3>
                <Badge variant="outline">
                  {selectedPermissions.length} selected
                </Badge>
              </div>

              {permissionsData && permissionsData.length > 0 ? (
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-4">
                    {permissionsData.map((module) => (
                      <PermissionSection
                        key={module.module}
                        module={module}
                        selectedPermissions={selectedPermissions}
                        onPermissionChange={handlePermissionChange}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertDescription>
                    No permissions available. Please contact your administrator.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleForm;