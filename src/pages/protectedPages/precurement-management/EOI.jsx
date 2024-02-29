import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Plus } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";

const EOI = () => {
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
        <h4 className="text-lg font-bold">EOI</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">
            Expression of Interests
          </span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-base font-bold">EOI</h4>
            <h6>Over 500 orders</h6>
          </div>
          <div>
            <Dialog>
              <DialogTrigger>
                <Button>
                  <span>
                    <Plus size={20} />
                  </span>
                  New Expression of Interest
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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

export default EOI;
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
    header: "Requested Project",
    accessorKey: "requested_project",
  },
  {
    header: "Submission Deadline",
    accessorKey: "submission_deadline",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Under Review"
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
    header: "Vendor Responses",
    accessorKey: "vendor_responses",
    cell: ({ getValue }) => <p className=" text-red-dark">{getValue()}</p>,
  },
  {
    header: "Action Required",
    accessorKey: "action_required",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "No Action Required"
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
              : "bg-purple-light text-purple-dark"
          )}
        >
          {getValue()}
        </Badge>
      );
    },
  },
  {
    header: "Award Decision",
    accessorKey: "award_decision",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Awarded to Infosoft"
              ? "bg-green-light text-green-dark"
              : "bg-[#F9F9F9] text-grey-light"
          )}
        >
          {getValue()}
        </Badge>
      );
    },
  },
  {
    header: "Contract Amount (₦)",
    accessorKey: "amount",
    cell: ({ getValue }) => {
      return getValue() ? (
        <p>{getValue()}</p>
      ) : (
        <p className="text-center">---</p>
      );
    },
  },
  {
    header: "Vendor Awarded",
    accessorKey: "vendor_awarded",
  },

  {
    header: "Actions",
    id: "actions",
    // cell: ({ row }) => <CustomerListAction data={row.original} />,
  },
];

const data = [
  {
    ref: "AHNI-T-001",
    requisition: "Office Refurbishing",
    requested_project: "Infrastructure Improvement",
    submission_deadline: "12/12/2023",
    status: "open",
    vendor_responses: 3,
    action_required: "Review Pending",
    date: "	10/10/2023",
    evaluation_status: "Not Started",
    award_decision: "Not Yet Awarded",
    amount: 1200000,
    vendor_awarded: "Infosoft Ltd",
  },
  {
    ref: "AHNI-T-002",
    requisition: "Mobile Clinic Units",
    requested_project: "Outreach Expansion",
    submission_deadline: "04/11/2023",
    status: "Under Review",
    vendor_responses: 5,
    action_required: "Approve/Reject",
    date: "	09/01/2023",
    evaluation_status: "Technical Evaluation",
    award_decision: "Not Yet Awarded",
    amount: null,
    vendor_awarded: "",
  },
  {
    ref: "AHNI-T-003",
    requisition: "Data Management Systems",
    requested_project: "IT Systems Upgrade",
    submission_deadline: "12/12/2023",
    status: "Closed",
    vendor_responses: 10,
    action_required: "No Action Required",
    date: "10/10/2023",
    evaluation_status: "Completed",
    award_decision: "Awarded to Infosoft",
    amount: 1800000,
    vendor_awarded: "Infosoft Ltd",
  },
];

const CheckboxAction = () => {
  return <Checkbox className="" />;
};
