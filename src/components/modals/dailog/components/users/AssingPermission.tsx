import FormButton from "atoms/FormButton";
import { Card, CardContent } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { ScrollArea } from "components/ui/scroll-area";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import {
  useAddPermissionToRoleMutation,
  useLazyPermissionsQuery,
} from "services/users";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";

interface Permission {
  id: number;
  name: string;
  codename: string;
  module: string;
}

type TPermissionSelector = {
  // eslint-disable-next-line no-unused-vars
  updateSelectedPermissions: (permissions: number[]) => void;
};

const PermissionCheckbox: FC<{
  permission: Permission;
  checked: boolean;

  // eslint-disable-next-line no-unused-vars
  onChange: (checked: boolean) => void;
}> = ({ permission, checked, onChange }) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-md border px-2 py-3 cursor-pointer",
        checked ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
      )}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "h-4 w-4 rounded-sm border-2",
          checked ? "border-red-500 bg-red-500" : "border-gray-300"
        )}
      />
      <span className="text-xs font-medium">{permission.name}</span>
    </div>
  );
};

const PermissionSelector: FC<TPermissionSelector> = ({
  updateSelectedPermissions,
}) => {
  const [items, setItems] = useState<Permission[]>([]);

  const [fetchItems, { isLoading }] = useLazyPermissionsQuery();
  const fetchData = useCallback(
    async (page: number) => {
      const result = await fetchItems({
        page,
      }).unwrap();
      if (result.results) {
        setItems((prevItems) => [...prevItems, ...result.results]);
      } else {
        setItems((prevItems) => [...prevItems]);
      }
    },
    [fetchItems]
  );

  const { lastItemRef } = useInfiniteScroll({ fetchData });

  const { dialogProps } = useAppSelector(dailogSelector);

  const userPermission = dialogProps?.permission as unknown as Permission[];

  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (items.length > 0) {
      const allIds = userPermission.map((item) => item.id);
      const initialSelectedPermissions = items.reduce((acc, permission) => {
        acc[permission.id] = allIds.includes(permission.id); // All permissions from data.results are initially selected
        return acc;
      }, {} as { [key: number]: boolean });

      setSelectedPermissions(initialSelectedPermissions);
    }
  }, [items, userPermission]);

  useEffect(() => {
    updateSelectedPermissions(
      Object.entries(selectedPermissions)
        .filter(([, checked]) => checked)
        .map(([permissionId]) => parseInt(permissionId, 10))
    );
  }, [selectedPermissions, updateSelectedPermissions]);

  const handlePermissionChange =
    (permissionId: number) => (checked: boolean) => {
      setSelectedPermissions((prev) => ({ ...prev, [permissionId]: checked }));
    };

  return (
    <div className="grid grid-cols-5 gap-2 pb-10 ">
      {items?.map((permission, index) => (
        <div key={index} ref={items.length === index + 1 ? lastItemRef : null}>
          <PermissionCheckbox
            permission={permission}
            checked={selectedPermissions[permission.id]}
            onChange={handlePermissionChange(permission.id)}
          />
        </div>
      ))}
      {isLoading && <p className="text-lg text-center">Loading...</p>}
    </div>
  );
};

const AssignPermission = () => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const { dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useAppDispatch();
  const id = dialogProps?.id;
  const [addPermission, { isLoading }] = useAddPermissionToRoleMutation();

  const onSubmit = async () => {
    try {
      await addPermission({
        body: {
          items: selectedPermissions as unknown as string[],
        },
        id: String(id),
      }).unwrap();
      dispatch(closeDialog());
      toast.success("Permission added successfully");
    } catch (err: any) {
      toast.error("Error adding permission" || err?.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full py-7">
        <div className="w-full space-y-7">
          <div className="flex justify-center">
            <img src="/imgs/logo.png" alt="logo" className="text-center" />
          </div>
          <h2 className="text-3xl font-bold text-center ">Permissions</h2>
        </div>
      </div>
      <Card className="w-full mx-auto min-h-56">
        <CardContent className="w-full p-4">
          <ScrollArea className="h-[50vh]">
            <PermissionSelector
              updateSelectedPermissions={setSelectedPermissions}
            />
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex items-center mt-7 px-7">
        <div>
          <FormButton onClick={() => onSubmit()} loading={isLoading}>
            Save & Continue
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default AssignPermission;
