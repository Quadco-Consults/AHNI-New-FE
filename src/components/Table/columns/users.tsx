import { createColumnHelper } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Button } from "components/ui/button";

import { MoreHorizontal, Edit, RefreshCw, UserMinus } from "lucide-react";
import { TUser } from "definations/users";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";

// Action handlers (implement these in your component)

// eslint-disable-next-line react-refresh/only-export-components
const ActionDropdown = ({
  id,
  first_name,
  last_name,
  phone_number,
  designation,
  gender,
  email,
}: TUser) => {
  const dispatch = useAppDispatch();

  const handleEdit = (id: string) => {
    dispatch(
      openDialog({
        type: DialogType.EditUser,
        dialogProps: {
          ...mediumDailogScreen,
          header: "Edit User",
          data: JSON.stringify({
            id,
            first_name,
            last_name,
            phone_number,
            designation,
            gender,
            email,
          }),
        },
      })
    );
    console.log("Edit user with id:", id);
    // Implement edit logic
  };

  const handleUpdate = (id: string) => {
    console.log("Update user with id:", id);
    // Implement update logic
  };

  const handleDeactivate = (id: string) => {
    console.log("Deactivate user with id:", id);
    // Implement deactivate logic
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer "
          onClick={() => handleEdit(id)}
        >
          <Edit className="w-4 h-4 mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer "
          onClick={() => handleUpdate(id)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>Update Role</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer "
          onClick={() => handleDeactivate(id)}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          <span>Deactivate User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const columnHelper = createColumnHelper<TUser>();

export const userColums = [
  columnHelper.accessor("fullName", {
    header: "Full Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("position", {
    header: "Position",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("roles", {
    header: "Roles",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: "",
    cell: ({ row }) => <ActionDropdown {...row.original} />, // This represents the actions column with the three dots
  }),
];
