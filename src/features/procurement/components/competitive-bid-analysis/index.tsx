"use client";

"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { useGetAllCbas } from "@/features/procurement/controllers/cbaController";
import { CbaResultsData } from "@/features/procurement/types/cba";
import PrinterIcon from "components/icons/PrinterIcon";
import SendIcon from "components/icons/SendIcon";
import { useState, useMemo } from "react";
import { Loading } from "components/Loading";
import { Plus } from "lucide-react";
import { Icon } from "@iconify/react";
import { useCurrentUser } from "@/features/procurement/controllers/committeeEvaluationController";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const CompetitiveAnalysis = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllCbas({
    page,
    size: 10,
  });

  if (isLoading) {
    return <Loading />;
  }
  // return;

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Competitive Bid Analysis</h4>
        <h6>
          Procurement -{" "}
          <span className='text-black font-medium dark:text-grey-dark'>
            Competitive Bid Analysis
          </span>
        </h6>
      </div>

      <Card className='space-y-10'>
        <div className='flex items-center justify-end'>
          <Link href={RouteEnum.RFQ_CREATE_CBA}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New
            </Button>
          </Link>
        </div>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none focus:outline-none outline-none w-full rounded-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          // @ts-ignore

          data={data?.data?.results || []}
          // @ts-ignore
          columns={columns}
          isLoading={isLoading}
          pagination={{
            // @ts-ignore
            total: data?.data.pagination.count ?? 0,
            // @ts-ignore
            // pageSize: 10 ?? 0,
            pageSize: data?.data.pagination.page_size ?? 0,
            // @ts-ignore
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default CompetitiveAnalysis;

const columns: ColumnDef<CbaResultsData>[] = [
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
    header: "RFQ No",
    accessorKey: "title",
    size: 300,
    cell: ({ row }) => {
      return (
        <p className='text-center'>
          {/* @ts-ignore */}
          {row?.original?.solicitation?.rfq_id || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "cba_type",
    size: 300,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "APPROVED" && "bg-green-200 text-green-500",
            getValue() === "REJECTED" && "bg-red-200 text-red-500",
            getValue() === "PENDING" && "bg-yellow-200 text-yellow-500",
            getValue() === "COMPLETED" && "bg-blue-200 text-blue-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "CBA Date",
    accessorKey: "cba_date",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row?.original} />,
  },
];

// Role-based permission system
const getUserRole = (user: any) => {
  const designation = user?.designation?.toLowerCase() || '';
  const role = user?.role?.toLowerCase() || '';
  const email = user?.email?.toLowerCase() || '';

  // Check for admin email patterns first
  if (email.includes('admin@') || email === 'admin@mail.com') {
    return 'ADMIN';
  }

  // Administrative roles (MD and Admin have full access)
  if (designation.includes('admin') || role.includes('admin') ||
      designation.includes('managing director') || designation.includes('md') ||
      role.includes('managing director') || role.includes('md') ||
      designation.includes('director') || role.includes('director') ||
      designation.includes('administrator') || role.includes('administrator')) {
    return 'ADMIN';
  }

  // Procurement roles
  if (designation.includes('procurement') || role.includes('procurement') ||
      designation.includes('officer') || role.includes('officer') ||
      designation.includes('manager') || role.includes('manager')) {
    return 'PROCUREMENT_STAFF';
  }

  // Default fallback - All AHNI staff can potentially be committee members
  return 'STAFF';
};

const ActionListAction = ({ data }: any) => {
  const currentUser = useCurrentUser();

  const userRole = useMemo(() => {
    // Ensure currentUser has valid data before determining role
    if (!currentUser?.id) return 'STAFF';
    return getUserRole(currentUser);
  }, [currentUser]);

  // Check if user is a committee member for this specific CBA
  const isCommitteeMemberForCBA = useMemo(() => {
    // Ensure both currentUser and committee_members exist
    if (!currentUser?.id || !data?.committee_members || !Array.isArray(data.committee_members)) {
      return false;
    }

    // More robust committee member check
    return data.committee_members.some((member: any) => {
      const memberId = member.id || member.user_id || member.member_id;
      const currentUserId = currentUser.id || (currentUser as any).user_id;
      return memberId === currentUserId;
    });
  }, [data?.committee_members, currentUser]);

  // Determine which actions to show based on role and committee membership
  const showEditAction = userRole === 'ADMIN' || userRole === 'PROCUREMENT_STAFF';
  const showDeleteAction = userRole === 'ADMIN' || userRole === 'PROCUREMENT_STAFF';
  const showPurchaseOrderAction = userRole === 'ADMIN' || userRole === 'PROCUREMENT_STAFF';

  // Committee members (anyone assigned to this CBA) can conduct evaluations
  // Procurement staff and admins can always conduct/check CBAs
  // If no role is determined, show basic conduct action as fallback
  const showConductAction = isCommitteeMemberForCBA || userRole === 'ADMIN' || userRole === 'PROCUREMENT_STAFF' || userRole === 'STAFF';

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              {/* View CBA Details - Everyone can view */}
              <Link
                className='w-full'
                href={generatePath(RouteEnum.PROCUREMENT_CBA_DETAILS, {
                  id: data?.id,
                })}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>

              {/* View Details - Everyone can view detailed information */}
              <Link
                className='w-full'
                href={generatePath(RouteEnum.PROCUREMENT_CBA_DETAILS_FULL, {
                  id: data?.id,
                })}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <Icon icon="mdi:file-document-multiple" className="w-4 h-4" />
                  View Details
                </Button>
              </Link>

              {/* Conduct CBA / Check CBA - Committee members and procurement staff */}
              {showConductAction && (
                <Link
                  className='w-full'
                  href={`/dashboard/procurement/competitive-bid-analysis/${data?.id}/vendor-analysis?id=${data?.solicitation?.id}&cba=${data?.id}`}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <SendIcon />
                    {/* Fixed: Always show Conduct CBA for consistency */}
                    Conduct CBA
                  </Button>
                </Link>
              )}

              {/* Edit CBA - Only procurement staff and admin */}
              {showEditAction && (
                <Link
                  className='w-full'
                  href={`/dashboard/procurement/solicitation-management/rfq/create/create-cba?cba_id=${data?.id}&edit=true`}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EditIcon />
                    Edit
                  </Button>
                </Link>
              )}

              {/* Generate Purchase Order - Only procurement staff and admin */}
              {showPurchaseOrderAction && (
                <Link
                  className='w-full'
                  href={`/dashboard/procurement/purchase-order/create?cba_id=${data?.id}&solicitation_id=${data?.solicitation?.id}`}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <PrinterIcon />
                    Generate PO
                  </Button>
                </Link>
              )}

              {/* Delete CBA - Only procurement staff and admin */}
              {showDeleteAction && (
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <DeleteIcon />
                  Delete
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
