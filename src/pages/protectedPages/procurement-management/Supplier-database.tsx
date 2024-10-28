/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import VendorsAPI from "services/procurementApi/vendors";
import { VendorsResultsData } from "definations/procurement-types/vendors";

const SupplierDatabase = () => {
  const { data, isLoading } = VendorsAPI.useGetVendorsQuery({
    // params: { status: "APPROVED" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Supplier Database</h4>
        <h6>
          Procurement -{" "}
          <span className="text-black font-medium dark:text-grey-dark">
            Supplier Database
          </span>
        </h6>
      </div>

      <Card className="space-y-10">
        <h4 className="text-lg font-bold">Supplier Database</h4>

        <DataTable
          data={data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default SupplierDatabase;

const columns: ColumnDef<VendorsResultsData>[] = [
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
    header: "Vendor",
    accessorKey: "vendor",
    size: 350,
    cell: ({ row }) => <VendorAction data={row.original} />,
  },
  {
    header: "Phone Number",
    size: 200,
    accessorKey: "phone_number",
  },
  {
    header: "Email",
    size: 200,
    accessorKey: "email",
  },
  {
    header: "RC Number",
    size: 200,
    accessorKey: "rc_number",
  },
  {
    header: "Tax ID",
    size: 200,
    accessorKey: "tax_id",
  },
  {
    header: "Products/Services",
    accessorKey: "nature_of_business",
    size: 300,
  },
  {
    header: "Evaluation Status",
    size: 200,
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-200 text-green-500",
            getValue() === "Inactive" && "bg-red-200 text-red-500",
            getValue() === "Pending" && "bg-yellow-200 text-yellow-500"
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
    cell: () => <ActionListAction />,
  },
];

const ActionListAction = () => {
  return (
    <div className="flex gap-1">
      {/* <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton> */}
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ph:eye-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

const VendorAction = ({ data }: any) => {
  return (
    <div className="flex items-center gap-3">
      <div>
        <Avatar>
          <AvatarImage src={data?.vendor?.png} />
          <AvatarFallback>{data?.company_name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className="font-bold">{data?.company_name}</h4>
        {/* <h6>{data?.company_address}</h6> */}
      </div>
    </div>
  );
};
