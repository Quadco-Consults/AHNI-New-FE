import { ColumnDef } from "@tanstack/react-table";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Badge } from "components/ui/badge";
import Link from "next/link";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { useGetVendorFuelStatistics } from "@/features/admin/controllers/fuelConsumptionController";

export const fuelRequestVendorColumns: ColumnDef<VendorsResultsData>[] = [
  {
    header: "Company Name",
    id: "company_name",
    accessorKey: "company_name",
  },

  {
    header: "Type of Business",
    id: "type_of_business",
    accessorKey: "type_of_business",
    size: 150,
  },

  {
    header: "Email",
    id: "email",
    accessorKey: "email",
  },

  {
    header: "Total Fuel Supplied",
    id: "total_fuel",
    cell: ({ row }) => {
      return <VendorFuelSummary vendorId={row.original.id} type='fuel' />;
    },
    size: 150,
  },

  {
    header: "Total Value",
    id: "total_value",
    cell: ({ row }) => (
      <VendorFuelSummary vendorId={row.original.id} type='value' />
    ),
    size: 120,
  },

  {
    header: "Transactions",
    id: "transactions",
    cell: ({ row }) => (
      <VendorFuelSummary vendorId={row.original.id} type='status' />
    ),
    size: 100,
  },

  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => {
      return <TableMenu {...row.original} />;
    },
  },
];

// Simplified component using backend statistics API
const VendorFuelSummary = ({
  vendorId,
  type,
}: {
  vendorId: string;
  type: "fuel" | "value" | "status";
}) => {
  const { data: stats, isLoading } = useGetVendorFuelStatistics(vendorId);

  if (isLoading) {
    return <span className='text-gray-400 text-sm'>Loading...</span>;
  }

  if (!stats?.data?.statistics) {
    return <span className='text-gray-400 text-sm'>No data</span>;
  }

  const { statistics, status_breakdown } = stats?.data;

  if (type === "fuel") {
    return (
      <span className='font-medium'>
        {statistics.total_liters?.toLocaleString() || 0} L
      </span>
    );
  }

  if (type === "value") {
    return (
      <span className='font-medium text-green-600'>
        ₦{statistics.total_amount?.toLocaleString() || 0}
      </span>
    );
  }

  if (type === "status") {
    const approved = status_breakdown?.APPROVED || 0;
    const pending = status_breakdown?.PENDING || 0;
    const rejected = status_breakdown?.REJECTED || 0;

    return (
      <div className='flex gap-1'>
        {approved > 0 && (
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-800 text-xs px-1'
          >
            {approved}
          </Badge>
        )}
        {pending > 0 && (
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 text-xs px-1'
          >
            {pending}
          </Badge>
        )}
        {rejected > 0 && (
          <Badge
            variant='secondary'
            className='bg-red-100 text-red-800 text-xs px-1'
          >
            {rejected}
          </Badge>
        )}
      </div>
    );
  }

  return null;
};

const TableMenu = ({ request_id }: VendorsResultsData) => {
  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=' w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={`/dashboard/admin/fleet-management/fuel-request/${request_id}/vendor`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Fuel Details
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
