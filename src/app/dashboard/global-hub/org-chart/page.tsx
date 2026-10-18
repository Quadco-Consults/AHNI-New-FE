"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
} from "lucide-react";
import { useOrgChart, OrgChartUser } from "@/hooks/useOrgChart";
import Image from "next/image";

export default function OrganizationChartPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useOrgChart();
  // Handle nested response structure from APIResponseViewSetMixin
  const orgData = Array.isArray(data?.data?.data) ? data.data.data :
                  Array.isArray(data?.data) ? data.data : [];

  // Toggle node expansion
  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Get user's role label based on permissions
  const getUserRoleLabel = (user: OrgChartUser): string => {
    if (user.is_superuser) return "Owner";
    if (user.is_staff) return "Admin";
    return "Employee";
  };

  // Get status badge
  const getStatusBadge = (user: OrgChartUser) => {
    // You can customize this based on user status fields
    return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
  };

  // Build hierarchical structure
  const buildHierarchy = useMemo(() => {
    if (!orgData.length) return [];

    // Find root nodes (users without supervisors)
    const rootUsers = orgData.filter(user => !user.supervisor_id);

    // If no root found, take the first superuser or first user
    if (rootUsers.length === 0) {
      const firstSuperuser = orgData.find(u => u.is_superuser);
      return firstSuperuser ? [firstSuperuser] : [orgData[0]];
    }

    return rootUsers;
  }, [orgData]);

  // Get direct reports for a user
  const getDirectReports = (userId: string): OrgChartUser[] => {
    return orgData.filter(user => user.supervisor_id === userId);
  };

  // Filter users based on search
  const matchesSearch = (user: OrgChartUser): boolean => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.position?.name?.toLowerCase().includes(searchLower) ||
      user.department?.name?.toLowerCase().includes(searchLower) || false
    );
  };

  // Render org node (employee card)
  const renderOrgNode = (user: OrgChartUser, level: number = 0): JSX.Element | null => {
    if (!matchesSearch(user)) return null;

    const directReports = getDirectReports(user.id);
    const hasChildren = directReports.length > 0;
    const isExpanded = expandedNodes.has(user.id);
    const roleLabel = getUserRoleLabel(user);

    return (
      <div key={user.id} className="relative">
        {/* Employee Card */}
        <Card className="w-64 mx-auto mb-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            {/* Header with avatar and basic info */}
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative w-16 h-16 mb-3">
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.full_name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Name and Status */}
              <div className="space-y-1 mb-2">
                <h3 className="font-semibold text-sm">{user.full_name}</h3>
                {getStatusBadge(user)}
              </div>

              {/* Position */}
              {user.position && (
                <p className="text-xs text-gray-600 mb-2">{user.position.name}</p>
              )}

              {/* Role Label */}
              <div className="text-xs font-medium text-orange-600 mb-2">
                {roleLabel}
              </div>

              {/* Department/Location */}
              {user.department && (
                <p className="text-xs text-gray-500">{user.department.name}</p>
              )}
            </div>

            {/* Expand/Collapse Button */}
            {hasChildren && (
              <div className="mt-3 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleNodeExpansion(user.id)}
                  className="text-xs gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Hide {directReports.length} report{directReports.length > 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      {directReports.length} report{directReports.length > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Direct Reports */}
        {isExpanded && hasChildren && (
          <div className="relative">
            {/* Vertical connecting line from parent */}
            <div className="absolute left-1/2 top-0 w-0.5 h-6 bg-gray-300 -translate-x-1/2" />

            {/* Horizontal line connecting all children */}
            {directReports.length > 1 && (
              <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-300"
                   style={{
                     left: `calc(${100 / directReports.length / 2}%)`,
                     right: `calc(${100 / directReports.length / 2}%)`
                   }}
              />
            )}

            {/* Children Grid */}
            <div className={`grid gap-8 pt-6 ${
              directReports.length === 1 ? 'grid-cols-1' :
              directReports.length === 2 ? 'grid-cols-2' :
              directReports.length === 3 ? 'grid-cols-3' :
              'grid-cols-4'
            }`}>
              {directReports.map((child) => (
                <div key={child.id} className="relative">
                  {/* Vertical line down to child */}
                  <div className="absolute left-1/2 -top-6 w-0.5 h-6 bg-gray-300 -translate-x-1/2" />
                  {renderOrgNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organization Chart</h1>
            <p className="text-gray-600">Loading organizational structure...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organization Chart</h1>
            <p className="text-red-600">Error loading organization chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Organization Chart
          </h1>
          <p className="text-gray-600">View organizational structure and reporting hierarchy</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            // Expand all root nodes
            const newExpanded = new Set(buildHierarchy.map(u => u.id));
            setExpandedNodes(newExpanded);
          }}
        >
          Expand All
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Organization Chart Tree */}
      <div className="bg-gray-50 p-8 rounded-lg overflow-x-auto">
        {buildHierarchy.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizational data</h3>
            <p className="text-gray-500">
              Set up supervisor relationships to build the organization chart
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {buildHierarchy.map((rootUser) => (
              <div key={rootUser.id}>
                {renderOrgNode(rootUser)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Employees</div>
            <div className="text-2xl font-bold">{orgData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Departments</div>
            <div className="text-2xl font-bold">
              {new Set(orgData.map(u => u.department?.id).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Locations</div>
            <div className="text-2xl font-bold">
              {new Set(orgData.map(u => u.location?.id).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
