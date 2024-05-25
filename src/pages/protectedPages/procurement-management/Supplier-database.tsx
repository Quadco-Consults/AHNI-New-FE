/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import avatarPng from "assets/imgs/avartar.png";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  vendor: { png: string; name: string; desc: string };
  number: number;
  email: string;
  products: string;
  status: string;
  isSelected: boolean;
};

const SupplierDatabase = () => {
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

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default SupplierDatabase;

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
            getValue() === "Active" && "bg-green-50 text-green-500",
            getValue() === "Inactive" && "bg-red-50 text-red-500",
            getValue() === "Under Review" && "bg-yellow-50 text-yellow-500"
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
  console.log(data);
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

const VendorAction = ({ data }: any) => {
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

const data: Data[] = [
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
    isSelected: false,
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
    isSelected: false,
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
    isSelected: false,
  },
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
    isSelected: false,
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
    isSelected: false,
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
    isSelected: false,
  },
];
