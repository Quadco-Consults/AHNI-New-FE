import { useState } from "react";

import { ColumnDef, Row } from "@tanstack/react-table";
import AddSquareIcon from "components/icons/AddSquareIcon";

import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import SearchIcon from "components/icons/SearchIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { HrRoutes } from "constants/RouterConstants";
import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import { WorkforceResults } from "definations/hr-types/workforce";
import { generatePath, Link } from "react-router-dom";
import {
  useGetEmployeeOnboardingsQuery,
  useDeleteEmployeeOnboardingMutation,
} from "services/hrApi/hr-employee-onboarding";

import { toast } from "sonner";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

const WorkforceDatabase = () => {
  const [employeeID, setEmployeedId] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading: getLoading } = useGetEmployeeOnboardingsQuery({});

  const [deleteEmployeeOnboarding, { isLoading }] =
    useDeleteEmployeeOnboardingMutation();

  // console.log(data);

  const handleDelete = (id: string) => {
    setEmployeedId(id);
    setDialogOpen(true);
  };

  const confirmHandleDelete = async () => {
    try {
      await deleteEmployeeOnboarding(employeeID).unwrap();
      toast.success("Payment Request Deleted");
    } catch (error: any) {
      console.log("Employee delete: ", error);
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const columns: ColumnDef<EmployeeOnboarding>[] = [
    {
      header: "Staff ID",
      id: "staff_id",
      accessorKey: "serial_id_code",
      size: 150,
    },
    {
      header: "Staff Name",
      id: "staff_name",
      accessorFn: (data) => `${data.legal_firstname} ${data.legal_lastname}`,
      size: 150,
    },
    {
      header: "Position",
      accessorKey: "position",
      accessorFn: (data) => `${data.designation.name}`,
      size: 100,
    },
    {
      header: "Employment Type",
      accessorFn: (data) => `${data.employment_type}`,
      size: 130,
    },
    {
      header: "Email",
      id: "email",
      accessorFn: (data) => `${data.location.email}`,
      size: 130,
    },
    {
      header: "Action",
      id: "actions",
      size: 50,
      cell: ({ row }) => <ActionList data={row} />,
    },
  ];

  const ActionList = ({ data }: { data: Row<EmployeeOnboarding> }) => {
    // console.log("Workforce", data.original);

    return (
      <div className='flex items-center gap-2'>
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='ghost' className='flex gap-2 py-6'>
                <MoreOptionsHorizontalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=' w-fit'>
              <div className='flex flex-col items-start justify-between gap-1'>
                <Link
                  to={generatePath(HrRoutes.WORKFORCE_DATABASE_DETAIL, {
                    id: data.original.id,
                  })}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EyeIcon />
                    View
                  </Button>
                </Link>

                {/* <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <ApproveIcon />
                Approval
              </Button> */}

                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => handleDelete(data.original.id)}
                >
                  <DeleteIcon />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Link to={HrRoutes.WORKFORCE_DATABASE_CREATE}>
          <Button>
            <AddSquareIcon /> Add New Employee
          </Button>
        </Link>
      </div>

      <Card className='space-y-4'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              className='ml-2 h-6 border-none bg-none focus:outline-none outline-none w-[100%]'
              // onChange={onchange}
              type='text'
              placeholder='Search...'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={data?.data.results || []}
          columns={columns}
          isLoading={getLoading}
        />
      </Card>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this payment request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={confirmHandleDelete}
      />
    </div>
  );
};

export default WorkforceDatabase;
