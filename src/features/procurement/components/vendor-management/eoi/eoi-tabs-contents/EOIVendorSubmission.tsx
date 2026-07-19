/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "@/components/Card";
import IconButton from "@/components/IconButton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";

// Helper function to generate path with parameters
const generatePath = (route: string, params?: Record<string, any>): string => {
  if (!params) return route;
  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(`:${key}`, value);
  }, route);
};
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import { Plus, Trash2, Search } from 'lucide-react';
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

type Data = {
  id: string;
  company_name: string;
  type_of_business: string;
  company_registration_number: string;
  tin: string;
  status: string;
  evaluation_status: string | null;
  isSelected: boolean;
};

const EOIVendorSubmission = ({ status, eoiData }: { status?: string; eoiData?: any }) => {
  const params = useParams();
  const eoiId = params.id as string;
  const [isCreatingCBA, setIsCreatingCBA] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if this is an OPEN_TENDER type EOI
  const isOpenTender = eoiData?.type === "OPEN_TENDER";
  const linkedRfqId = (eoiData as any)?.linked_rfq?.id;

  // Fetch vendors registered for this specific EOI (only for NEW_VENDOR type)
  // The backend should support filtering by eoi parameter
  const { data: vendorsData, isLoading: isLoadingVendors, error: vendorsError } = VendorsAPI.useGetVendors({
    page: 1,
    size: 100,
    search: searchTerm,
    enabled: !isOpenTender, // Only fetch for NEW_VENDOR type
  });

  // Filter vendors by EOI ID
  const vendorSubmissions = useMemo(() => {
    // If there's an error, return empty array
    if (vendorsError) {
      return [];
    }

    if (!vendorsData?.data?.results) {
      return [];
    }

    // Filter to only show vendors registered for this EOI
    const eoiVendors = vendorsData.data.results.filter((vendor: any) => {
      return vendor.eoi === eoiId;
    });

    return eoiVendors.map((vendor: any) => ({
      id: vendor.id,
      company_name: vendor.company_name || "-",
      type_of_business: vendor.type_of_business || "-",
      company_registration_number: vendor.company_registration_number || "-",
      tin: vendor.tin || "-",
      status: vendor.status || "Pending",
      evaluation_status: vendor.evaluation_status || null,
    }));
  }, [vendorsData, eoiId, vendorsError]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = vendorSubmissions.length;
    const approved = vendorSubmissions.filter(v => v.status === "Approved").length;
    const pending = vendorSubmissions.filter(v => v.status === "Pending").length;
    const rejected = vendorSubmissions.filter(v => v.status === "Rejected" || v.status === "Fail").length;

    return { total, approved, pending, rejected };
  }, [vendorSubmissions]);

  const handleCreateCBA = () => {
    // For EOI flow, we redirect to CBA creation and let it handle finding the solicitation
    // The CBA creation component will need to be enhanced to work with EOI ID
    window.location.href = `/dashboard/procurement/solicitation-management/rfq/create/create-cba?eoi_id=${eoiId}`;
  };

  // If this is an OPEN_TENDER type, show different UI
  if (isOpenTender) {
    return (
      <div className='space-y-6'>
        <Card className='p-8'>
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Icon icon="ph:file-text-duotone" fontSize={48} className="text-indigo-600" />
            </div>

            <div className="space-y-2 max-w-2xl">
              <h3 className="text-xl font-semibold text-gray-900">National Open Tender - RFQ Submissions</h3>
              <p className="text-sm text-gray-600">
                This is a National Open Tender with a linked Request for Quotation (RFQ).
                Vendor bid submissions are managed through the RFQ system, not vendor registrations.
              </p>
            </div>

            {linkedRfqId ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon icon="mdi:link-variant" fontSize={20} />
                  <span>Linked RFQ: <strong>{(eoiData as any)?.linked_rfq?.rfq_id}</strong></span>
                </div>

                <div className="flex gap-3">
                  <Link href={`/dashboard/procurement/solicitation-management/rfq/${linkedRfqId}`}>
                    <Button variant="default">
                      <Icon icon="ph:eye-duotone" className="mr-2" fontSize={18} />
                      View RFQ Details
                    </Button>
                  </Link>

                  <Link href={`/dashboard/procurement/solicitation-management/rfq/${linkedRfqId}/submissions`}>
                    <Button variant="outline">
                      <Icon icon="ph:list-duotone" className="mr-2" fontSize={18} />
                      View Bid Submissions
                    </Button>
                  </Link>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCreateCBA}
                  disabled={isCreatingCBA}
                >
                  {isCreatingCBA ? "Creating CBA..." : "Create Comparative Bid Analysis (CBA)"}
                </Button>
              </div>
            ) : (
              <div className="text-sm text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                <Icon icon="ph:warning-duotone" className="inline mr-2" fontSize={18} />
                No linked RFQ found for this tender. Please create an RFQ first.
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // For NEW_VENDOR type, show vendor registrations
  return (
    <div className='space-y-6'>
      {/* Stats Dashboard */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Total Submissions</p>
            <p className='text-2xl font-bold'>{stats.total}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Approved</p>
            <p className='text-2xl font-bold text-green-600'>{stats.approved}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Pending Review</p>
            <p className='text-2xl font-bold text-yellow-600'>{stats.pending}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Rejected</p>
            <p className='text-2xl font-bold text-red-600'>{stats.rejected}</p>
          </div>
        </Card>
      </div>

      {/* Table Card */}
      <Card className='space-y-10'>
        <div className='flex mt-1 justify-between items-center'>
          <div className='border w-1/3 py-2 px-2 flex items-center rounded-lg'>
            <Icon icon='iconamoon:search-light' fontSize={25} />
            <Input
              placeholder='Search Vendor Submissions'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-6 border-none bg-none'
            />
          </div>

          <div className="flex gap-3">
            <Link href={`${generatePath(RouteEnum.VENDOR_REGISTRATION)}?eoi_id=${eoiId}`}>
              <Button>
                <span>
                  <Plus size={20} />
                </span>
                Add Vendor
              </Button>
            </Link>
          </div>
        </div>

        {vendorSubmissions.length === 0 && !isLoadingVendors ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon icon="ph:users-three-duotone" fontSize={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Vendor Submissions Yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Vendors will appear here once they register for this EOI. You can also manually add vendors using the button above.
            </p>
            <Link href={`${generatePath(RouteEnum.VENDOR_REGISTRATION)}?eoi_id=${eoiId}`}>
              <Button variant="outline">
                <Plus size={16} className="mr-2" />
                Add First Vendor
              </Button>
            </Link>
          </div>
        ) : (
          <DataTable
            // @ts-ignore
            columns={columns}
            data={vendorSubmissions}
            isLoading={isLoadingVendors}
          />
        )}
      </Card>
    </div>
  );
};

export default EOIVendorSubmission;

const columns: ColumnDef<Data>[] = [
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
    accessorKey: "company_name",
    size: 250,
  },
  {
    header: "Type of Business",
    accessorKey: "type_of_business",
    size: 200,
  },
  {
    header: "Company Reg No",
    accessorKey: "company_registration_number",
    size: 180,
  },
  {
    header: "TIN",
    accessorKey: "tin",
    size: 150,
    cell: ({ getValue }) => {
      const tin = getValue() as string;
      return <span className="font-mono text-sm">{tin || "-"}</span>;
    },
  },
  {
    header: "Prequalification",
    accessorKey: "status",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Approved" && "bg-green-50 text-green-500",
            getValue() === "Fail" && "bg-red-50 text-red-500",
            getValue() === "Pending" && "bg-yellow-50 text-yellow-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Evaluation",
    accessorKey: "evaluation_status",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Pass" && "bg-green-50 text-green-500",
            getValue() === "Fail" && "bg-red-50 text-red-500",
            getValue() === "Unreviewed" && "bg-yellow-50 text-yellow-500",
            getValue() === null && "bg-yellow-50 text-yellow-500"
          )}
        >
          {getValue() as string}
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
  return (
    <div className='flex gap-2'>
      <Link
        href={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: data?.id })}
      >
        <IconButton className='bg-alternate-light hover:text-primary'>
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </Link>
      <IconButton className='bg-alternate-light hover:text-primary'>
        <Icon icon='ant-design:delete-twotone' fontSize={15} />
      </IconButton>
    </div>
  );
};

// const VendorAction = ({ data }) => {
//   return (
//     <div className="flex gap-3">
//       <div>
//         <Avatar>
//           <AvatarImage src={data.vendor.png} />
//           <AvatarFallback>{data.vendor.name}</AvatarFallback>
//         </Avatar>
//       </div>
//       <div>
//         <h4 className="font-bold">{data.vendor.name}</h4>
//         <h6>{data.vendor.desc}</h6>
//       </div>
//     </div>
//   );
// };
