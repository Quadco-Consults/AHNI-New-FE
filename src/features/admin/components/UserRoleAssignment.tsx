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
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useGetRoles,
  useGetUsersWithRoles,
  useAssignRolesToUser,
  useAssignUsersToRole,
  IRole
} from '../controllers/roleController';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  department?: string;
  is_active: boolean;
  roles?: IRole[];
}

interface UserRoleCardProps {
  user: User;
  availableRoles: IRole[];
  onRoleChange: (userId: number, roleIds: number[]) => void;
  isLoading?: boolean;
}

interface RoleUserCardProps {
  role: IRole;
  users: User[];
  availableUsers: User[];
  onUserChange: (roleId: number, userIds: number[]) => void;
  isLoading?: boolean;
}

interface UserRoleTableProps {
  users: User[];
  roles: IRole[];
  onUserRoleUpdate: (userId: number, roleIds: number[]) => void;
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
                <div className="text-xs text-muted-foreground">{user.department}</div>
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
  availableUsers,
  onUserChange,
  isLoading
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const roleUsers = users.filter(user =>
    user.roles?.some(userRole => userRole.id === role.id)
  );

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
          {availableUsers.map((user) => (
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
                  {user.department || user.email}
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

const UserRoleTable: React.FC<UserRoleTableProps> = ({
  users,
  roles,
  onUserRoleUpdate,
  isLoading
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Assigned Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {user.department || 'No department'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles?.map((role) => (
                    <Badge key={role.id} variant="secondary" className="text-xs">
                      {role.name}
                    </Badge>
                  )) || <span className="text-muted-foreground">No roles</span>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would typically open a modal/dialog for role assignment
                    const currentRoleIds = user.roles?.map(r => r.id) || [];
                    // For now, just console log - in real implementation this would open a dialog
                    console.log('Edit roles for user:', user.id, currentRoleIds);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Edit Roles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const UserRoleAssignment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('by-user');

  const { getRoles, data: rolesData, isLoading: isLoadingRoles } = useGetRoles();
  const { getUsersWithRoles, data: usersData, isLoading: isLoadingUsers } = useGetUsersWithRoles();
  const { assignRolesToUser, isLoading: isAssigningToUser } = useAssignRolesToUser();
  const { assignUsersToRole, isLoading: isAssigningToRole } = useAssignUsersToRole();

  const isLoading = isLoadingRoles || isLoadingUsers || isAssigningToUser || isAssigningToRole;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        getRoles(),
        getUsersWithRoles()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];

    let filtered = usersData;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    return filtered;
  }, [usersData, searchTerm, departmentFilter]);

  const departments = useMemo(() => {
    if (!usersData) return [];
    const depts = new Set(usersData.map(user => user.department).filter(Boolean));
    return Array.from(depts);
  }, [usersData]);

  const handleUserRoleChange = async (userId: number, roleIds: number[]) => {
    try {
      await assignRolesToUser(userId, roleIds);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to update user roles:', error);
    }
  };

  const handleRoleUserChange = async (roleId: number, userIds: number[]) => {
    try {
      await assignUsersToRole(roleId, userIds);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to update role users:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Role Assignment</h1>
          <p className="text-muted-foreground">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Role Assignment</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="by-user">Assign by User</TabsTrigger>
              <TabsTrigger value="by-role">Assign by Role</TabsTrigger>
              <TabsTrigger value="overview">Overview Table</TabsTrigger>
            </TabsList>

            <TabsContent value="by-user" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Select roles for each user
              </div>
              <ScrollArea className="h-96 w-full">
                {filteredUsers.map((user) => (
                  <UserRoleCard
                    key={user.id}
                    user={user}
                    availableRoles={rolesData || []}
                    onRoleChange={handleUserRoleChange}
                    isLoading={isAssigningToUser}
                  />
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="by-role" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Select users for each role
              </div>
              <ScrollArea className="h-96 w-full">
                {rolesData?.map((role) => (
                  <RoleUserCard
                    key={role.id}
                    role={role}
                    users={usersData || []}
                    availableUsers={filteredUsers}
                    onUserChange={handleRoleUserChange}
                    isLoading={isAssigningToRole}
                  />
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Overview of all user role assignments
              </div>
              <UserRoleTable
                users={filteredUsers}
                roles={rolesData || []}
                onUserRoleUpdate={handleUserRoleChange}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleAssignment;