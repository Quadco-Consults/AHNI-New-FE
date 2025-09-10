"use client";

"use client";

/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "components/ui/input";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import GoBack from "components/GoBack";
import { useGetAllVendorEvaluations, useDeleteVendorEvaluation } from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import IconButton from "components/IconButton";
import { toast } from "sonner";

const VendorPerformance = () => {
  const { data, isLoading } = useGetAllVendorEvaluations({});

  return (
    <div className='space-y-10'>
      <GoBack />

      <Card className='space-y-10'>
        <div className='space-y-5'>
          <div className='flex items-center justify-between mt-1'>
            <div className='flex items-center gap-2 '>
              <div className='flex items-center w-[300px] px-2 py-2 border rounded-lg'>
                <Icon icon='iconamoon:search-light' fontSize={25} />
                <Input
                  placeholder='Search Category'
                  type='search'
                  className='h-6 border-none bg-none'
                />
              </div>
            </div>
            <Link
              href="/dashboard/procurement/vendor-performance/form"
            >
              <Button>
                <span>
                  <Plus size={20} />
                </span>
                Add Evaluation Form{" "}
              </Button>
            </Link>
          </div>
        </div>

        <DataTable
          columns={columns}
          // @ts-ignore
          data={data?.data?.results || []}
          // data={[]}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default VendorPerformance;

// const columns: ColumnDef<VendorsResultsData>[] = [
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
    header: "Vendor Name",
    accessorKey: "vendor",
    size: 250,
    cell: ({ row }) => {
      const vendorName = row.original.vendor?.name || "N/A"; // Fallback to "N/A" if vendor is null
      return vendorName;
    },
  },
  {
    header: "Vendor Service",
    accessorKey: "service",
    size: 250,
  },
  {
    header: "Location of Service",
    accessorKey: "location_of_service",
    size: 200,
  },
  {
    header: "Review Start Period",
    accessorKey: "reviewed_period_start",
    size: 200,
  },
  {
    header: "Review End Period",
    accessorKey: "reviewed_period_end",
    size: 200,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-800",
            getValue() === "COMPLETED" && "bg-green-200 text-green-800"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },

  {
    header: "Recommendation",
    accessorKey: "evaluator_recommendation",
    cell: ({ getValue, row }) => {
      const value = getValue() as string;
      const status = row.original.status;
      // If status is PENDING and recommendation is BARRED, show PENDING instead
      const displayValue = (status === "PENDING" && value === "BARRED") ? "PENDING" : (value || "PENDING");
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            displayValue === "BARRED" && "bg-red-200 text-red-800",
            displayValue === "ON_PROBATION" && "bg-yellow-200 text-yellow-800",
            displayValue === "RETAIN" && "bg-green-200 text-green-800",
            displayValue === "PENDING" && "bg-blue-200 text-blue-800"
          )}
        >
          {displayValue}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  const { deleteVendorEvaluation } = useDeleteVendorEvaluation(data.id);

  const deleteVendorHandler = async (id: string) => {
    try {
      await deleteVendorEvaluation();
      toast.success("Document successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className='flex gap-2'>
      <Link
        href={`/dashboard/procurement/vendor-performance/${data.id}`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </Link>
      <IconButton
        onClick={() => deleteVendorHandler(data.id)}
        className='bg-[#F9F9F9] hover:text-primary'
      >
        <Icon icon='ant-design:delete-twotone' fontSize={15} />
      </IconButton>

      <Link
        href={`/dashboard/procurement/vendor-performance/${data.id}/form`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          Evaluate
        </IconButton>
      </Link>
    </div>
  );
};
