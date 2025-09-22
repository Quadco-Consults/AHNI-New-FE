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
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import IconButton from "components/IconButton";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }
  return path;
};

const VendorSubmission = (props?: any) => {
  const params = useParams();
  const id = params?.id as string;

  console.log("🚀 RFP VendorSubmission Component Loaded!", {
    componentProps: props,
    paramsId: id,
    timestamp: new Date().toISOString()
  });

  const { data, isLoading, error } = useGetSolicitationSubmission(id, !!id);

  return (
    <div className='space-y-10'>
      <Card className='space-y-10'>
        <div className='flex mt-1 justify-between items-center'>
          <div className='border w-1/3 py-2 px-2 flex items-center rounded-lg'>
            <Icon icon='iconamoon:search-light' fontSize={25} />
            <Input
              placeholder='Search Category'
              type='search'
              className='h-6 border-none bg-none'
            />
          </div>

          <Link
            href={generatePath(RouteEnum.RFP_DETAILS_BID_SUBMISSION, {
              id: id,
            })}
          >
            <Button variant='ghost' className='bg-[#FFF2F2] gap-2 text-primary'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  opacity='0.4'
                  d='M12.0572 1.75C14.2479 1.74999 15.9686 1.74998 17.312 1.93059C18.6886 2.11568 19.7809 2.50272 20.6391 3.36091C21.4973 4.21911 21.8843 5.31137 22.0694 6.68802C22.25 8.03144 22.25 9.7521 22.25 11.9428V11.9428V12.0572V12.0572C22.25 14.2479 22.25 15.9686 22.0694 17.312C21.8843 18.6886 21.4973 19.7809 20.6391 20.6391C19.7809 21.4973 18.6886 21.8843 17.312 22.0694C15.9686 22.25 14.2479 22.25 12.0572 22.25H12.0572H11.9428H11.9428C9.7521 22.25 8.03144 22.25 6.68802 22.0694C5.31137 21.8843 4.21911 21.4973 3.36091 20.6391C2.50272 19.7809 2.11568 18.6886 1.93059 17.312C1.74998 15.9686 1.74999 14.2479 1.75 12.0572V11.9428C1.74999 9.75212 1.74998 8.03144 1.93059 6.68802C2.11568 5.31137 2.50272 4.21911 3.36091 3.36091C4.21911 2.50272 5.31137 2.11568 6.68802 1.93059C8.03144 1.74998 9.75212 1.74999 11.9428 1.75H12.0572Z'
                  fill='#FF0000'
                />
                <path
                  d='M8.73797 9.5C8.73797 7.70407 10.1956 6.25 11.9915 6.25C13.7874 6.25 15.2451 7.70407 15.2451 9.5C15.2451 11.2959 13.7874 12.75 11.9915 12.75C10.1956 12.75 8.73797 11.2959 8.73797 9.5Z'
                  fill='#FF0000'
                />
                <path
                  d='M6.98208 17.5425C6.68249 17.2564 6.67151 16.7817 6.95754 16.4821C9.57054 13.7453 14.3841 13.5975 17.0515 16.4917C17.3322 16.7963 17.3129 17.2708 17.0083 17.5515C16.8641 17.6844 16.6818 17.75 16.5 17.75H7.5C7.31383 17.75 7.12736 17.6812 6.98208 17.5425Z'
                  fill='#FF0000'
                />
              </svg>
              Manual Proposal Submission
            </Button>
          </Link>
        </div>

        {/* Debug info display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ Error loading proposals: {error.message}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🔄 Loading proposal submissions...
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
                    ⚠️ No proposal submissions found for this RFP
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Solicitation ID: {id}
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
      return <p className="font-medium">{row?.original?.vendor?.company_name}</p>;
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
    header: "Document Compliance",
    accessorKey: "document_compliance",
    size: 200,
    cell: ({ row }) => {
      // Mock data showing document compliance status
      const compliance = row?.original?.document_compliance || {
        total_required: 7,
        submitted: 5,
        status: "INCOMPLETE"
      };

      const isComplete = compliance.submitted >= compliance.total_required;

      return (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm">
            {compliance.submitted}/{compliance.total_required} docs
          </span>
          <Badge
            className={`text-xs px-2 py-0.5 ${
              isComplete
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {isComplete ? 'Complete' : 'Pending'}
          </Badge>
        </div>
      );
    },
  },
  {
    header: "RFP No.",
    accessorKey: "rfp_no",
    size: 200,
    cell: ({ row }) => {
      return <p className="font-mono text-sm">{row?.original?.solicitation?.rfq_id}</p>;
    },
  },
  {
    header: "Submission Date",
    accessorKey: "submission_date",
    size: 150,
    cell: ({ row }) => {
      // This would be the actual submission date
      const submissionDate = row?.original?.created_at || row?.original?.submission_date;
      return <p className="text-sm">{submissionDate ? new Date(submissionDate).toLocaleDateString() : "-"}</p>;
    },
  },
  {
    header: "Experience Review",
    accessorKey: "experience_status",
    size: 150,
    cell: ({ row }) => {
      const status = row?.original?.experience_evaluation?.status || "PENDING";
      const score = row?.original?.experience_evaluation?.score || 0;

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              status === "PASSED" && "bg-green-100 text-green-700 border-green-200",
              status === "FAILED" && "bg-red-100 text-red-700 border-red-200",
              status === "PENDING" && "bg-yellow-100 text-yellow-700 border-yellow-200"
            )}
          >
            {status}
          </Badge>
          <span className="text-xs text-gray-600">{score}/40</span>
        </div>
      );
    },
  },
  {
    header: "Financial Capacity",
    accessorKey: "financial_status",
    size: 150,
    cell: ({ row }) => {
      const status = row?.original?.financial_evaluation?.status || "PENDING";
      const score = row?.original?.financial_evaluation?.score || 0;

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              status === "PASSED" && "bg-green-100 text-green-700 border-green-200",
              status === "FAILED" && "bg-red-100 text-red-700 border-red-200",
              status === "PENDING" && "bg-yellow-100 text-yellow-700 border-yellow-200"
            )}
          >
            {status}
          </Badge>
          <span className="text-xs text-gray-600">{score}/30</span>
        </div>
      );
    },
  },
  {
    header: "Overall Status",
    accessorKey: "overall_status",
    size: 130,
    cell: ({ row }) => {
      const status = row?.original?.proposal_details?.overall_status || "UNDER_REVIEW";
      return (
        <Badge
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            status === "APPROVED" && "bg-green-100 text-green-700 border-green-200",
            status === "REJECTED" && "bg-red-100 text-red-700 border-red-200",
            (status === "UNDER_REVIEW" || status === "PENDING") && "bg-blue-100 text-blue-700 border-blue-200"
          )}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 120,
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  return (
    <div className='flex gap-1'>
      {/* View Submitted Documents */}
      <Link
        href={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: data?.id })}
        title="View Submitted Documents (Company Profile, Tax Clearance, Financial Reports, etc.)"
      >
        <IconButton className='bg-[#E3F2FD] hover:bg-[#BBDEFB] text-blue-600 hover:text-blue-800'>
          <Icon icon='material-symbols:folder-open-outline' fontSize={14} />
        </IconButton>
      </Link>

      {/* Experience & Financial Capacity Review */}
      <Link
        href={`/dashboard/procurement/rfp-evaluation/${data?.id}?rfp=${data?.solicitation?.id}`}
        title="Review Technical Experience & Financial Capacity"
      >
        <IconButton className='bg-[#FFF3E0] hover:bg-[#FFE0B2] text-orange-600 hover:text-orange-800'>
          <Icon icon='material-symbols:fact-check-outline' fontSize={14} />
        </IconButton>
      </Link>

      {/* AHNI Committee Decision */}
      <Link
        href={`/dashboard/procurement/rfp-committee-review/${data?.id}?rfp=${data?.solicitation?.id}`}
        title="AHNI Committee Pass/Fail Decision"
      >
        <IconButton className='bg-[#E8F5E8] hover:bg-[#C8E6C9] text-green-600 hover:text-green-800'>
          <Icon icon='material-symbols:how-to-vote-outline' fontSize={14} />
        </IconButton>
      </Link>
    </div>
  );
};
