/* eslint-disable no-unused-vars */
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { HrRoutes, RouteEnum } from "constants/RouterConstants";

import DataTable from "components/Table/DataTable";
import SearchBar from "components/atoms/SearchBar";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import PayGroupModal from "./components/PayGroupModal";
import { useAppDispatch } from "hooks/useStore";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { openDialog } from "store/ui";
import { useGetCompensationsSpread } from "@/features/hr/controllers/hrCompensationSpreadController";

interface CompensationItem {
  id: string;
  employeeNumber: string;
  surname: string;
  firstname: string;
  position: string;
  grade: string;
  location: string;
  project: string;
  hireDate: string;
  basic: number;
  housing: number;
  transport: number;
  meal: number;
  miscellaneous: number;
  totalAllowance: number;
  thirteenthMonth: number;
  grossTotal: number;
}

const Compensation: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = React.useState(false);

  const { data: compensationsData, isLoading: isLoadingCompensations } =
    useGetCompensationsSpread();

  console.log({
    compensationsData,
    isLoadingCompensations,
  });

  const columns: ColumnDef<CompensationItem>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      header: "S/No",
      id: "serial",
      cell: ({ row }) => <p>{row.index + 1}</p>,
      size: 50,
    },
    { header: "Employee Number", accessorKey: "employeeNumber", size: 150 },
    { header: "Surname", accessorKey: "surname", size: 150 },
    { header: "Firstname", accessorKey: "firstname", size: 150 },
    { header: "Position", accessorKey: "position", size: 150 },
    { header: "Grade", accessorKey: "grade", size: 100 },
    { header: "Location", accessorKey: "location", size: 150 },
    { header: "Project", accessorKey: "project", size: 150 },
    { header: "Hire Date", accessorKey: "hireDate", size: 130 },
    { header: "Basic", accessorKey: "basic", size: 100 },
    { header: "Housing", accessorKey: "housing", size: 100 },
    { header: "Transport", accessorKey: "transport", size: 100 },
    { header: "Meal", accessorKey: "meal", size: 100 },
    { header: "Miscellaneous", accessorKey: "miscellaneous", size: 130 },
    { header: "Total Allowance", accessorKey: "total_allowance", size: 150 },
    { header: "13th Month", accessorKey: "thirteenth_month", size: 120 },
    { header: "Gross Total", accessorKey: "gross_total", size: 150 },
    // {
    //   header: "Action",
    //   id: "actions",
    //   size: 100,
    //   cell: ({ row }) => <ActionListAction id={row.original.id} />,
    // },
  ];

  const handleOpenDialog = () => {
    dispatch(
      openDialog({
        type: DialogType.PAY_ADVICE,
        dialogProps: {
          ...mediumDailogScreen,
          header: "PAY ADVICE FOR: September 2023",
          data: "1",
        },
      })
    );
  };

  const ActionListAction = ({ id }: { id: string }) => (
    <div className='flex gap-2'>
      <IconButton
        className='bg-[#F9F9F9] hover:text-primary'
        onClick={handleOpenDialog}
      >
        <Icon icon='ph:eye-duotone' fontSize={15} />
      </IconButton>
      <IconButton className='bg-[#F9F9F9] hover:text-primary'>
        <Icon icon='ant-design:delete-twotone' fontSize={15} />
      </IconButton>
    </div>
  );

  return (
    <div className='flex flex-col justify-center items-center gap-y-4'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <SearchBar onchange={() => ""} />
          <Button variant='ghost'>
            <FilterIcon2 />
          </Button>
        </div>
      </div>

      <div className='w-full'>
        <DataTable
          // @ts-ignore
          columns={columns}
          // data={dummyData} // Replace with real data source
          data={compensationsData?.data?.results || []} // ✅ Ensure data is always an array
          isLoading={isLoadingCompensations}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />

        <PayGroupModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => {}}
        />
      </div>
    </div>
  );
};

export default Compensation;
const dummyData: CompensationItem[] = [
  {
    id: "1",
    employeeNumber: "EMP001",
    surname: "Johnson",
    firstname: "Alice",
    position: "Software Engineer",
    grade: "5A",
    location: "Lagos",
    project: "Palm Estate ERP",
    hireDate: "2020-03-15",
    basic: 150000,
    housing: 50000,
    transport: 20000,
    meal: 10000,
    miscellaneous: 5000,
    totalAllowance: 85000,
    thirteenthMonth: 12000,
    grossTotal: 247000,
  },
  {
    id: "2",
    employeeNumber: "EMP002",
    surname: "Oladipo",
    firstname: "Tunde",
    position: "Field Supervisor",
    grade: "4B",
    location: "Ogun",
    project: "Palm Estate Field Ops",
    hireDate: "2019-07-20",
    basic: 120000,
    housing: 40000,
    transport: 15000,
    meal: 8000,
    miscellaneous: 3000,
    totalAllowance: 66000,
    thirteenthMonth: 10000,
    grossTotal: 196000,
  },
  {
    id: "3",
    employeeNumber: "EMP003",
    surname: "Ahmed",
    firstname: "Zainab",
    position: "Accountant",
    grade: "6C",
    location: "Abuja",
    project: "Finance & Reporting",
    hireDate: "2021-01-10",
    basic: 170000,
    housing: 60000,
    transport: 25000,
    meal: 15000,
    miscellaneous: 8000,
    totalAllowance: 108000,
    thirteenthMonth: 14000,
    grossTotal: 292000,
  },
];
