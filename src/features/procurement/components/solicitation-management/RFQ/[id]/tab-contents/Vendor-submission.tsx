/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { SolicitationSubmissionResultsData } from "definations/procurement-types/solicitation";
import {
  useGetVendorBidSubmissions,
  useGetSolicitationSubmission,
} from "@/features/procurement/controllers/vendorBidSubmissionsController";
import IconButton from "components/IconButton";

const VendorSubmission = (props?: any) => {
  const params = useParams();
  const id = params?.id as string;

  console.log("🚀 VendorSubmission Component Loaded!", {
    componentProps: props,
    paramsId: id,
    timestamp: new Date().toISOString()
  });

  const { data, isLoading, error } = useGetSolicitationSubmission(id, !!id);

  // Enhanced Debug logging
  console.log("🔍 Vendor Submission Debug:", {
    solicitationId: id,
    fullData: data,
    isLoading: isLoading,
    error: error,
    // Check multiple possible data paths
    results_path1: data?.data?.data?.results,
    results_path2: data?.data?.results,
    results_path3: (data as any)?.results,
    results_path4: data?.data,
    dataKeys: data ? Object.keys(data) : null,
    dataDataKeys: data?.data ? Object.keys(data.data) : null,
  });

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="flex mt-1 justify-between items-center">
          <div className="border w-1/3 py-2 px-2 flex items-center rounded-lg">
            <Icon icon="iconamoon:search-light" fontSize={25} />
            <Input
              placeholder="Search Category"
              type="search"
              className="h-6 border-none bg-none"
            />
          </div>

          <Link href={RouteEnum.RFQ_DETAILS_BID_SUBMISSION.replace(":id", id)}>
            <Button variant="ghost" className="bg-[#FFF2F2] gap-2 text-primary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M12.0572 1.75C14.2479 1.74999 15.9686 1.74998 17.312 1.93059C18.6886 2.11568 19.7809 2.50272 20.6391 3.36091C21.4973 4.21911 21.8843 5.31137 22.0694 6.68802C22.25 8.03144 22.25 9.7521 22.25 11.9428V11.9428V12.0572V12.0572C22.25 14.2479 22.25 15.9686 22.0694 17.312C21.8843 18.6886 21.4973 19.7809 20.6391 20.6391C19.7809 21.4973 18.6886 21.8843 17.312 22.0694C15.9686 22.25 14.2479 22.25 12.0572 22.25H12.0572H11.9428H11.9428C9.7521 22.25 8.03144 22.25 6.68802 22.0694C5.31137 21.8843 4.21911 21.4973 3.36091 20.6391C2.50272 19.7809 2.11568 18.6886 1.93059 17.312C1.74998 15.9686 1.74999 14.2479 1.75 12.0572V11.9428C1.74999 9.75212 1.74998 8.03144 1.93059 6.68802C2.11568 5.31137 2.50272 4.21911 3.36091 3.36091C4.21911 2.50272 5.31137 2.11568 6.68802 1.93059C8.03144 1.74998 9.75212 1.74999 11.9428 1.75H12.0572Z"
                  fill="#FF0000"
                />
                <path
                  d="M8.73797 9.5C8.73797 7.70407 10.1956 6.25 11.9915 6.25C13.7874 6.25 15.2451 7.70407 15.2451 9.5C15.2451 11.2959 13.7874 12.75 11.9915 12.75C10.1956 12.75 8.73797 11.2959 8.73797 9.5Z"
                  fill="#FF0000"
                />
                <path
                  d="M6.98208 17.5425C6.68249 17.2564 6.67151 16.7817 6.95754 16.4821C9.57054 13.7453 14.3841 13.5975 17.0515 16.4917C17.3322 16.7963 17.3129 17.2708 17.0083 17.5515C16.8641 17.6844 16.6818 17.75 16.5 17.75H7.5C7.31383 17.75 7.12736 17.6812 6.98208 17.5425Z"
                  fill="#FF0000"
                />
              </svg>
              Manaual Bid Submission
            </Button>
          </Link>
        </div>

        {/* Debug info display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ Error loading bids: {error.message}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🔄 Loading bid submissions...
            </p>
          </div>
        )}

        {/* Try to find data in multiple possible paths */}
        {(() => {
          const possibleResults =
            data?.data?.data?.results ||
            data?.data?.results ||
            (data as any)?.results ||
            (Array.isArray(data?.data) ? data.data : []);

          const hasResults = possibleResults && possibleResults.length > 0;

          return (
            <>
              {!isLoading && !error && !hasResults && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ No bid submissions found for this RFQ
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Solicitation ID: {id}
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">
                    Check console for data structure details
                  </p>
                </div>
              )}

              <DataTable
                data={possibleResults || []}
                columns={columns}
                isLoading={isLoading}
              />
            </>
          );
        })()}
      </Card>
    </div>
  );
};

export default VendorSubmission;

const columns: ColumnDef<SolicitationSubmissionResultsData>[] = [
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
    cell: ({ row }) => {
      return <p>{row?.original?.vendor?.company_name}</p>;
    },
  },
  {
    header: "Type of Business",
    accessorKey: "Type_of_business",
    size: 200,
    cell: ({ row }) => {
      return <p>{row?.original?.vendor?.type_of_business}</p>;
    },
  },
  {
    header: "Reg No",
    accessorKey: "year_or_incorperation",
    size: 200,
    cell: ({ row }) => {
      return <p>{row?.original?.vendor?.company_registration_number}</p>;
    },
  },
  {
    header: "Prequalification",
    accessorKey: "prequalification",
    size: 200,
    cell: ({ row }) => {
      const status = row?.original?.vendor?.status;
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            status === "Approved" && "bg-green-200 text-green-500",
            status === "Fail" && "bg-red-200 text-red-500",
            status === "Pending" && "bg-yellow-200 text-yellow-500"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "RFQ No.",
    accessorKey: "rfq_no",
    size: 200,
    cell: ({ row }) => {
      return <p>{row?.original?.solicitation?.rfq_id}</p>;
    },
  },
  {
    header: "RFQ Date",
    accessorKey: "rfq_date",
    size: 200,
    cell: ({ row }) => {
      return <p>{row?.original?.solicitation?.rfq_date || "-"}</p>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row?.original?.bid_details?.status;
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            status === "PASSED" && "bg-green-200 text-green-500",
            status === "FAIL" && "bg-red-200 text-red-500",
            status === "PENDING" && "bg-yellow-200 text-yellow-500"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Company Email",
    accessorKey: "company_email",
    size: 200,
    cell: ({ row }) => {
      return <p>{row?.original?.vendor?.email}</p>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  console.log({ datads: data?.solicitation?.id });

  return (
    <div className="flex gap-2">
      <Link href={RouteEnum.VENDOR_MANAGEMENT_DETAILS.replace(":id", data?.id)}>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ph:eye-duotone" fontSize={15} />
        </IconButton>
      </Link>
      <Link
        href={RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_START.replace(
          ":id",
          data?.id as string
        ).replace(":appID", data?.solicitation?.id)}
      >
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          Evaluate
        </IconButton>
      </Link>
    </div>
  );
};
