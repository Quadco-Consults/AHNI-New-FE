"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { AdvertisementResults } from "@/features/hr/types/advertisement";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ScanIcon from "components/icons/ScanIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
// import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import AddSquareIcon from "components/icons/AddSquareIcon";
import {
  useGetJobApplications,
  usePatchJobApplicationAccepted,
  usePatchJobApplicationPreferred,
  useUpdateJobApplicationToInterviewed,
} from "@/features/hr/controllers/hrJobApplicationsController";
import { useCombinedApplicationStatus, getStatusDisplay } from "@/features/hr/controllers/useCombinedApplicationStatus";
import { useGetJobAdvertisements } from "@/features/hr/controllers/jobAdvertisementController";
import { Loading } from "components/Loading";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import useDebounce from "utils/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import SearchBar from "components/atoms/SearchBar";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useGetInterviews } from "@/features/hr/controllers/hrInterviewController";

const ApplicationsTable = ({
  linkTitle,
  id: propId,
  status = "",
  isOnboardingPage = false,
}: {
  href?: string;
  linkTitle?: string;
  id?: string;
  status?: "SHORTLISTED" | "PREFERRED" | "ACCEPTED" | "";
  isOnboardingPage?: boolean;
}) => {
  const dispatch = useAppDispatch();

  // Get ID from URL params if available
  const params = useParams();
  const urlId = params?.id;

  // State for selected advertisement
  const [selectedAdvertId, setSelectedAdvertId] = useState<string | undefined>(
    propId || urlId
  );

  // State for advertisement search
  const [advertSearchTerm, setAdvertSearchTerm] = useState("");
  const debouncedAdvertSearch = useDebounce(advertSearchTerm, 1000);

  // Fetch advertisements for dropdown
  const { data: advertsData, isLoading: isLoadingAdverts } =
    useGetJobAdvertisements({
      search: debouncedAdvertSearch,
    });

  // Use combined applications + interviews data for real status
  const { data: combinedData, isLoading } = useCombinedApplicationStatus(
    selectedAdvertId || "",
    status
  );

  // Fallback to original data structure for compatibility
  const data = {
    data: {
      results: combinedData
    }
  };

  // Determine if we need to show the advertisement selector
  const showAdvertSelector = !propId && !urlId;

  // Define columns inside component to access isOnboardingPage
  const getColumns = (): ColumnDef<AdvertisementResults>[] => [
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
      header: "Application Name",
      accessorKey: "applicant_name",
      size: 250,
      cell: ({ row }) => (
        <p>
          {row?.original?.applicant_first_name}{" "}
          {row?.original?.applicant_middle_name}{" "}
          {row?.original?.applicant_last_name}
        </p>
      ),
    },
    {
      header: "Position Applied",
      accessorKey: "position_applied",
      size: 200,
      cell: ({ row }) => (
        <p>{typeof row?.original?.position_applied === 'string' ? row.original.position_applied : 'N/A'}</p>
      ),
    },
    {
      header: "Employment Type",
      accessorKey: "employment_type",
      size: 150,
      cell: ({ row }) => (
        <p>{typeof row?.original?.employment_type === 'string' ? row.original.employment_type : 'N/A'}</p>
      ),
    },
    {
      header: "Candidate Email",
      accessorKey: "applicant_email",
      cell: ({ row }) => (
        <p>{typeof row?.original?.applicant_email === 'string' ? row.original.applicant_email : 'N/A'}</p>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const statusDisplay = getStatusDisplay(row.original);
        return (
          <Badge
            className={`p-1 rounded-lg ${statusDisplay.color}`}
          >
            {statusDisplay.text}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 100,
      cell: ({ row }) => <ActionList data={row.original} isOnboardingPage={isOnboardingPage} />,
    },
  ];

  if (isLoading && selectedAdvertId) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {showAdvertSelector && (
        <Select onValueChange={setSelectedAdvertId} value={selectedAdvertId}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select an advertisement' />
          </SelectTrigger>
          <SelectContent>
            {isLoadingAdverts ? (
              <div className='flex justify-center items-center p-4'>
                <p className='text-sm text-muted-foreground'>Loading...</p>
              </div>
            ) : (advertsData?.data?.results || []).length > 0 ? (
              (advertsData?.data?.results || []).map((advert) => (
                <SelectItem key={advert.id} value={advert.id}>
                  {advert.title}
                </SelectItem>
              ))
            ) : (
              <div className='flex justify-center items-center p-4'>
                <p className='text-sm text-muted-foreground'>
                  No advertisements found
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
      )}

      <div className='my-3 border' />

      <div className='flex items-center justify-start gap-2'>
        <SearchBar />

        <Button className='shadow-sm' variant='ghost'>
          <FilterIcon />
        </Button>

        {linkTitle && selectedAdvertId && (
          <div className='ml-auto'>
            <Link
              href={`/dashboard/hr/advertisement/${selectedAdvertId}/application-form`}
            >
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                <p>{linkTitle}</p>
              </Button>
            </Link>
          </div>
        )}

        {status === "SHORTLISTED" && (
          <div className='ml-auto'>
            <Button
              className='flex gap-2 py-6'
              type='button'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: DialogType.CREATE_INTERVIEW,
                    dialogProps: {
                      ...mediumDailogScreen,
                      header: "Create Interview",
                      data: urlId,
                    },
                  })
                )
              }
            >
              <AddSquareIcon />
              <p>Create Interview</p>
            </Button>
          </div>
        )}
      </div>

      {!selectedAdvertId ? (
        <div className='text-center py-8 border rounded-md'>
          <p className='text-gray-500'>
            Please select an advertisement to view applications
          </p>
        </div>
      ) : (
        <DataTable
          // @ts-ignore
          data={data?.data?.results}
          columns={getColumns()}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;

const ActionList = ({ data, isOnboardingPage }: { data: any; isOnboardingPage: boolean }) => {
  const { patchJobApplicationAccepted } = usePatchJobApplicationAccepted(data?.id as string);
  const { patchJobApplicationPreferred } = usePatchJobApplicationPreferred(data?.id as string);
  const { updateJobApplicationToInterviewed } = useUpdateJobApplicationToInterviewed(data?.id as string);

  const statusInfo = getStatusDisplay(data);
  const hasCompletedInterview = data?.interviewCompleted || false;
  const realStatus = statusInfo.status;

  const handleAccepted = async () => {
    try {
      console.log("🎯 Attempting to accept application");
      console.log("📋 Current data.status:", data?.status);
      console.log("📋 Current realStatus:", realStatus);
      console.log("📋 Has completed interview:", hasCompletedInterview);

      if (realStatus === "INTERVIEWED" && data?.status?.toLowerCase() !== "interviewed") {
        console.log("🔄 Auto-syncing database status to INTERVIEWED");
        try {
          const updateResult = await updateJobApplicationToInterviewed();
          console.log("✅ Status auto-sync successful:", updateResult);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
          console.error("❌ Failed to sync status to INTERVIEWED:", error);
          toast.error("Failed to update interview status. Please try again.");
          return;
        }
      }

      await patchJobApplicationAccepted({ status: "ACCEPTED" });
      toast.success("Applicant accepted successfully");
    } catch (error) {
      console.error("❌ Accept application error:", error);
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Failed to update status";
      toast.error(`Failed to accept application: ${errorMessage}`);
    }
  };

  const handlePreferred = async () => {
    try {
      await patchJobApplicationPreferred({ status: "PREFERRED" });
      toast.success("Applicant preferred successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={`/dashboard/hr/advertisement/${data?.advertisement}/submitted-applications/${data?.id}`}
              className='flex flex-col items-start justify-between gap-1'
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>

            {data?.status?.toLowerCase() === "accepted" && !isOnboardingPage && (
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={handlePreferred}
              >
                <CheckCheckIcon />
                Mark as Preferred
              </Button>
            )}

            {data?.status?.toLowerCase() === "accepted" && isOnboardingPage && (
              <Link
                href={`/dashboard/hr/onboarding/start-onboarding/${data?.id}`}
                className='flex flex-col items-start justify-between gap-1'
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <CheckCheckIcon />
                  Onboard
                </Button>
              </Link>
            )}

            {data?.status?.toLowerCase() === "preferred" && (
              <Link
                href={`/dashboard/hr/onboarding/start/${data?.id}`}
                className='flex flex-col items-start justify-between gap-1'
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <ScanIcon />
                  Onboard
                </Button>
              </Link>
            )}

            {(data?.status?.toLowerCase() === "shortlisted" || realStatus === "INTERVIEWED") && (
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={handleAccepted}
              >
                <CheckCheckIcon />
                Accept
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
