import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
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
import { MultiSelect } from "components/ui/multiselect";
import { Input } from "components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Textarea } from "components/ui/textarea";
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
import { EOIFormSchema } from "utils/Validator";

const EOI = () => {
  const [selected, setSelected] = useState([]);

  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });

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

  const tender_type_value = formHook.watch("tender_type");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">EOI</h4>
        <h6>
          Procurement -{" "}
          <span className="text-black font-medium dark:text-grey-dark">
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
                <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
                  <span>
                    <Plus size={20} />
                  </span>
                  New Expression of Interest
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    Initiate New Expression of Interest
                  </DialogTitle>

                  <hr />
                  <Form {...formHook}>
                    <form
                      onSubmit={formHook.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={formHook.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Type your description here."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4>Vendor Category (Select multiple categories)</h4>
                          <MultiSelect
                            options={[
                              {
                                value: "Medical Laboratory Consumables",
                                label: "Medical Laboratory Consumables",
                              },

                              {
                                value: "Medical Laboratory Equipment",
                                label: "Medical Laboratory Equipment",
                              },
                              {
                                value: "Design and Printing",
                                label: "Design and Printing",
                              },
                              {
                                value: "Office Furniture",
                                label: "Office Furniture",
                              },
                              {
                                value: "IT Equipment and Consumables",
                                label: "IT Equipment and Consumables",
                              },
                              {
                                value: "IT Systems and Solutions",
                                label: "IT Systems and Solutions",
                              },
                              {
                                value: "IT Service Provider and Networking",
                                label: "IT Service Provider and Networking",
                              },
                            ]}
                            selected={selected}
                            onChange={setSelected}
                            className="w-[560px]"
                          />
                        </div>

                        <FormField
                          control={formHook.control}
                          name="tender_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Where are you submitting from?
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Location" />
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

                        <FormField
                          control={formHook.control}
                          name="document"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Upload Complete EOI Document
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  className="w-full"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {tender_type_value === "Single Source" && (
                        <div>
                          <h4>Select Vendor(s)</h4>
                          <MultiSelect
                            options={[
                              {
                                value: "Single Source",
                                label: "Single Source",
                              },

                              {
                                value: "Open Tender",
                                label: "Open Tender",
                              },
                              {
                                value: "National Open Tender",
                                label: "National Open Tender",
                              },
                            ]}
                            selected={selected}
                            onChange={setSelected}
                            className="w-[560px]"
                          />
                        </div>
                      )}

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

export default EOI;
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
            getValue() === "No Action Required" &&
              "bg-green-light text-green-dark",
            getValue() === "Approve/Reject" && "bg-red-light text-red-dark",
            getValue() === "Review Pending" &&
              "bg-yellow-light text-yellow-dark"
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
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = () => {
  return (
    <div className="flex gap-2">
      <div>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="bi:toggles" fontSize={15} />
        </IconButton>
      </div>
      <div className="flex gap-2 flex-col">
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="solar:pen-bold-duotone" fontSize={15} />
        </IconButton>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ant-design:delete-twotone" fontSize={15} />
        </IconButton>
      </div>
    </div>
  );
};

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
