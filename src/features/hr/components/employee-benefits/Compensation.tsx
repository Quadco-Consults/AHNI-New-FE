/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React, { useState } from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link"; import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import PayGroupModal from "./components/PayGroupModal";
import {
  useDeleteCompensation,
  useGetCompensations,
} from "@/features/hr/controllers/compensationController";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";

const Compensation: React.FC = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = React.useState(false);

  const { data: compensationsData, isLoading: isLoadingCompensations } =
    useGetCompensations();

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
      header: "Name",
      accessorKey: "name",
      size: 200,
      // cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Type",
      accessorKey: "type",
      size: 200,
    },
    {
      header: "Amount or %",
      accessorKey: "amount",
      size: 200,
      cell: ({ row }) => (
        <p>
          {row?.original?.percentage
            ? `${row?.original?.percentage}%`
            : row?.original?.amount}
        </p>
      ),
    },
    {
      header: "Position",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.pay_group?.position?.name}</p>,
    },
    {
      header: "Grade",

      size: 200,
      cell: ({ row }) => <p>{row?.original?.pay_group?.grade?.name}</p>,
    },
    {
      header: "Level",
      accessorKey: "level.name",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.pay_group?.level?.name}</p>,
    },
    {
      header: "Period",
      accessorKey: "period",
      size: 200,
    },

    {
      header: "",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { deleteCompensation, isLoading } = useDeleteCompensation();

    const handleDelete = async () => {
      try {
        await deleteCompensation(data?.id)();
      } catch (error: any) {
        toast.error(error.data.message ?? "Something went wrong");
      }
    };

    return (
      <div className='flex gap-2'>
        <Link
          href={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: "1" })}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
        <ConfirmationDialog
          open={dialogOpen}
          title='Are you sure you want to delete this tr'
          loading={isLoading}
          onCancel={() => setDialogOpen(false)}
          onOk={handleDelete}
        />
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
            href="/dashboard/hr/employee-benefit/new-compensation"
          >
            <Button>
              <AddSquareIcon />
              <p>Add New</p>
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
