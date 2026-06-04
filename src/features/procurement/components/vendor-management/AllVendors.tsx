"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Card from "@/components/Card";
import IconButton from "@/components/IconButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useGetVendors, useDeleteVendor, useBulkUploadVendors } from "@/features/procurement/controllers/vendorsController";
import { VendorsResultsData } from "@/definations/procurement-types/vendors";
import Link from "next/link";
import { toast } from "sonner";
import { Upload } from 'lucide-react';
import VendorBulkUploadModal from "./VendorBulkUploadModal";
import { VendorTemplateData } from "@/features/procurement/utils/vendorTemplateGenerator";

const AllVendors = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>(""); // Empty = all statuses
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useGetVendors({
    status: statusFilter,
    page: currentPage,
    size: pageSize,
    search: searchQuery,
  });
  const { bulkUploadVendors } = useBulkUploadVendors();

  // Extract pagination info from response
  const pagination = data?.data?.paginator;

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
        status: "Pending", // Default status for bulk uploaded vendors
      };
    });

    try {
      await bulkUploadVendors(transformedVendors);
      setCurrentPage(1); // Reset to first page to see new vendors
      refetch(); // Refresh the vendor list
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>All Vendors</h4>
        <h6>
          Procurement -{" "}
          <span className='text-black font-medium dark:text-grey-dark'>
            All Vendors
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-bold'>Vendor Management</h4>
          <div className="flex gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1); // Reset to first page when changing filter
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setShowBulkUpload(true)}>
              <Upload size={18} className='mr-2' />
              Bulk Upload Vendors
            </Button>
          </div>
        </div>

        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            data={data?.data?.results || []}
            columns={columns}
            isLoading={isLoading}
          />
        </TableFilters>

        {/* Pagination Controls */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-2 py-4 border-t">
            {/* Results Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {((pagination.page - 1) * pagination.page_size) + 1}
                </span>
                {" "}-{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(pagination.page * pagination.page_size, pagination.count)}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.count}
                </span>
                {" "}vendors
              </span>
            </div>

            {/* Page Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.previous || isLoading}
              >
                <Icon icon="solar:arrow-left-linear" className="mr-1" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === pagination.total_pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, idx, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsisBefore = idx > 0 && page - array[idx - 1] > 1;

                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsisBefore && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          disabled={isLoading}
                          className={cn(
                            "min-w-[2.5rem]",
                            currentPage === page && "bg-primary text-white"
                          )}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.next || isLoading}
              >
                Next
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                className="border rounded px-2 py-1 text-sm"
                disabled={isLoading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      <VendorBulkUploadModal
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default AllVendors;

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
    header: "Status",
    size: 150,
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            status === "Approved" && "bg-green-200 text-green-700",
            status === "Inactive" && "bg-gray-200 text-gray-700",
            status === "Pending" && "bg-yellow-200 text-yellow-700",
            status === "In Progress" && "bg-blue-200 text-blue-700",
            status === "Rejected" && "bg-red-200 text-red-700"
          )}
        >
          {status}
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
      toast.success("Vendor successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
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
      </div>
    </div>
  );
};
