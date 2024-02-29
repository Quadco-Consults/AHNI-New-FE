import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import React from "react";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";

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
            getValue() === "Completed"
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
    ref: "001",
    requisition: "Office Supplies",
    vendor_responses: "ABC Supplies Ltd",
    date: "10/10/2023",
    evaluation_status: "pending",
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

const CheckboxAction = () => {
  return <Checkbox className="" />;
};
