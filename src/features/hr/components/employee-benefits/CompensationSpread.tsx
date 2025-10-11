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
import CompensationSpreadModal from "./components/CompensationSpreadModal";
import { useAppDispatch } from "hooks/useStore";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { openDialog } from "store/ui";
import { useGetCompensationsSpread } from "@/features/hr/controllers/hrCompensationSpreadController";
import { CompensationSpreadItem } from "@/features/hr/types/compensation-spread";
import AddCompensationSpreadModal from "./components/AddCompensationSpreadModal";
import BulkUploadCompensationSpreadModal from "./components/BulkUploadCompensationSpreadModal";
import EditCompensationSpreadModal from "./components/EditCompensationSpreadModal";
import { toast } from "sonner";
import { useDeleteCompensationSpread } from "@/features/hr/controllers/hrCompensationSpreadController";

const Compensation: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedCompensationSpread, setSelectedCompensationSpread] = React.useState<CompensationSpreadItem | null>(null);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const { data: compensationsData, isLoading: isLoadingCompensations, refetch } =
    useGetCompensationsSpread();

  const { deleteCompensationSpread } = useDeleteCompensationSpread(itemToDelete || "");

  console.log({
    compensationsData,
    isLoadingCompensations,
  });

  const columns: ColumnDef<CompensationSpreadItem>[] = [
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
    {
      header: "Employee Number",
      accessorKey: "employeeNumber",
      cell: ({ row }) => <p>{row?.original?.employeeNumber || "N/A"}</p>,
      size: 150
    },
    {
      header: "Surname",
      accessorKey: "surname",
      cell: ({ row }) => <p>{row?.original?.surname || "N/A"}</p>,
      size: 150
    },
    {
      header: "Firstname",
      accessorKey: "firstname",
      cell: ({ row }) => <p>{row?.original?.firstname || "N/A"}</p>,
      size: 150
    },
    {
      header: "Position",
      accessorKey: "position",
      cell: ({ row }) => <p>{row?.original?.position || "N/A"}</p>,
      size: 150
    },
    {
      header: "Grade",
      accessorKey: "grade",
      cell: ({ row }) => <p>{row?.original?.grade || "N/A"}</p>,
      size: 100
    },
    {
      header: "Level",
      accessorKey: "level",
      cell: ({ row }) => <p>{row?.original?.level || "N/A"}</p>,
      size: 100
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => <p>{row?.original?.location || "N/A"}</p>,
      size: 150
    },
    {
      header: "Project",
      accessorKey: "projectName",
      cell: ({ row }) => <p>{row?.original?.projectName || "N/A"}</p>,
      size: 150
    },
    {
      header: "Hire Date",
      accessorKey: "hireDate",
      cell: ({ row }) => <p>{row?.original?.hireDate || "N/A"}</p>,
      size: 130
    },
    {
      header: "Basic",
      accessorKey: "basic",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.basic || "0")).toLocaleString()}</p>,
      size: 100
    },
    {
      header: "Housing",
      accessorKey: "housing",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.housing || "0")).toLocaleString()}</p>,
      size: 100
    },
    {
      header: "Transport",
      accessorKey: "transport",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.transport || "0")).toLocaleString()}</p>,
      size: 100
    },
    {
      header: "Meal",
      accessorKey: "meal",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.meal || "0")).toLocaleString()}</p>,
      size: 100
    },
    {
      header: "Miscellaneous",
      accessorKey: "miscellaneous",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.miscellaneous || "0")).toLocaleString()}</p>,
      size: 130
    },
    {
      header: "Total Allowance",
      accessorKey: "totalAllowance",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.totalAllowance || "0")).toLocaleString()}</p>,
      size: 150
    },
    {
      header: "13th Month",
      accessorKey: "thirteenthMonth",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.thirteenthMonth || "0")).toLocaleString()}</p>,
      size: 120
    },
    {
      header: "Gross Total",
      accessorKey: "grossTotal",
      cell: ({ row }) => <p>{parseFloat(String(row?.original?.grossTotal || "0")).toLocaleString()}</p>,
      size: 150
    },
    {
      header: "Action",
      id: "actions",
      size: 100,
      cell: ({ row }) => <ActionListAction item={row.original} />,
    },
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

  const handleEdit = (item: CompensationSpreadItem) => {
    setSelectedCompensationSpread(item);
    setEditModalOpen(true);
  };

  const handleDelete = async (item: CompensationSpreadItem) => {
    if (window.confirm(`Are you sure you want to delete compensation spread for ${item.firstname} ${item.surname}?`)) {
      setItemToDelete(item.id);
    }
  };

  React.useEffect(() => {
    if (itemToDelete && deleteCompensationSpread) {
      const performDelete = async () => {
        try {
          await deleteCompensationSpread();
          toast.success("Compensation spread deleted successfully");
          refetch();
        } catch (error) {
          toast.error("Failed to delete compensation spread");
        } finally {
          setItemToDelete(null);
        }
      };
      performDelete();
    }
  }, [itemToDelete, deleteCompensationSpread, refetch]);

  const ActionListAction = ({ item }: { item: CompensationSpreadItem }) => (
    <div className='flex gap-2'>
      <IconButton
        className='bg-[#F9F9F9] hover:text-primary'
        onClick={() => handleEdit(item)}
      >
        <Icon icon='ph:pencil-duotone' fontSize={15} />
      </IconButton>
      <IconButton
        className='bg-[#F9F9F9] hover:text-primary'
        onClick={() => handleDelete(item)}
      >
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
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setBulkUploadModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon icon='ph:upload-duotone' fontSize={20} />
            <p>Bulk Upload</p>
          </Button>
          <Button onClick={() => setAddModalOpen(true)}>
            <AddSquareIcon />
            <p>Add Employee Compensation</p>
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
        <AddCompensationSpreadModal
          isOpen={isAddModalOpen}
          onCancel={() => setAddModalOpen(false)}
          onSuccess={() => {
            refetch();
          }}
        />
        <BulkUploadCompensationSpreadModal
          isOpen={isBulkUploadModalOpen}
          onCancel={() => setBulkUploadModalOpen(false)}
          onSuccess={() => {
            refetch();
          }}
        />
        <EditCompensationSpreadModal
          isOpen={isEditModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedCompensationSpread(null);
          }}
          onSuccess={() => {
            refetch();
            setEditModalOpen(false);
            setSelectedCompensationSpread(null);
          }}
          compensationSpread={selectedCompensationSpread}
        />
      </div>
    </div>
  );
};

export default Compensation;
