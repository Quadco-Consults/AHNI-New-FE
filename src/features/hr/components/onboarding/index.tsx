import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import EyeIcon from "components/icons/EyeIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import SearchIcon from "components/icons/SearchIcon";
import Card from "components/Card";
import { Loading } from "components/Loading";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { HrRoutes } from "constants/RouterConstants";
import { TOnboarding } from "definations/hr-types/hr-beneficiary";
import { cn } from "lib/utils";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  useGetEmployeeOnboardings,
  useDeleteEmployeeOnboarding,
} from "@/features/hr/controllers/employeeOnboardingController";
import ApplicationsTable from "../advertisement/table/ApplicationsTable";

import DeleteIcon from "components/icons/DeleteIcon";

import { toast } from "sonner";
import ConfirmationDialog from "components/ConfirmationDialog";

const Onboarding = () => {
  const [employeeID, setEmployeedId] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { data: employeeData, isLoading: fetchingEmployeeData } =
    useGetEmployeeOnboardings({});

  const { deleteEmployeeOnboarding, isLoading } =
    useDeleteEmployeeOnboarding();

  console.log('employeeData:', employeeData);
  console.log('employeeData?.data?.results:', employeeData?.data?.results);

  const handleDelete = (id: string) => {
    setEmployeedId(id);
    setDialogOpen(true);
  };

  const confirmHandleDelete = async () => {
    try {
      await deleteEmployeeOnboarding(employeeID);
      toast.success("Employee Onboarding Deleted");
    } catch (error: any) {
      console.log("Employee delete: ", error);
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  if (fetchingEmployeeData) {
    return <Loading />;
  }

  const columns: ColumnDef<any>[] = [
    {
      header: "Staff Name",
      accessorFn: (data) => `${data.legal_firstname} ${data.legal_lastname}`,
      size: 150,
    },
    {
      header: "Position",
      accessorKey: "designation.name",
      size: 100,
    },
    {
      header: "Employment Type",
      accessorKey: "employment_type",
      size: 130,
    },
    {
      header: "Email",
      accessorKey: "location.email",
      size: 130,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 100,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "APPROVED" && "bg-green-200 text-green-500",
              getValue() === "Reject" && "bg-red-200 text-red-500",
              getValue() === "New" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      id: "actions",
      size: 50,
      cell: ({ row }) => <ActionList data={row.original} />,
    },
  ];

  const ActionList = ({ data }: { data: any }) => {
    // console.log(data);
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
              <Link
                href={`/dashboard/hr/onboarding/start-onboarding/${data?.id}/`}
                className='flex flex-col items-start justify-between gap-1'
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  Edit
                </Button>
              </Link>

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => handleDelete(data.id)}
              >
                <DeleteIcon />
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  const TABS = [
    {
      label: "Accepted Applicants",
      value: "accepted",
      // @ts-ignore
      children: <ApplicationsTable status='ACCEPTED' isOnboardingPage={true} />,
    },
    {
      label: "Employees",
      value: "employees",
      // @ts-ignore
      children: (
        <>
          <div className='flex items-center justify-start gap-2 py-4'>
            <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
              <SearchIcon />
              <input
                placeholder='Search'
                type='text'
                className='ml-2 h-6 border-none w-full bg-none focus:outline-none outline-none'
              />
            </span>
            <Button className='shadow-sm' variant='ghost'>
              <FilterIcon />
            </Button>
          </div>
          <DataTable
            data={employeeData?.data?.results || []}
            columns={columns}
            isLoading={fetchingEmployeeData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Card className='space-y-4'>
        <Tabs defaultValue='accepted'>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Card className='px-6'>{tab.children}</Card>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this payment request?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={confirmHandleDelete}
      />
    </>
  );
};

export default Onboarding;

// const data: TOnboarding[] = Array(5).fill({
//   staff_name: "James Septimus",
//   position: "Technical Associate",
//   employment_type: "Technical Associate",
//   email: "Technical Associate",
//   status: "New",
// });
