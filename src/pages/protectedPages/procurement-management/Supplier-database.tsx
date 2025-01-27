/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import VendorsAPI from "services/procurementApi/vendors";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { generatePath, Link } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { toast } from "sonner";

const SupplierDatabase = () => {
  const { data, isLoading } = VendorsAPI.useGetVendorsQuery({
    // @ts-ignore
    params: { status: "Approved" },
  });

  console.log({ data });

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Supplier Database</h4>
        <h6>
          Procurement -{" "}
          <span className='text-black font-medium dark:text-grey-dark'>
            Supplier Database
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <h4 className='text-lg font-bold'>Supplier Database</h4>

        <DataTable
          data={data?.data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default SupplierDatabase;

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
    header: "Vendor",
    accessorKey: "vendor",
    size: 350,
    cell: ({ row }) => <VendorAction data={row.original} />,
  },
  {
    header: "RC Number",
    size: 200,
    accessorKey: "rc_number",
  },
  {
    header: "Tax ID Number",
    size: 200,
    accessorKey: "tin",
  },
  {
    header: "Area of Specialization",
    size: 200,
    accessorKey: "area_of_specialization",
  },
  {
    header: "Main Office Address",
    size: 200,
    accessorKey: "main_office_address",
  },
  {
    header: "Other Opt.Addresses",
    size: 200,
    accessorKey: "other_opt_addresses",
  },

  {
    header: "Point of Contact Person",
    size: 200,
    accessorKey: "point_of_contact_person",
  },

  {
    header: "Company Email",
    size: 200,
    accessorKey: "email",
  },
  {
    header: "Mobile Number 1",
    size: 200,
    accessorKey: "mobile_number_1",
  },
  {
    header: "Mobile Number 2",
    size: 200,
    accessorKey: "mobile_number_2",
  },
  {
    header: "Mobile Number 3",
    size: 200,
    accessorKey: "mobile_number_3",
  },
  {
    header: "Products/Services",
    accessorKey: "nature_of_business",
    size: 300,
  },
  {
    header: "Evaluation Status",
    size: 200,
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-200 text-green-500",
            getValue() === "Inactive" && "bg-red-200 text-red-500",
            getValue() === "Pending" && "bg-yellow-200 text-yellow-500"
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
  const [deleteVendorMutation] = VendorsAPI.useDeleteVendorMutation();

  const deleteVendorHandler = async (id: string) => {
    try {
      await deleteVendorMutation({ path: { id: id } }).unwrap;
      toast.success("Document successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <div className='flex gap-1'>
      <Link
        className='w-full'
        to={{
          pathname: RouteEnum.VENDOR_REGISTRATION,
          search: `?id=${data?.id}`,
        }}
      >
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='solar:pen-bold-duotone' fontSize={15} />
        </IconButton>
      </Link>

      <Link
        to={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: data.id })}
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

const VendorAction = ({ data }: any) => {
  return (
    <div className='flex items-center gap-3'>
      <div>
        <Avatar>
          <AvatarImage src={data?.vendor?.png} />
          <AvatarFallback>{data?.company_name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className='font-bold'>{data?.company_name}</h4>
        {/* <h6>{data?.company_address}</h6> */}
      </div>
    </div>
  );
};
