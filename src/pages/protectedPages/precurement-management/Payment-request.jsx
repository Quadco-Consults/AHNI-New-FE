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

const PaymentRequest = () => {
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
        <h4 className="text-lg font-bold">Payment Request</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">Payment Request</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold">Payment Request</h4>

          <div>
            <Dialog>
              <DialogTrigger>
                <Button>
                  <span>
                    <Plus size={20} />
                  </span>
                  New Payment Request
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

export default PaymentRequest;
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
    header: "Pay To",
    accessorKey: "pay_to",
  },
  {
    header: "Amount in Figure (NGN)",
    accessorKey: "amount",
  },
  {
    header: "Amount in Words",
    accessorKey: "amount_words",
  },
  {
    header: "Reason for Payment",
    accessorKey: "reason",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Status",
    accessorKey: "status",
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
    pay_to: "Chukwuma Adebiyi",
    amount: 10000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "pending",
  },
  {
    pay_to: "Eze Health Supplies",
    amount: 25000,
    amount_words: "Two Hundred Fifty Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "Approved",
  },
  {
    pay_to: "Chukwuma Adebiyi",
    amount: 1000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "On Hold",
  },
  {
    pay_to: "Chukwuma Adebiyi",
    amount: 1000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "pending",
  },
  {
    pay_to: "Chukwuma Adebiyi",
    amount: 1000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "pending",
  },
];

const CheckboxAction = () => {
  return <Checkbox className="" />;
};
