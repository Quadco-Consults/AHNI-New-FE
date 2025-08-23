"use client";

"use client";

/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/Card";
import IconButton from "components/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
// import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Input } from "components/ui/input";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useGetVendors, useDeleteVendor } from "@/features/procurement/controllers/vendorsController";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { toast } from "sonner";

const VendorManagement = () => {
  const { data, isLoading } = useGetVendors({});

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Prequalification</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Vendor Management
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <div className='space-y-5'>
          <h4 className='text-lg font-bold'>Prequalification</h4>

          <div className='flex items-center justify-between mt-1'>
            <div className='flex items-center gap-2 '>
              <div className='flex items-center w-[300px] px-2 py-2 border rounded-lg'>
                <Icon icon='iconamoon:search-light' fontSize={25} />
                <Input
                  placeholder='Search Category'
                  type='search'
                  className='h-6 border-none bg-none'
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className='bg-[#FFF2F2] text-primary'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        opacity='0.4'
                        d='M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.04791 14.2064 8.31387 13.4181 7.65183 12.6556C6.98548 11.8882 6.37216 11.1236 5.92664 10.5528C5.70347 10.2668 5.44902 9.93847 5.19463 9.59307C4.86712 9.14837 4.96211 8.52237 5.4068 8.19486C5.58556 8.0632 5.79362 7.99983 5.99982 8L11.9999 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z'
                        fill='#FF0000'
                      />
                      <path
                        d='M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.15076 14.2973 8.53312 13.6506 7.95439 13L13 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z'
                        fill='#FF0000'
                      />
                    </svg>
                    Actions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64'>
                  <h4 className='p-5 text-base font-medium'>Filter Options</h4>
                  <hr />

                  <div className='p-5 space-y-5'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-5'>
                        <Checkbox checked />
                        <h6>Approved</h6>
                      </div>
                      <div className='flex items-center gap-5'>
                        <Checkbox />
                        <h6>Pending</h6>
                      </div>
                      <div className='flex items-center gap-5'>
                        <Checkbox />
                        <h6>In Progress</h6>
                      </div>
                      <div className='flex items-center gap-5'>
                        <Checkbox />
                        <h6>Rejected</h6>
                      </div>
                    </div>

                    <div className='flex justify-end gap-4'>
                      <Button variant='ghost'>Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* <Link href={generatePath(RouteEnum.VENDOR_REGISTRATION)}>
              <Button>
                <span>
                  <Plus size={20} />
                </span>
                Add Vendor
              </Button>
            </Link> */}
          </div>
        </div>

        <DataTable
          columns={columns}
          // @ts-ignore
          data={data?.data?.results || []}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default VendorManagement;

const columns: ColumnDef<VendorsResultsData>[] = [
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
    header: "Vendor Name",
    accessorKey: "company_name",
    size: 250,
  },
  {
    header: "Type of Business",
    accessorKey: "type_of_business",
    size: 250,
  },
  {
    header: "Company Reg No",
    accessorKey: "company_registration_number",
    size: 200,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Approved" && "bg-green-200 text-green-800",
            getValue() === "Fail" && "bg-red-200 text-red-800",
            getValue() === "Pending" && "bg-yellow-200 text-yellow-800"
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
  const { deleteVendor } = useDeleteVendor(data.id);

  const deleteVendorHandler = async (id: string) => {
    try {
      await deleteVendor();
      toast.success("Document successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <div className='flex gap-2'>
      <Link
        className='w-full'
        href={`/dashboard/procurement/vendor-management/vendor-registration?id=${data?.id}`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='solar:pen-bold-duotone' fontSize={15} />
        </IconButton>
      </Link>

      <Link
        href={`/dashboard/procurement/vendor-management/prequalification/${data.id}`}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </Link>
      <IconButton
        onClick={() => deleteVendorHandler(data.id)}
        className='bg-[#F9F9F9] hover:text-primary'
      >
        <Icon icon='ant-design:delete-twotone' fontSize={15} />
      </IconButton>
    </div>
  );
};

// const VendorAction = ({ data }) => {
//   return (
//     <div className="flex gap-3">
//       <div>
//         <Avatar>
//           <AvatarImage src={data.vendor.png} />
//           <AvatarFallback>{data.vendor.name}</AvatarFallback>
//         </Avatar>
//       </div>
//       <div>
//         <h4 className="font-bold">{data.vendor.name}</h4>
//         <h6>{data.vendor.desc}</h6>
//       </div>
//     </div>
//   );
// };
