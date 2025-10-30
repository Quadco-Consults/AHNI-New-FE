import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import RoleList from "./RoleList";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useState } from "react";
import { Shield, Users, Key, Info, UserPlus, Settings } from "lucide-react";
import { Card, CardContent } from "components/ui/card";
import UserRoleAssignmentTab from "./UserRoleAssignmentTab";

const Authorization = () => {
  const [tab, setTab] = useState("role");

  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6">
      {/* Clean Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role & Permission Management</h1>
          <p className="text-gray-600 mt-1">Create roles, assign permissions, and manage user access</p>
        </div>
        <Button
          size="lg"
          className="gap-2"
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddNewRoleModal,
                dialogProps: {
                  header: "Create New Role",
                  width: "max-w-md",
                  height: "max-h-[700px]",
                },
              })
            )
          }
        >
          <AddSquareIcon />
          Create Role
        </Button>
      </div>

      {/* Simple Process Guide */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">How to manage roles:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>1.</strong> Click "Create Role" to add a new role</p>
                <p><strong>2.</strong> Click "Permissions" on any role card to assign permissions</p>
                <p><strong>3.</strong> Use "User Assignments" tab to assign roles to users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Tabs Section */}
      <Tabs
        defaultValue="role"
        className="space-y-6"
        onValueChange={(value) => {
          setTab(value);
        }}
      >
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="role"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              <Shield className="w-4 h-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              <Users className="w-4 h-4 mr-2" />
              User Assignments
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="role" className="space-y-4 mt-6">
          <RoleList />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          <UserRoleAssignmentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Authorization;
