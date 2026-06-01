"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UsersIcon,
  UserPlusIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BuildingIcon,
  BriefcaseIcon,
  InfoIcon
} from "lucide-react";
import { useGetUsersWithoutEmployeeRecords } from "@/features/hr/controllers/workforceController";
import { useRouter } from "next/navigation";

export default function MissingEmployeeRecordsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetUsersWithoutEmployeeRecords();
  const [activeTab, setActiveTab] = useState("ahni_staff");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Failed to load users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const usersData = data?.data;
  const summary = usersData?.summary || {};
  const ahniStaff = usersData?.ahni_staff || [];
  const vendors = usersData?.vendors || [];
  const consultants = usersData?.consultants || [];
  const others = usersData?.others || [];

  const handleCreateEmployeeRecord = (userId: string) => {
    // Navigate to employee creation page with pre-filled user data
    router.push(`/dashboard/hr/workforce-database/employee/create?userId=${userId}`);
  };

  const renderUserCard = (user: any, showCreateButton: boolean = true) => (
    <Card key={user.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              {user.staff_id && (
                <Badge variant="outline" className="text-xs">
                  {user.staff_id}
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                {user.email}
              </p>

              {user.mobile_number && (
                <p className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  {user.mobile_number}
                </p>
              )}

              {user.department && (
                <p className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4" />
                  {user.department.name}
                </p>
              )}

              {user.position && (
                <p className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4" />
                  {user.position.name}
                </p>
              )}

              {user.user_type && (
                <Badge variant="secondary" className="mt-2">
                  {user.user_type}
                </Badge>
              )}
            </div>
          </div>

          {showCreateButton && (
            <Button
              size="sm"
              className="ml-4 bg-yellow-600 hover:bg-yellow-700"
              onClick={() => handleCreateEmployeeRecord(user.id)}
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Create Record
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Users Without Employee Records
        </h1>
        <p className="text-gray-600">
          Manage users who need employee records created in the system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersData?.total || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800">
              AHNI Staff (Need Records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">
              {summary.ahni_staff || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800">
              Consultants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {summary.consultants || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {summary.vendors || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="ahni_staff" className="flex items-center gap-2">
            <AlertTriangleIcon className="h-4 w-4" />
            AHNI Staff ({summary.ahni_staff || 0})
          </TabsTrigger>
          <TabsTrigger value="consultants" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Consultants ({summary.consultants || 0})
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4" />
            Vendors ({summary.vendors || 0})
          </TabsTrigger>
          <TabsTrigger value="others" className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Others ({summary.others || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ahni_staff" className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Action Required:</strong> These AHNI staff members need employee records
              created for payroll, benefits, and site visit participation.
            </AlertDescription>
          </Alert>

          {ahniStaff.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  All AHNI Staff Have Records!
                </h3>
                <p className="text-gray-600">
                  Every AHNI staff member has a complete employee record in the system.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ahniStaff.map((user: any) => renderUserCard(user, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="consultants" className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Note:</strong> Consultants use consultant profiles, not employee records.
              They can participate in site visits through their consultant profiles.
            </AlertDescription>
          </Alert>

          {consultants.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No consultants without profiles found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultants.map((user: any) => renderUserCard(user, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Alert className="border-gray-200 bg-gray-50">
            <InfoIcon className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-800">
              <strong>Note:</strong> Vendor accounts don't need employee records.
              They are managed through the procurement system.
            </AlertDescription>
          </Alert>

          {vendors.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No vendors without proper categorization found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((user: any) => renderUserCard(user, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="others" className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              These users may need manual review to determine if they need employee records.
            </AlertDescription>
          </Alert>

          {others.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No unclassified users found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {others.map((user: any) => renderUserCard(user, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
