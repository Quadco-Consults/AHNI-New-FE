"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Card from "@/components/Card";
import IconButton from "@/components/IconButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import { useGetVendors, useDeleteVendor, useBulkUploadVendors } from "@/features/procurement/controllers/vendorsController";
import { VendorsResultsData } from "@/definations/procurement-types/vendors";
import Link from "next/link";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import VendorBulkUploadModal from "./vendor-management/VendorBulkUploadModal";
import { VendorTemplateData } from "@/features/procurement/utils/vendorTemplateGenerator";

const SupplierDatabase = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const { data, isLoading, refetch } = useGetVendors({
    status: "Approved",
  });
  const { bulkUploadVendors } = useBulkUploadVendors();

  const handleBulkUpload = async (vendors: VendorTemplateData[]) => {
    // Transform vendor data to match backend API format
    const transformedVendors = vendors.map((vendor) => {
      const keyStaff = [];
      const branches = [];

      // Add key staff
      if (vendor.key_staff_name_1) {
        keyStaff.push({
          name: vendor.key_staff_name_1,
          phone_number: vendor.key_staff_phone_1 || "",
          email: vendor.key_staff_email_1 || "",
        });
      }
      if (vendor.key_staff_name_2) {
        keyStaff.push({
          name: vendor.key_staff_name_2,
          phone_number: vendor.key_staff_phone_2 || "",
          email: vendor.key_staff_email_2 || "",
        });
      }
      if (vendor.key_staff_name_3) {
        keyStaff.push({
          name: vendor.key_staff_name_3,
          phone_number: vendor.key_staff_phone_3 || "",
          email: vendor.key_staff_email_3 || "",
        });
      }

      // Add branches
      if (vendor.branch_address_1) {
        branches.push({ address: vendor.branch_address_1 });
      }
      if (vendor.branch_address_2) {
        branches.push({ address: vendor.branch_address_2 });
      }
      if (vendor.branch_address_3) {
        branches.push({ address: vendor.branch_address_3 });
      }

      return {
        company_name: vendor.company_name,
        company_registration_number: vendor.company_registration_number,
        tin: vendor.tin,
        email: vendor.email,
        company_address: vendor.company_address,
        state: vendor.state,
        nature_of_business: vendor.nature_of_business,
        area_of_specialization: vendor.area_of_specialization,
        key_staff: keyStaff,
        branches: branches,
        status: "Approved", // Default status for bulk uploaded vendors
      };
    });

    try {
      await bulkUploadVendors(transformedVendors);
      refetch(); // Refresh the vendor list
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

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
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-bold'>Supplier Database</h4>
          <Button onClick={() => setShowBulkUpload(true)}>
            <Upload size={18} className='mr-2' />
            Bulk Upload Vendors
          </Button>
        </div>

        <DataTable
          data={data?.data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>

      <VendorBulkUploadModal
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
      />
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
    accessorKey: "company_registration_number",
  },
  {
    header: "Tax ID Number",
    size: 200,
    accessorKey: "tin",
  },
  {
    header: "State",
    size: 200,
    accessorKey: "state",
  },
  {
    header: "Area of Specialization",
    size: 300,
    accessorKey: "area_of_specialization",
    cell: ({ row }) => (
      <div className='space-y-2'>
        {row.original.approved_categories_details?.map(({ name }, idx) => {
          return (
            <div className='' key={idx}>
              {idx + 1}. {name}
            </div>
          );
        }) || "-"}
      </div>
    ),
  },
  {
    header: "Main Office Address",
    size: 240,
    accessorKey: "company_address",
  },
  {
    header: "Other Opt.Addresses",
    size: 240,
    accessorKey: "other_opt_addresses",
    cell: ({ row }) => (
      <div className='space-y-2'>
        {row.original.branches?.map(({ address }, idx) => {
          return (
            <div className='' key={idx}>
              {idx + 1}. {address}
            </div>
          );
        }) || "-"}
      </div>
    ),
  },

  {
    header: "Point of Contact Person",
    size: 200,
    accessorKey: "point_of_contact_person",
    cell: ({ row }) => (
      <div className='space-y-2'>
        {row.original.key_staff?.length > 0 ? row.original.key_staff[0]?.name : "-"}
      </div>
    ),
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
    cell: ({ row }) => (
      <div className='space-y-2'>
        {(row.original.key_staff?.length > 0 &&
          row.original.key_staff[0]?.phone_number) ||
          "-"}
      </div>
    ),
  },
  {
    header: "Mobile Number 2",
    size: 200,
    accessorKey: "mobile_number_2",
    cell: ({ row }) => (
      <div className='space-y-2'>
        {(row.original.key_staff?.length > 1 &&
          row.original.key_staff[1]?.phone_number) ||
          "-"}
      </div>
    ),
  },
  {
    header: "Mobile Number 3",
    size: 200,
    accessorKey: "mobile_number_3",
    cell: ({ row }) => (
      <div className='space-y-2'>
        {(row.original.key_staff?.length > 2 &&
          row.original.key_staff[2]?.phone_number) ||
          "-"}
      </div>
    ),
  },
  {
    header: "Products/Services",
    accessorKey: "nature_of_business",
    size: 300,
  },
  {
    header: "Status",
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
  const { deleteVendor } = useDeleteVendor(data.id);

  const deleteVendorHandler = async (id: string) => {
    try {
      deleteVendor();
      toast.success("Document successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      // console.log(error);
    }
  };
  return (
    <div className='flex gap-1'>
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

const VendorAction = ({ data }: any) => {
  return (
    <div className='flex items-center gap-3'>
      <div>
        <Avatar>
          <AvatarImage src={data?.vendor?.passport} />
          <AvatarFallback>{data?.company_name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className='font-bold'>{data?.company_name || "N/A"}</h4>
        {/* <h6>{data?.company_address}</h6> */}
      </div>
    </div>
  );
};
