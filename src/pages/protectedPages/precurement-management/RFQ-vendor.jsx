import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import React from "react";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";

const RFQVendor = () => {
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
        <h4 className="text-lg font-bold">RFQ Vendor Submissions</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">RFQ Vendor Submissions</span>
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

export default RFQVendor;
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
    header: "Ref No",
    accessorKey: "ref",
  },
  {
    header: "Requisition Name",
    accessorKey: "requisition",
    size: 200,
  },
  {
    header: "Vendor",
    accessorKey: "vendor_responses",
    size: 200,
  },
  {
    header: "Total Sum",
    accessorKey: "amount",
  },
  {
    header: "CBA Status",
    accessorKey: "evaluation_status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved"
              ? "bg-green-light text-green-dark"
              : "bg-red-light text-red-dark"
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

const data = [
  {
    ref: "REF001",
    requisition: "Office Supplies",
    vendor_responses: "ABC Supplies Ltd",
    amount: 9000,
    evaluation_status: "Rejected",
  },
  {
    ref: "REF002",
    requisition: "IT Equipment",
    vendor_responses: "XYZ Tech Solutions",
    amount: 9000,
    evaluation_status: "Approved",
  },
  {
    ref: "REF003",
    requisition: "Furniture",
    vendor_responses: "Furniture World",
    amount: 9000,
    evaluation_status: "Rejected",
  },
  {
    ref: "REF004",
    requisition: "Office Renovation",
    vendor_responses: "Constructo Builders",
    amount: 9000,
    evaluation_status: "Approved",
  },
];
