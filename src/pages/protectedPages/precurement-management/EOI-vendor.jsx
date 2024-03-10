import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import React from "react";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EOIFormSchema } from "utils/Validator";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

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

export default EOIVendor;
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
  const formHook = useForm({
    resolver: zodResolver(EOIFormSchema),
    defaultValues: {
      description: "",
      vendor_category: [],
      tender_type: "",
      document: "",
      vendor: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger>
          <IconButton className="bg-[#F9F9F9] hover:text-primary">
            <Icon icon="solar:pen-bold-duotone" fontSize={15} />
          </IconButton>
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
                    name="ref"
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
                    name="date"
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
                    name="aquisition"
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
