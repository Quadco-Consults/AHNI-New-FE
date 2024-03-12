import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Plus } from "lucide-react";
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
import { EOIFormSchema, RFQFormSchema } from "utils/Validator";
import { Input } from "components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const PurchaseRequest = () => {
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
        <h4 className="text-lg font-bold">Purchase Request</h4>
        <h6>
          procurement -{" "}
          <span className="text-black font-medium">Purchase Request</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold">Purchase Request</h4>

          <div>
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:bg-primary/90">
                  <span>
                    <Plus size={20} />
                  </span>
                  New RFQ
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="pb-5 space-y-5">
                  <DialogTitle className="py-5 ">
                    New Purchase Requests
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
                              <FormLabel>Requisition Name</FormLabel>
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
                              <FormLabel>Total</FormLabel>
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
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested Project</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Project" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Single Source">
                                      Project A
                                    </SelectItem>
                                    <SelectItem value="Open Tender">
                                      Project B
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      Project C
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Single Source">
                                      Approved
                                    </SelectItem>
                                    <SelectItem value="Open Tender">
                                      Rejected
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      On Hold
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
                          name="reference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Single Source">
                                      Sales
                                    </SelectItem>
                                    <SelectItem value="Open Tender">
                                      IT
                                    </SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Finance">
                                      Finance
                                    </SelectItem>
                                    <SelectItem value="National Open Tender">
                                      Operations
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specifications</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={formHook.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Specification</FormLabel>
                            <FormControl>
                              <Input {...field} type="file" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

export default PurchaseRequest;
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
    header: "Requisition Name",
    accessorKey: "requisition",
    size: 300,
  },
  {
    header: "Requested Project",
    accessorKey: "requested_project",
    size: 300,
  },
  {
    header: "Unit",
    accessorKey: "unit",
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

const data = [
  {
    requisition: "HIV/AIDS Testing Kit Order",
    requested_project: "Project LifeGuard: Comprehensive HIV/AIDS Intervention",
    status: "Pending",
    unit: "HR Department",
  },
  {
    requisition: "Reproductive Health Survey Equipment",
    requested_project: "VitalVision: A Study on Child Nutrition and Health",
    status: "Approved",
    unit: "Finance Department",
  },
  {
    requisition: "Mobile Health Unit Vehicle Purchase",
    requested_project: "BeatTheBite: Malaria Eradication Initiative",
    status: "Rejected",
    unit: "IT Department",
  },
  {
    requisition: "HIV/AIDS Awareness Campaign Materials",
    requested_project: "HarvestHope: Sustainable Agriculture and Food Security",
    status: "Pending",
    unit: "Sales Department",
  },
  {
    requisition: "Women's Shelter Establishment Fund ",
    requested_project: "ShieldShe: Women's Safety and Empowerment Drive",
    status: "Approved",
    unit: "Marketing Department",
  },
  {
    requisition: "Health Awareness Poster Design",
    requested_project: "UnitedForHealth: AHNi-UNICEF Joint Initiative",
    status: "On Hold",
    unit: "Operations Department",
  },
];

const ActionListAction = () => {
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
          <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary hover:bg-red-light">
            <Icon icon="solar:pen-bold-duotone" fontSize={15} />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[650px]">
          <div className="pb-5 space-y-5">
            <DialogTitle className="py-5 ">New Purchase Requests</DialogTitle>

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
                        <FormLabel>Requisition Name</FormLabel>
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
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel>Requested Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Single Source">
                                Project A
                              </SelectItem>
                              <SelectItem value="Open Tender">
                                Project B
                              </SelectItem>
                              <SelectItem value="National Open Tender">
                                Project C
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formHook.control}
                    name="tender_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
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
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Single Source">
                                Project A
                              </SelectItem>
                              <SelectItem value="Open Tender">
                                Project B
                              </SelectItem>
                              <SelectItem value="National Open Tender">
                                Project C
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formHook.control}
                    name="ref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications</FormLabel>
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

                <FormField
                  control={formHook.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Specification</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          // placeholder="Type your description here."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
