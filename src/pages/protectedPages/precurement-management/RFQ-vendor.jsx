import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import React from "react";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";

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
  // {
  //   header: "Merchant Name",
  //   accessorFn: (data) => `${data?.first_name} ${data?.last_name}`,
  // },
  {
    header: "Select",
    cell: ({ row }) => <CheckboxAction data={row.original} />,
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
    // cell: ({ row }) => <CustomerListAction data={row.original} />,
  },
];

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

const CheckboxAction = () => {
  return <Checkbox className="" />;
};
