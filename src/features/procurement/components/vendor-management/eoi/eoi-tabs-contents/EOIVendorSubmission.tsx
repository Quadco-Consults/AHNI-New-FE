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
import { useState, useMemo, useEffect } from "react";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

type Data = {
  id: string;
  company_name: string;
  type_of_business: string;
  company_registration_number: string;
  status: string;
  evaluation_status: string | null;
  isSelected: boolean;
};

const EOIVendorSubmission = ({ status, eoiData }: { status?: string; eoiData?: any }) => {
  const params = useParams();
  const eoiId = params.id as string;
  const [isCreatingCBA, setIsCreatingCBA] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vendors registered for this specific EOI
  // The backend should support filtering by eoi parameter
  const { data: vendorsData, isLoading: isLoadingVendors, error: vendorsError } = VendorsAPI.useGetVendors({
    page: 1,
    size: 100,
    search: searchTerm,
    enabled: true,
  });

  // Debug: Log when vendors data changes
  useEffect(() => {
    console.log("📦 Vendors API Response Changed:", {
      isLoading: isLoadingVendors,
      hasData: !!vendorsData,
      hasError: !!vendorsError,
      error: vendorsError,
      rawData: vendorsData,
    });

    if (vendorsError) {
      console.error("❌ Vendors API Error:", vendorsError);
    }
  }, [vendorsData, isLoadingVendors, vendorsError]);

  // Check if backend has EOI support (migration applied)
  const backendHasEOISupport = !vendorsError || !vendorsError?.message?.includes("eoi_id does not exist");

  // Filter vendors by EOI ID
  const vendorSubmissions = useMemo(() => {
    console.log("🔄 vendorSubmissions recalculating...");

    // If there's an error (likely backend not ready), return empty array
    if (vendorsError) {
      console.warn("⚠️ Vendors API error (backend migration not applied yet):", vendorsError);
      return [];
    }

    if (!vendorsData?.data?.results) {
      console.log("⚠️ No vendors data yet");
      return [];
    }

    // Log vendor data structure
    console.log("🔍 EOI Vendor Submissions Debug:", {
      eoiId,
      totalVendors: vendorsData.data.results.length,
      firstVendor: vendorsData.data.results[0],
      allVendorEOIs: vendorsData.data.results.map((v: any) => ({ name: v.company_name, eoi: v.eoi })),
    });

    // Filter to only show vendors registered for this EOI
    const eoiVendors = vendorsData.data.results.filter((vendor: any) => {
      const matches = vendor.eoi === eoiId;
      console.log(`Checking vendor "${vendor.company_name}": eoi="${vendor.eoi}", looking for "${eoiId}", matches=${matches}`);
      return matches;
    });

    console.log(`✅ Found ${eoiVendors.length} vendors for EOI ${eoiId}:`, eoiVendors);

    return eoiVendors.map((vendor: any) => ({
      id: vendor.id,
      company_name: vendor.company_name || "-",
      type_of_business: vendor.type_of_business || "-",
      company_registration_number: vendor.company_registration_number || "-",
      status: vendor.status || "Pending",
      evaluation_status: vendor.evaluation_status || null,
    }));
  }, [vendorsData, eoiId]);

  const handleCreateCBA = () => {
    // For EOI flow, we redirect to CBA creation and let it handle finding the solicitation
    // The CBA creation component will need to be enhanced to work with EOI ID
    window.location.href = `/dashboard/procurement/solicitation-management/rfq/create/create-cba?eoi_id=${eoiId}`;
  };

  return (
    <div className='space-y-10'>
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
            {/* Show Create CBA button for OPEN_TENDER EOIs that have vendor submissions */}
            {eoiData?.type === "OPEN_TENDER" && vendorSubmissions.length > 0 && (
              <Button onClick={handleCreateCBA} disabled={isCreatingCBA} variant="outline">
                {isCreatingCBA ? "Creating..." : "Create CBA"}
              </Button>
            )}
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

        <DataTable
          // @ts-ignore
          columns={columns}
          data={vendorSubmissions}
          isLoading={isLoadingVendors}
        />
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
    size: 250,
  },
  {
    header: "Company Reg No",
    accessorKey: "company_registration_number",
    size: 200,
  },
  {
    header: "Prequalification",
    accessorKey: "status",
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
