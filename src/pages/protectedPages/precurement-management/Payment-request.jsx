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
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RFQFormSchema } from "utils/Validator";
import { Textarea } from "components/ui/textarea";
import { Input } from "components/ui/input";

const PaymentRequest = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });

  const formHook = useForm({
    resolver: zodResolver(RFQFormSchema),
    defaultValues: {
      background: "",
      reference: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    New Payment Request
                  </DialogTitle>

                  <hr />
                  <Form {...formHook}>
                    <form
                      onSubmit={formHook.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pay To</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested by</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount in Figure (NGN)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reviewed by</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount in Words</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Authorized by</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason for Payment</FormLabel>
                              <FormControl>
                                <Textarea
                                  // placeholder="Type your description here."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2">
                          <FormField
                            control={formHook.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Details</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Bank Name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formHook.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="Account No" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>FCO</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TIN NO</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget Line</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-5">
                        <DialogClose asChild>
                          <Button variant="ghost">Close</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                </div>
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
    header: "Pay To",
    accessorKey: "pay_to",
    size: 200,
  },
  {
    header: "Amount in Figure (NGN)",
    accessorKey: "amount",
  },
  {
    header: "Amount in Words",
    accessorKey: "amount_words",
    size: 250,
  },
  {
    header: "Reason for Payment",
    accessorKey: "reason",
    size: 250,
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
            getValue() === "Approved" && "bg-green-light text-green-dark",
            getValue() === "Reject" && "bg-red-light text-red-dark",
            getValue() === "Pending" && "bg-yellow-light text-yellow-dark",
            getValue() === "On Hold" && "text-grey-light bg-grey-dark"
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
    pay_to: "Chukwuma Adebiyi",
    amount: 10000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "Pending",
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
    status: "Pending",
  },
  {
    pay_to: "Chukwuma Adebiyi",
    amount: 1000,
    amount_words: "One Hundred Thousand Naira",
    reason: "Healthcare workshop facilitation fee",
    date: "2023-09-01",
    status: "Rejected",
  },
];
