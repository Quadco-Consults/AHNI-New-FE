import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";

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
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import {
  DialogType,
  largeDailogScreen,
  mediumDailogScreen,
} from "constants/dailogs";
import { useState } from "react";
import {
  useActivateUser,
  useDeactivateUser,
} from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import { Badge } from "components/ui/badge";
import { IUser } from "features/auth/types/user";

const TableAction = ({
  id,
  first_name,
  last_name,
  mobile_number,
  designation,
  gender,
  email,
  is_active,
  roles,
  position,
  department,
}: IUser) => {
  // Don't render if no valid ID
  if (!id || id === "" || id === "undefined") {
    return (
      <div className="text-red-500 text-xs">
        Invalid ID
      </div>
    );
  }

  return (
    <TableActionWithHooks 
      id={id}
      first_name={first_name}
      last_name={last_name}
      mobile_number={mobile_number}
      designation={designation}
      gender={gender}
      email={email}
      is_active={is_active}
      roles={roles}
      position={position}
      department={department}
    />
  );
};

const TableActionWithHooks = ({
  id,
  first_name,
  last_name,
  mobile_number,
  designation,
  gender,
  email,
  is_active,
  roles,
  position,
  department,
}: IUser) => {
  const dispatch = useAppDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);

  const { activateUser } = useActivateUser(id);
  const { deactivateUser } = useDeactivateUser(id);

  const handleEdit = () => {
    dispatch(
      openDialog({
        type: DialogType.EditUser,
        dialogProps: {
          ...mediumDailogScreen,
          header: "Edit User",
          data: {
            id,
            first_name,
            last_name,
            mobile_number,
            designation,
            gender,
            email,
            position,
            department,
            roles,
          },
        },
      })
    );
  };

  const handleUpdate = () => {
    dispatch(
      openDialog({
        type: DialogType.AssingRoleToUser,
        dialogProps: {
          ...largeDailogScreen,
          id,
          roles: roles as unknown as string,
        },
      })
    );
  };

  const handleToggleStatus = async () => {
    try {
      if (is_active) {
        await deactivateUser();
        toast.success("User Deactivated");
      } else {
        await activateUser();
        toast.success("User Activated");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
    } finally {
      setDialogOpen(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='w-8 h-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer '
            onClick={() => handleEdit(id)}
          >
            <Edit className='w-4 h-4 mr-2' />
            <span>Edit User</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer '
            onClick={() => handleUpdate(id)}
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            <span>Update Role</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => setDialogOpen(true)}
          >
            <UserMinus className='w-4 h-4 mr-2' />
            <span>{is_active ? "Deactivate User" : "Activate User"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you certain you want to perform this action?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible, but you will have the option to
              reactivate/deactivate them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const userColumns: ColumnDef<IUser>[] = [
  {
    header: "Full Name",
    id: "full_name",
    accessorFn: ({ first_name, last_name }) => `${first_name} ${last_name}`,
  },

  {
    header: "Email",
    id: "email",
    accessorKey: "email",
  },

  {
    header: "Phone Number",
    id: "mobile_number",
    accessorKey: "mobile_number",
  },

  {
    header: "Gender",
    id: "gender",
    accessorKey: "gender",
  },
  {
    header: "Location",
    id: "location",
    accessorKey: "location",
  },
  {
    header: "State",
    id: "state",
    accessorKey: "state",
  },

  {
    header: "Address",
    id: "address",
    accessorKey: "address",
  },

  {
    header: "Department",
    accessorKey: "department.name",
    id: "department",
  },

  {
    header: "Position",
    accessorKey: "position.name",
    id: "position",
  },

  {
    header: "Roles",
    id: "roles",

    cell: ({ row: { original } }) => {
      const roles = original.roles.map((role) => role.name).join(", ");
      return <span>{roles}</span>;
    },
  },

  {
    header: "Status",
    id: "is_active",
    cell: ({
      row: {
        original: { is_active },
      },
    }) => {
      const className = is_active ? "bg-green-500" : "bg-red-500";
      const label = is_active ? "Activated" : "Deactivated";

      return <Badge className={className}>{label}</Badge>;
    },
  },

  {
    header: "User Type",
    id: "user_type",
    accessorKey: "user_type",
    cell: ({
      row: {
        original: { user_type },
      },
    }) => {
      const formatUserType = (type: string) => {
        switch (type) {
          case "AHNI_STAFF":
            return "AHNi Staff";
          case "ADHOC_STAFF":
            return "Adhoc Staff";
          case "CONSULTANT":
            return "Consultant";
          case "FACILITATOR":
            return "Facilitator";
          case "VENDOR":
            return "Vendor";
          case "ADMIN":
            return "Admin";
          default:
            return type;
        }
      };

      return <span>{formatUserType(user_type)}</span>;
    },
  },

  {
    header: "Actions",
    id: "action",
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];
