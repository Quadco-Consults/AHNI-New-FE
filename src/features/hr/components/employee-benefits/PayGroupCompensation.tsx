/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import React, { useState } from "react";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import IconButton from "@/components/IconButton";
import { Trash2 } from 'lucide-react';
import { Icon } from "@iconify/react";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import {
  useGetPayGroupCompensations,
  useDeletePayGroupCompensation,
} from "@/features/hr/controllers/payGroupCompensationController";
import { PayGroupCompensation as PayGroupCompensationType } from "@/features/hr/types/pay-group-compensation";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import PayGroupCompensationModal from "./components/PayGroupCompensationModal";

const PayGroupCompensation: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCompensation, setSelectedCompensation] = useState<PayGroupCompensationType | null>(null);

  const { data: compensationsData, isLoading, refetch } = useGetPayGroupCompensations();

  const columns: ColumnDef<PayGroupCompensationType>[] = [
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
      header: "Position",
      accessorKey: "pay_group.position.name",
      cell: ({ row }) => <p>{row?.original?.pay_group?.position?.name || "N/A"}</p>,
      size: 200,
    },
    {
      header: "Grade",
      accessorKey: "pay_group.grade.name",
      cell: ({ row }) => <p>{row?.original?.pay_group?.grade?.name || "N/A"}</p>,
      size: 150,
    },
    {
      header: "Level",
      accessorKey: "pay_group.level.name",
      cell: ({ row }) => <p>{row?.original?.pay_group?.level?.name || "N/A"}</p>,
      size: 150,
    },
    {
      header: "Basic",
      accessorKey: "basic",
      cell: ({ row }) => <p>{row?.original?.basic?.toLocaleString() || "0"}</p>,
      size: 120,
    },
    {
      header: "Housing",
      accessorKey: "housing",
      cell: ({ row }) => <p>{row?.original?.housing?.toLocaleString() || "0"}</p>,
      size: 120,
    },
    {
      header: "Transport",
      accessorKey: "transport",
      cell: ({ row }) => <p>{row?.original?.transport?.toLocaleString() || "0"}</p>,
      size: 120,
    },
    {
      header: "Meal",
      accessorKey: "meal",
      cell: ({ row }) => <p>{row?.original?.meal?.toLocaleString() || "0"}</p>,
      size: 120,
    },
    {
      header: "Miscellaneous",
      accessorKey: "miscellaneous",
      cell: ({ row }) => <p>{row?.original?.miscellaneous?.toLocaleString() || "0"}</p>,
      size: 130,
    },
    {
      header: "13th Month",
      accessorKey: "thirteenth_month",
      cell: ({ row }) => <p>{row?.original?.thirteenth_month?.toLocaleString() || "0"}</p>,
      size: 120,
    },
    {
      header: "",
      id: "actions",
      size: 120,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { deletePayGroupCompensation, isLoading: isDeleting } = useDeletePayGroupCompensation(
      data?.original?.id
    );

    const handleEdit = () => {
      setSelectedCompensation(data?.original);
      setModalOpen(true);
    };

    const handleDelete = async () => {
      try {
        await deletePayGroupCompensation();
        toast.success("Pay group compensation deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error.data?.message ?? "Something went wrong");
      }
    };

    return (
      <div className='flex gap-2'>
        <IconButton
          className='bg-alternate-light hover:text-primary'
          onClick={handleEdit}
        >
          <Icon icon='ph:pencil-duotone' fontSize={15} />
        </IconButton>
        <IconButton
          className='bg-alternate-light hover:text-primary'
          onClick={() => setDialogOpen(true)}
        >
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
        <ConfirmationDialog
          open={dialogOpen}
          title='Are you sure you want to delete this compensation template?'
          loading={isDeleting}
          onCancel={() => setDialogOpen(false)}
          onOk={handleDelete}
        />
      </div>
    );
  };

  const handleAddNew = () => {
    setSelectedCompensation(null);
    setModalOpen(true);
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />
          <Button variant='ghost'>
            <FilterIcon2 />
          </Button>
        </div>
        <div className='flex items-center'>
          <Button onClick={handleAddNew}>
            <AddSquareIcon />
            <p>Add Compensation Template</p>
          </Button>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          data={compensationsData?.data?.results || []}
          isLoading={isLoading}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
        <PayGroupCompensationModal
          isOpen={isModalOpen}
          onCancel={() => {
            setModalOpen(false);
            setSelectedCompensation(null);
          }}
          onSuccess={() => {
            refetch();
          }}
          compensation={selectedCompensation}
        />
      </div>
    </div>
  );
};

export default PayGroupCompensation;
