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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Save,
  RefreshCw,
  Users,
  Shield,
  UserPlus,
  UserMinus,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/Loading';
import { toast } from 'sonner';
import {
  useGetAllRoles,
  useGetUsersWithRoles,
  useAssignRolesToUser,
  useAssignUsersToRole
} from '../../controllers/roleController';
import { useGetAllUsers } from '../../controllers/userController';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  department?: string | { id: string; name: string; description?: string; created_datetime?: string; updated_datetime?: string; };
  is_active: boolean;
  roles?: any[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface UserRoleCardProps {
  user: User;
  availableRoles: Role[];
  onRoleChange: (userId: number, roleIds: number[]) => void;
  isLoading?: boolean;
}

interface RoleUserCardProps {
  role: Role;
  users: User[];
  onUserChange: (roleId: number, userIds: number[]) => void;
  isLoading?: boolean;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({
  user,
  availableRoles,
  onRoleChange,
  isLoading
}) => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const userRoleIds = user.roles?.map(role => role.id) || [];
    setSelectedRoles(userRoleIds);
  }, [user.roles]);

  useEffect(() => {
    const originalRoleIds = user.roles?.map(role => role.id) || [];
    const hasChanges =
      selectedRoles.length !== originalRoleIds.length ||
      selectedRoles.some(id => !originalRoleIds.includes(id));
    setHasChanges(hasChanges);
  }, [selectedRoles, user.roles]);

  const handleRoleToggle = (roleId: number, checked: boolean) => {
    setSelectedRoles(prev => {
      if (checked) {
        return [...prev, roleId];
      } else {
        return prev.filter(id => id !== roleId);
      }
    });
  };

  const handleSave = () => {
    onRoleChange(user.id, selectedRoles);
    setHasChanges(false);
  };

  const handleReset = () => {
    const userRoleIds = user.roles?.map(role => role.id) || [];
    setSelectedRoles(userRoleIds);
    setHasChanges(false);
  };

  const getInitials = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{getDisplayName(user)}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              {user.department && (
                <div className="text-xs text-muted-foreground">
                  {typeof user.department === 'string' ? user.department : user.department?.name || 'Unknown Department'}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={user.is_active ? "default" : "secondary"}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
            {hasChanges && (
              <Badge variant="destructive">Unsaved</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableRoles.map((role) => (
            <div
              key={role.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border",
                selectedRoles.includes(role.id)
                  ? "bg-primary/5 border-primary/20"
                  : "bg-gray-50/50 border-gray-200"
              )}
            >
              <Checkbox
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={(checked) =>
                  handleRoleToggle(role.id, checked as boolean)
                }
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{role.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {role.description || 'No description'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RoleUserCard: React.FC<RoleUserCardProps> = ({
  role,
  users,
  onUserChange,
  isLoading
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Memoize roleUsers to prevent infinite re-renders
  const roleUsers = useMemo(() =>
    users.filter(user =>
      user.roles?.some(userRole => userRole.id === role.id)
    ), [users, role.id]);

  useEffect(() => {
    const userIds = roleUsers.map(user => user.id);
    setSelectedUsers(userIds);
  }, [roleUsers]);

  useEffect(() => {
    const originalUserIds = roleUsers.map(user => user.id);
    const hasChanges =
      selectedUsers.length !== originalUserIds.length ||
      selectedUsers.some(id => !originalUserIds.includes(id));
    setHasChanges(hasChanges);
  }, [selectedUsers, roleUsers]);

  const handleUserToggle = (userId: number, checked: boolean) => {
    setSelectedUsers(prev => {
      if (checked) {
        return [...prev, userId];
      } else {
        return prev.filter(id => id !== userId);
      }
    });
  };

  const handleSave = () => {
    onUserChange(role.id, selectedUsers);
    setHasChanges(false);
  };

  const handleReset = () => {
    const userIds = roleUsers.map(user => user.id);
    setSelectedUsers(userIds);
    setHasChanges(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <div className="font-medium">{role.name}</div>
              <div className="text-sm text-muted-foreground">
                {role.description || 'No description'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {selectedUsers.length} users
            </Badge>
            {hasChanges && (
              <Badge variant="destructive">Unsaved</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border",
                selectedUsers.includes(user.id)
                  ? "bg-primary/5 border-primary/20"
                  : "bg-gray-50/50 border-gray-200"
              )}
            >
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={(checked) =>
                  handleUserToggle(user.id, checked as boolean)
                }
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">
                  {user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {typeof user.department === 'string' ? user.department : user.department?.name || user.email}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get display name
const getDisplayName = (user: User): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.email;
};

// Simple User Card Component
interface UserCardProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isSelected, onClick }) => {
  const departmentName = typeof user.department === 'string' ? user.department : user.department?.name;

  return (
    <div
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-gray-50",
        isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={getDisplayName(user)} />
            <AvatarFallback className="text-xs">
              {user.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{getDisplayName(user)}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            {departmentName && (
              <div className="text-xs text-gray-400">{departmentName}</div>
            )}
          </div>
        </div>
        <Badge variant={user.is_active ? "default" : "secondary"} className="text-xs">
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
    </div>
  );
};

// Role Assignment Panel Component
interface RoleAssignmentPanelProps {
  user: User;
  availableRoles: Role[];
  onRoleChange: (userId: number, roleIds: number[]) => void;
  isLoading: boolean;
}

const RoleAssignmentPanel: React.FC<RoleAssignmentPanelProps> = ({
  user,
  availableRoles,
  onRoleChange,
  isLoading
}) => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    // Initialize with user's current roles
    const userRoleIds = user.roles?.map(role => role.id) || [];
    setSelectedRoles(userRoleIds);
  }, [user]);

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId];

      // Immediately apply the change
      onRoleChange(user.id, newRoles);
      return newRoles;
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={getDisplayName(user)} />
            <AvatarFallback>
              {user.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{getDisplayName(user)}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-medium text-sm text-gray-900 mb-3">Available Roles</h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableRoles.map((role) => (
            <div key={role.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
              <Checkbox
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => handleRoleToggle(role.id)}
                disabled={isLoading}
              />
              <label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                <div className="font-medium text-sm">{role.name}</div>
                {role.description && (
                  <div className="text-xs text-gray-500">{role.description}</div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserRoleAssignmentTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Using your existing hooks with enhanced functionality
  const { data: rolesData, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetAllRoles({
    page: 1,
    size: 1000,
    search: ''
  });

  // FALLBACK: Use basic users endpoint instead of users/with-roles (which is currently failing)
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetAllUsers({
    page: 1,
    size: 100,
    search: searchTerm
  });

  const { assignRoles, isLoading: isAssigningToUser } = useAssignRolesToUser('');
  const { assignUsers, isLoading: isAssigningToRole } = useAssignUsersToRole('');

  const isLoading = isLoadingRoles || isLoadingUsers || isAssigningToUser || isAssigningToRole;

  const loadData = async () => {
    try {
      await Promise.all([refetchRoles(), refetchUsers()]);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    }
  };

  const roles = (rolesData as any)?.data?.results || [];
  const users = (usersData as any)?.data?.results || [];

  const filteredUsers = useMemo(() => {
    let filtered = users || [];

    if (searchTerm) {
      filtered = filtered.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [users, searchTerm]);


  const handleUserRoleChange = async (userId: number, roleIds: number[]) => {
    try {
      await assignRoles(roleIds);
      await loadData();
      toast.success('User roles updated successfully');
    } catch (error) {
      console.error('Failed to update user roles:', error);
      toast.error('Failed to update user roles');
    }
  };

  if (isLoadingRoles || isLoadingUsers) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">User Role Assignment</h2>
          <p className="text-sm text-muted-foreground">
            Assign roles to users and manage role memberships
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Simple Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Simple Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Users List */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
            <p className="text-sm text-gray-600">Click on a user to manage their roles</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <ScrollArea className="h-[500px]">
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user: User) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUser?.id === user.id}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Column: Role Management */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedUser ? `Roles for ${getDisplayName(selectedUser)}` : 'Select a User'}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedUser ? 'Check/uncheck roles to assign or remove them' : 'Choose a user from the left to manage their roles'}
            </p>
          </div>

          {selectedUser ? (
            <RoleAssignmentPanel
              user={selectedUser}
              availableRoles={roles}
              onRoleChange={handleUserRoleChange}
              isLoading={isAssigningToUser}
            />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UserCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Select a user from the left to start managing their roles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoleAssignmentTab;