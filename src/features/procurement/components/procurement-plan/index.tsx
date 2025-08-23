"use client";

import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import UploadIcon from "components/icons/UploadIcon";
import { useState } from "react";
import ProcurementPlanUploadModal from "./components/ProcurementPlanUploadModal";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";

export default function ProcurementPlan() {
  const [isModalOpen, setModalOpen] = useState(false);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: false },
  ];

  const dummyProcurementData = [
    {
      id: 1,
      date: "Accelerating Control of the HIV Epidemic in Nigeria(CLUSTER 1)",
      description: "Oct-24 to Sep-25",
    },

    // PROCUREMENT PLAN -Accelerating Control of the HIV Epidemic in Nigeria(CLUSTER 1)
    // FY25(Oct-24 to Sep-25)
    // HEALTH AND NON-HEALTH PRODUCTS

    // {
    //   id: 2,
    //   date: "Rehabilitation of Boreholes in Northern Region",
    //   description: "2024",
    // },
    // {
    //   id: 3,
    //   date: "Construction of Primary Health Centres",
    //   description: "2025",
    // },
    // {
    //   id: 4,
    //   date: "Supply of Laptops for Education Program",
    //   description: "2023",
    // },
    // {
    //   id: 5,
    //   date: "Renovation of Government Schools",
    //   description: "2025",
    // },
  ];

  return (
    <section className='min-h-screen space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex items-center justify-end gap-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6'>
              <AddSquareIcon />
              New Procurement Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Button
                className='w-full flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={() => setModalOpen(true)}
              >
                <UploadIcon /> Upload Procurement plan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Card className='space-y-5'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
            />
          </div>
        </div>

        <DataTable
          // @ts-ignore
          // data={procurementData?.data?.results || []}
          data={dummyProcurementData}
          // @ts-ignore
          columns={columns}
          // isLoading={isLoading}
        />

        <ProcurementPlanUploadModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          // @ts-ignore
          // onOk={(data: any) => formatRawData(data)}
          onOK={() => {}}
        />
      </Card>
    </section>
  );
}

const columns: ColumnDef<any>[] = [
  {
    header: "S/N",
    accessorKey: "id",
    size: 50,
  },
  {
    header: "Procurement Plan",
    accessorKey: "date",
  },
  {
    header: "Financial Year",
    accessorKey: "description",
    size: 100,
  },
  {
    header: "Actions",
    id: "actions",
    size: 50,
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

// eslint-disable-next-line no-unused-vars
const ActionListAction = ({ data }: any) => {
  return (
    <div className='flex gap-2 items-center justify-center'>
      <Link
        href={`/dashboard/procurement/procurement-plan/${data?.id || 1}`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary border'>
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </Link>
    </div>
  );
};
