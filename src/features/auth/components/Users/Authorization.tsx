import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleList from "./RoleList";
import { Button } from "@/components/ui/button";
import { openDialog } from "@/store/ui";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { DialogType } from "@/constants/dailogs";
import { useAppDispatch } from "@/hooks/useStore";
import { useState } from "react";
import { Shield, Users, Key, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePermissions } from "@/hooks/usePermissions";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { isUserAdmin } from "@/utils/positionRolePermissions";

const Authorization = () => {
  const [tab, setTab] = useState("role");
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useGetUserProfile();
  const { isAdmin } = usePermissions();

  const dispatch = useAppDispatch();

  // Extract user data from API response - the response should be TResponse<IUser>
  // So user data should be at userProfile?.data
  let user = userProfile?.data;

  // Enhanced admin check for role management access
  const canManageRoles = user ? (isUserAdmin(user) || user.is_superuser === true || isAdmin) : false;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Authorization</h1>
              <p className="text-sm text-gray-500">Manage roles and permissions</p>
            </div>
          </div>
        </div>

        {tab === "role" && (
          <div className="flex flex-col items-end gap-2">
            {!canManageRoles && (
              <span className="text-xs text-red-500">
                Role management requires admin permissions
              </span>
            )}
            <Button
              size="lg"
              className="gap-2"
              disabled={!canManageRoles}
              onClick={() => {
                if (!canManageRoles) {
                  return;
                }

                try {
                  const action = openDialog({
                    type: DialogType.AddNewRoleModal,
                    dialogProps: {
                      header: "Add New Role",
                      width: "max-w-md",
                      height: "max-h-[700px]",
                    },
                  });
                  dispatch(action);
                } catch (error) {
                  console.error('Error opening add role dialog:', error);
                }
              }}
            >
              <AddSquareIcon />
              Add New Role
            </Button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-xs text-gray-500 mt-1">Define user access levels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Key className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-xs text-gray-500 mt-1">Control what users can do</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Info className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quick Tip</p>
                <p className="text-xs text-gray-500 mt-1">Click role to manage permissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Tabs Section */}
      <Tabs
        defaultValue="role"
        className="space-y-4"
        onValueChange={(value) => {
          setTab(value);
        }}
      >
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger
            value="role"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Shield className="w-4 h-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="role" className="space-y-4">
          <RoleList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Authorization;
