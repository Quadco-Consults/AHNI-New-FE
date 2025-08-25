import { TabsContent } from "@radix-ui/react-tabs";
import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import RoleList from "./RoleList";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useState } from "react";

const Authorization = () => {
  const [tab, setTab] = useState("role");

  const dispatch = useAppDispatch();

  return (
    <div>
      <div className='flex items-center justify-between'>
        <BackNavigation extraText='Authorization' />

        {tab === "role" && (
          <Button
            className='float-end'
            onClick={() =>
              dispatch(
                openDialog({
                  type: DialogType.AddNewRoleModal,
                  dialogProps: {
                    header: "Add New Role",
                    width: "max-w-md",
                    height: "max-h-[700px]",
                  },
                })
              )
            }
          >
            <AddSquareIcon />
            Add New Role
          </Button>
        )}
      </div>
      <div>
        <Tabs
          defaultValue='role'
          onValueChange={(value) => {
            setTab(value);
          }}
        >
          <TabsList>
            <TabsTrigger value='role'>Roles</TabsTrigger>
          </TabsList>
          <TabsContent value='role'>
            <RoleList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authorization;
