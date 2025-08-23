/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import PayGroupModal from "../components/PayGroupModal";
import { useGetPayRolls } from "@/features/hr/controllers/hrPayRollController";

const Payroll: React.FC = () => {
  const router = useRouter();

  const { data: payRollsData, isLoading: isLoadingPayGroups } =
    useGetPayRolls();

  console.log({ payRollsData, isLoadingPayGroups });

  const [isModalOpen, setModalOpen] = React.useState(false);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    {
      header: "Month",
      accessorKey: "month",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Total Payment",
      accessorKey: "total_payment",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Total Deduction",
      accessorKey: "total_deduction",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Gross Payment",
      accessorKey: "gross_payment",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },

    {
      header: "",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    console.log(data);
    return (
      <div className='flex gap-2'>
        <Link
          href="/dashboard/hr/employee-benefit/pay-roll/1"
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />

          <Button variant='ghost' className=''>
            <FilterIcon2 />
          </Button>
        </div>
        <div className='flex items-center'>
          <Link
            className='w-full'
            href="/dashboard/hr/employee-benefit/pay-roll/create"
          >
            <Button>
              <AddSquareIcon />
              <p>Generate Payroll</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          //   onRowClick={(row) => {
          //     router.push("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={[]}
          // isLoading={true}
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

export default Payroll;
