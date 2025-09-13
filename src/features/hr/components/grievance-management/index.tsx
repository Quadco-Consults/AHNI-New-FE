"use client";

/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React, { useState } from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "components/atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import {
  useDeleteGrievance,
  useGetGrievances,
} from "@/features/hr/controllers/grievanceController";
import moment from "moment";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ConfirmationDialog from "components/ConfirmationDialog";

const GrievanceManagement: React.FC = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { data: grievants, isLoading: isLoadingCompliants } =
    useGetGrievances({ page: 1, size: 20 });
  const { deleteGrievance, isLoading: deleting } = useDeleteGrievance(
    selectedId
  );

  const onDelete = async () => {
    if (selectedId) {
      await deleteGrievance();
      setDialogOpen(false);
    }
  };

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
      header: "Title",
      accessorKey: "title",
      size: 200,
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 200,
    },
    {
      header: "Submit Date",
      accessorKey: "submit_date",
      size: 200,
      cell: ({ row }) => (
        <p>{moment(row?.original?.created_datetime).format("DD-MMM-YYYY")}</p>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_resolved",
      size: 200,
      cell: ({ getValue }) => {
        return (
          <Badge
            className={cn(
              "p-1 rounded-lg capitalize",
              getValue() === true
                ? "bg-green-50 text-green-500"
                : "bg-red-50 text-red-500"
            )}
          >
            {getValue() === true ? "Resolved" : ("Unresolved" as string)}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    return (
      <div className='flex gap-2'>
        <Link
          href={`/dashboard/hr/grievance-management/${data?.id}/details`}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton
          onClick={() => {
            setSelectedId(data?.id);
            setDialogOpen(true);
          }}
          className='bg-[#F9F9F9] hover:text-primary'
        >
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
          <FormButton
            onClick={() => {
              router.push("/dashboard/hr/grievance-management/create");
            }}
          >
            <AddSquareIcon />
            <p>Add New</p>
          </FormButton>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          //   onRowClick={(row) => {
          //     router.push("/c-and-g/grant-details/" + row?.original?.id);
          //   }}
          data={grievants?.data?.results ?? []}
          isLoading={isLoadingCompliants}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this complaint?'
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
        loading={deleting}
      />
    </div>
  );
};

export default GrievanceManagement;
