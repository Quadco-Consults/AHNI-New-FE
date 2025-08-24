"use client";

import { Checkbox } from "components/ui/checkbox";
import Card from "components/Card";
import { Button } from "components/ui/button";
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
import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { Input } from "components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  requisition: string;
  requested_project: string;
  status: string;
  unit: string;
  isSelected: boolean;
};

const PurchaseRequest = () => {
  const formHook = useForm({
    defaultValues: {
      background: "",
      reference: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className='space-y-10'>
      <div>
        {/* <h4 className='text-lg font-bold'>Purchase Request</h4> */}
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Purchase Request
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <div className='flex items-center justify-between'>
          <h4 className='text-base font-bold'>Purchase Request</h4>

          <div>
            <Dialog>
              <DialogTrigger>
                <div className='flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground h-11 hover:bg-primary/90'>
                  <span>
                    <Plus size={20} />
                  </span>
                  New RFQ
                </div>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[650px]'>
                <div className='pb-5 space-y-5'>
                  <DialogTitle className='py-5 '>
                    New Purchase Requests
                  </DialogTitle>

                  <hr />
                  <Form {...formHook}>
                    <form
                      onSubmit={formHook.handleSubmit(onSubmit)}
                      className='space-y-5'
                    >
                      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <FormField
                          control={formHook.control}
                          name='background'
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
                          name='background'
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

                      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <FormField
                          control={formHook.control}
                          name='reference'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested Project</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a Project' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value='Single Source'>
                                      Project A
                                    </SelectItem>
                                    <SelectItem value='Open Tender'>
                                      Project B
                                    </SelectItem>
                                    <SelectItem value='National Open Tender'>
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
                          name='reference'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a Status' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value='Single Source'>
                                      Approved
                                    </SelectItem>
                                    <SelectItem value='Open Tender'>
                                      Rejected
                                    </SelectItem>
                                    <SelectItem value='National Open Tender'>
                                      Pending
                                    </SelectItem>
                                    <SelectItem value='National Open Tender'>
                                      On Hold
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <FormField
                          control={formHook.control}
                          name='reference'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a Department' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value='Single Source'>
                                      Sales
                                    </SelectItem>
                                    <SelectItem value='Open Tender'>
                                      IT
                                    </SelectItem>
                                    <SelectItem value='HR'>HR</SelectItem>
                                    <SelectItem value='Finance'>
                                      Finance
                                    </SelectItem>
                                    <SelectItem value='National Open Tender'>
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
                          name='background'
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
                        name='background'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Specification</FormLabel>
                            <FormControl>
                              <Input {...field} type='file' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='flex justify-end gap-5'>
                        <DialogClose asChild>
                          <Button variant='ghost'>Close</Button>
                        </DialogClose>
                        <Button type='submit'>Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default PurchaseRequest;
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
            getValue() === "Approved" && "bg-green-50 text-green-500",
            getValue() === "Reject" && "bg-red-50 text-red-500",
            getValue() === "Pending" && "bg-yellow-50 text-yellow-500",
            getValue() === "On Hold" && "text-grey-50 bg-grey-500"
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

const data: Data[] = [
  {
    requisition: "HIV/AIDS Testing Kit Order",
    requested_project: "Project LifeGuard: Comprehensive HIV/AIDS Intervention",
    status: "Pending",
    unit: "HR Department",
    isSelected: false,
  },
  {
    requisition: "Reproductive Health Survey Equipment",
    requested_project: "VitalVision: A Study on Child Nutrition and Health",
    status: "Approved",
    unit: "Finance Department",
    isSelected: false,
  },
  {
    requisition: "Mobile Health Unit Vehicle Purchase",
    requested_project: "BeatTheBite: Malaria Eradication Initiative",
    status: "Rejected",
    unit: "IT Department",
    isSelected: false,
  },
  {
    requisition: "HIV/AIDS Awareness Campaign Materials",
    requested_project: "HarvestHope: Sustainable Agriculture and Food Security",
    status: "Pending",
    unit: "Sales Department",
    isSelected: false,
  },
  {
    requisition: "Women's Shelter Establishment Fund ",
    requested_project: "ShieldShe: Women's Safety and Empowerment Drive",
    status: "Approved",
    unit: "Marketing Department",
    isSelected: false,
  },
  {
    requisition: "Health Awareness Poster Design",
    requested_project: "UnitedForHealth: AHNi-UNICEF Joint Initiative",
    status: "On Hold",
    unit: "Operations Department",
    isSelected: false,
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
    <div className='flex items-center gap-2'>
      <Dialog>
        <DialogTrigger>
          <div className='rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary'>
            <Icon icon='solar:pen-bold-duotone' fontSize={15} />
          </div>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[650px]'>
          <div className='pb-5 space-y-5'>
            <DialogTitle className='py-5 '>New Purchase Requests</DialogTitle>

            <hr />
            <Form {...formHook}>
              <form
                onSubmit={formHook.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={formHook.control}
                    name='vendor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requisition Name</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
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
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={formHook.control}
                    name='tender_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Project' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='Single Source'>
                                Project A
                              </SelectItem>
                              <SelectItem value='Open Tender'>
                                Project B
                              </SelectItem>
                              <SelectItem value='National Open Tender'>
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
                    name='tender_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='Single Source'>
                                Single Source
                              </SelectItem>
                              <SelectItem value='Open Tender'>
                                Open Tender
                              </SelectItem>
                              <SelectItem value='National Open Tender'>
                                National Open Tender
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={formHook.control}
                    name='tender_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Unit' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='Single Source'>
                                Project A
                              </SelectItem>
                              <SelectItem value='Open Tender'>
                                Project B
                              </SelectItem>
                              <SelectItem value='National Open Tender'>
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
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
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
                  name='vendor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Specification</FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          // placeholder="Type your description here."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-5'>
                  <DialogClose asChild>
                    <Button variant='ghost'>Close</Button>
                  </DialogClose>
                  <Button type='submit'>Save Changes</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <IconButton className='bg-[#F9F9F9] hover:text-primary'>
        <Icon icon='ant-design:delete-twotone' fontSize={15} />
      </IconButton>
    </div>
  );
};
