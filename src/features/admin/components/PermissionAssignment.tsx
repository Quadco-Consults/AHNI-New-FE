'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Search,
  Save,
  RefreshCw,
  Shield,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useGetPermissions,
  useAssignPermissions,
  useRemovePermissions,
  useGetRole,
  IPermissionModule,
  IRole
} from '../controllers/roleController';

interface PermissionAssignmentProps {
  roleId: number;
  onPermissionsChanged?: (permissions: number[]) => void;
  className?: string;
}

interface PermissionItemProps {
  permission: {
    id: number;
    name: string;
    codename: string;
    description?: string;
    is_assigned?: boolean;
  };
  isSelected: boolean;
  onToggle: (permissionId: number, selected: boolean) => void;
  showDetails?: boolean;
}

interface ModuleSectionProps {
  module: IPermissionModule;
  selectedPermissions: Set<number>;
  onPermissionToggle: (permissionId: number, selected: boolean) => void;
  onModuleToggle: (modulePermissions: number[], selected: boolean) => void;
  searchTerm: string;
  showOnlyAssigned: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  permission,
  isSelected,
  onToggle,
  showDetails = true
}) => {
  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
        isSelected
          ? "bg-primary/5 border-primary/20 shadow-sm"
          : "bg-gray-50/50 border-gray-200 hover:bg-gray-100/50"
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onToggle(permission.id, checked as boolean)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium leading-none cursor-pointer">
            {permission.name}
          </Label>
          {permission.is_assigned && (
            <Badge variant="secondary" className="text-xs">
              Currently Assigned
            </Badge>
          )}
        </div>
        {showDetails && (
          <>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {permission.codename}
            </p>
            {permission.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {permission.description}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ModuleSection: React.FC<ModuleSectionProps> = ({
  module,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
  searchTerm,
  showOnlyAssigned
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredPermissions = useMemo(() => {
    let permissions = module.permissions || [];

    // Filter by search term
    if (searchTerm) {
      permissions = permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by assignment status
    if (showOnlyAssigned) {
      permissions = permissions.filter(p => p.is_assigned);
    }

    return permissions;
  }, [module.permissions, searchTerm, showOnlyAssigned]);

  const modulePermissionIds = filteredPermissions.map(p => p.id);
  const selectedCount = modulePermissionIds.filter(id =>
    selectedPermissions.has(id)
  ).length;

  const isAllSelected = filteredPermissions.length > 0 &&
    selectedCount === filteredPermissions.length;
  const isSomeSelected = selectedCount > 0 && selectedCount < filteredPermissions.length;

  const handleModuleToggle = (checked: boolean) => {
    onModuleToggle(modulePermissionIds, checked);
  };

  if (filteredPermissions.length === 0) {
    return null;
  }

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
            <div className="flex items-center space-x-3">
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
          <div className="flex items-center space-x-2">
            <Badge variant={selectedCount > 0 ? "default" : "secondary"}>
              {selectedCount}/{filteredPermissions.length}
            </Badge>
            {selectedCount > 0 && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPermissions.map((permission) => (
              <PermissionItem
                key={permission.id}
                permission={permission}
                isSelected={selectedPermissions.has(permission.id)}
                onToggle={onPermissionToggle}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({
  roleId,
  onPermissionsChanged,
  className
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { getRole, data: roleData, isLoading: isLoadingRole } = useGetRole();
  const { getPermissions, data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissions();
  const { assignPermissions, isLoading: isAssigning } = useAssignPermissions();
  const { removePermissions, isLoading: isRemoving } = useRemovePermissions();

  const isLoading = isLoadingRole || isLoadingPermissions || isAssigning || isRemoving;

  // Load role and permissions data
  useEffect(() => {
    if (roleId) {
      getRole(roleId);
      getPermissions(roleId);
    }
  }, [roleId]);

  // Initialize selected permissions when data loads
  useEffect(() => {
    if (roleData && permissionsData) {
      const currentPermissionIds = new Set<number>();
      roleData.permissions?.forEach(module => {
        module.permissions?.forEach(permission => {
          currentPermissionIds.add(permission.id);
        });
      });
      setSelectedPermissions(currentPermissionIds);
    }
  }, [roleData, permissionsData]);

  // Track unsaved changes
  useEffect(() => {
    if (roleData) {
      const originalPermissions = new Set<number>();
      roleData.permissions?.forEach(module => {
        module.permissions?.forEach(permission => {
          originalPermissions.add(permission.id);
        });
      });

      const hasChanges =
        selectedPermissions.size !== originalPermissions.size ||
        [...selectedPermissions].some(id => !originalPermissions.has(id));

      setHasUnsavedChanges(hasChanges);
    }
  }, [selectedPermissions, roleData]);

  const handlePermissionToggle = (permissionId: number, selected: boolean) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(permissionId);
      } else {
        newSet.delete(permissionId);
      }
      return newSet;
    });
  };

  const handleModuleToggle = (modulePermissionIds: number[], selected: boolean) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      modulePermissionIds.forEach(id => {
        if (selected) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!roleData) return;

    try {
      const currentPermissions = new Set<number>();
      roleData.permissions?.forEach(module => {
        module.permissions?.forEach(permission => {
          currentPermissions.add(permission.id);
        });
      });

      const toAdd = [...selectedPermissions].filter(id => !currentPermissions.has(id));
      const toRemove = [...currentPermissions].filter(id => !selectedPermissions.has(id));

      // Add new permissions
      if (toAdd.length > 0) {
        await assignPermissions(roleId, toAdd);
      }

      // Remove permissions
      if (toRemove.length > 0) {
        await removePermissions(roleId, toRemove);
      }

      // Refresh data
      getRole(roleId);
      getPermissions(roleId);

      // Notify parent
      onPermissionsChanged?.([...selectedPermissions]);

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save permissions error:', error);
    }
  };

  const handleReset = () => {
    if (roleData) {
      const originalPermissions = new Set<number>();
      roleData.permissions?.forEach(module => {
        module.permissions?.forEach(permission => {
          originalPermissions.add(permission.id);
        });
      });
      setSelectedPermissions(originalPermissions);
      setHasUnsavedChanges(false);
    }
  };

  const filteredModules = useMemo(() => {
    if (!permissionsData) return [];

    return permissionsData.filter(module => {
      if (filterModule !== 'all' && module.module !== filterModule) {
        return false;
      }

      // Check if module has any matching permissions
      const hasMatchingPermissions = module.permissions?.some(permission => {
        const matchesSearch = !searchTerm ||
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = !showOnlyAssigned || permission.is_assigned;

        return matchesSearch && matchesFilter;
      });

      return hasMatchingPermissions;
    });
  }, [permissionsData, filterModule, searchTerm, showOnlyAssigned]);

  const totalSelected = selectedPermissions.size;
  const totalAvailable = permissionsData?.reduce((sum, module) =>
    sum + (module.permissions?.length || 0), 0) || 0;

  if (isLoadingRole || isLoadingPermissions) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>
                Permission Assignment - {roleData?.name}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {totalSelected}/{totalAvailable} permissions
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="destructive">Unsaved Changes</Badge>
              )}
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
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {permissionsData?.map(module => (
                    <SelectItem key={module.module} value={module.module}>
                      {module.module.charAt(0).toUpperCase() + module.module.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyAssigned(!showOnlyAssigned)}
                className="whitespace-nowrap"
              >
                {showOnlyAssigned ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showOnlyAssigned ? 'Show All' : 'Show Assigned'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Permissions List */}
          {filteredModules.length > 0 ? (
            <ScrollArea className="h-96 w-full">
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <ModuleSection
                    key={module.module}
                    module={module}
                    selectedPermissions={selectedPermissions}
                    onPermissionToggle={handlePermissionToggle}
                    onModuleToggle={handleModuleToggle}
                    searchTerm={searchTerm}
                    showOnlyAssigned={showOnlyAssigned}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Alert>
              <AlertDescription>
                No permissions found matching your criteria.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {hasUnsavedChanges && "You have unsaved changes"}
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasUnsavedChanges || isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionAssignment;