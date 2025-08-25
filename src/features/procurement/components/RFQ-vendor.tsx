"use client";

import { Checkbox } from "components/ui/checkbox";
import Card from "components/Card";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { useForm } from "react-hook-form";
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
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  ref: string;
  requisition: string;
  vendor_responses: string;
  amount: number;
  evaluation_status: string;
  isSelected: boolean;
};

const RFQVendor = () => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">RFQ Vendor Submissions</h4>
        <h6>
          Procurement -{" "}
          <span className="font-medium text-black dark:text-grey-dark">
            RFQ Vendor Submissions
          </span>
        </h6>
      </div>

      <Card className="space-y-10">
        <h4 className="text-base font-bold">Vendor Submissions</h4>

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default RFQVendor;
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
              ? "bg-green-50 text-green-500"
              : "bg-red-50 text-red-500"
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
  const formHook = useForm({
    defaultValues: {
      description: "",
      vendor_category: [],
      tender_type: "",
      document: "",
      vendor: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger>
          <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary">
            <Icon icon="solar:pen-bold-duotone" fontSize={15} />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[650px]">
          <div className="pb-5 space-y-5">
            <DialogTitle className="py-5 ">Submission Detail</DialogTitle>

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
                        <FormLabel>Ref no</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            // placeholder="Type your description here."
                            {...field}
                          />
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
                        <FormLabel>Opening Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Requisition Name</FormLabel>
                        <FormControl>
                          <Input type="text" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formHook.control}
                    name="tender_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tender Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Single Source">
                                Single Source
                              </SelectItem>
                              <SelectItem value="Open Tender">
                                Open Tender
                              </SelectItem>
                              <SelectItem value="National Open Tender">
                                National Open Tender
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={formHook.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            // placeholder="Type your description here."
                            {...field}
                          />
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
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

const data: Data[] = [
  {
    ref: "REF001",
    requisition: "Office Supplies",
    vendor_responses: "ABC Supplies Ltd",
    amount: 9000,
    evaluation_status: "Rejected",
    isSelected: false,
  },
  {
    ref: "REF002",
    requisition: "IT Equipment",
    vendor_responses: "XYZ Tech Solutions",
    amount: 9000,
    evaluation_status: "Approved",
    isSelected: false,
  },
  {
    ref: "REF003",
    requisition: "Furniture",
    vendor_responses: "Furniture World",
    amount: 9000,
    evaluation_status: "Rejected",
    isSelected: false,
  },
  {
    ref: "REF004",
    requisition: "Office Renovation",
    vendor_responses: "Constructo Builders",
    amount: 9000,
    evaluation_status: "Approved",
    isSelected: false,
  },
];
