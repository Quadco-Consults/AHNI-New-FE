import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import React from "react";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import { Home } from "lucide-react";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";

const EOIVendor = () => {
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
        <h4 className="text-lg font-bold">EOI Vendor Submissions</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">EOI Vendor Submissions</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <h4 className="text-base font-bold">Vendor Submissions</h4>

        <div className=" overflow-auto">
          <Table
            instance={tableInstance}
            // loading={customersQueryResult.isFetching}
            // error={customersQueryResult.isError}
            // onReload={customersQueryResult.refetch}
          />
        </div>
      </Card>
    </div>
  );
};

export default EOIVendor;
const columns = [
  {
    id: "select",
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
    header: "Ref No",
    accessorKey: "ref",
  },
  {
    header: "Requisition Name",
    accessorKey: "requisition",
  },
  {
    header: "Vendor",
    accessorKey: "vendor_responses",
  },
  {
    header: "Opening Date",
    accessorKey: "date",
  },
  {
    header: "Evaluation Status",
    accessorKey: "evaluation_status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-light text-green-dark",
            getValue() === "Reject" && "bg-red-light text-red-dark",
            getValue() === "Pending" && "bg-yellow-light text-yellow-dark",
            getValue() === "In Progress" && "bg-purple-light text-purple-dark"
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

const data = [
  {
    ref: "001",
    requisition: "Office Supplies",
    vendor_responses: "ABC Supplies Ltd",
    date: "10/10/2023",
    evaluation_status: "Pending",
  },
  {
    ref: "002",
    requisition: "IT Equipment",
    vendor_responses: "XYZ Tech Solutions",
    date: "10/10/2023",
    evaluation_status: "Approved",
  },
  {
    ref: "003",
    requisition: "Furniture",
    vendor_responses: "Furniture World",
    date: "10/10/2023",
    evaluation_status: "Rejected",
  },
  {
    ref: "004",
    requisition: "Office Renovation",
    vendor_responses: "Constructo Builders",
    date: "10/10/2023",
    evaluation_status: "In Progress",
  },
];

const ActionListAction = ({ data }) => {
  return (
    <div className="flex items-center gap-2">
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};
