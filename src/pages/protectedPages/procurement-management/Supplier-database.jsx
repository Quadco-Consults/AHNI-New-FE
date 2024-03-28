/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { cn } from "lib/utils";
import avatarPng from "assets/imgs/avartar.png";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";

const SupplierDatabase = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
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

        <Table
          instance={tableInstance}
          // loading={customersQueryResult.isFetching}
          // error={customersQueryResult.isError}
          // onReload={customersQueryResult.refetch}
        />
      </Card>
    </div>
  );
};

export default SupplierDatabase;

const columns = [
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
    size: 250,
    cell: ({ row }) => <VendorAction data={row.original} />,
  },
  {
    header: "Phone Number",
    accessorKey: "number",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Products/Services",
    accessorKey: "products",
    size: 250,
  },
  {
    header: "Evaluation Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Active" && "bg-green-light text-green-dark",
            getValue() === "Inactive" && "bg-red-light text-red-dark",
            getValue() === "Under Review" && "bg-yellow-light text-yellow-dark"
          )}
        >
          {getValue()}
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

const ActionListAction = () => {
  return (
    <div className="flex gap-1">
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

const VendorAction = ({ data }) => {
  return (
    <div className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage src={data.vendor.png} />
          <AvatarFallback>{data.vendor.name}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className="font-bold">{data.vendor.name}</h4>
        <h6>{data.vendor.desc}</h6>
      </div>
    </div>
  );
};

const data = [
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
  },
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
  },
];
