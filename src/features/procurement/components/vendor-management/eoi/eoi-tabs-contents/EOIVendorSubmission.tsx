/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/Card";
import IconButton from "components/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";

// Helper function to generate path with parameters
const generatePath = (route: string, params?: Record<string, any>): string => {
  if (!params) return route;
  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(`:${key}`, value);
  }, route);
};
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { Plus } from "lucide-react";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Data = {
  name: string;
  number: number;
  email: string;
  products: string;
  status: string;
  prequalification: string;
  isSelected: boolean;
};

const EOIVendorSubmission = ({ status, eoiData }: { status?: string; eoiData?: any }) => {
  const params = useParams();
  const eoiId = params.id as string;
  const [isCreatingCBA, setIsCreatingCBA] = useState(false);
  
  const { data: vendorData } = VendorsAPI.useGetVendors({
    page: 1,
    size: 20,
    search: "",
  });

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
              placeholder='Search Category'
              type='search'
              className='h-6 border-none bg-none'
            />
          </div>

          <div className="flex gap-3">
            {/* Show Create CBA button for OPEN_TENDER EOIs that have vendor submissions */}
            {eoiData?.type === "OPEN_TENDER" && vendorData?.data?.results && vendorData.data.results.length > 0 && (
              <Button onClick={handleCreateCBA} disabled={isCreatingCBA} variant="outline">
                {isCreatingCBA ? "Creating..." : "Create CBA"}
              </Button>
            )}
            <Link href={generatePath(RouteEnum.VENDOR_REGISTRATION)}>
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
          data={vendorData?.data?.results || []}
          isLoading={false}
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
