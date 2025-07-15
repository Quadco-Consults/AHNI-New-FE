import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { AdvertisementResults } from "definations/hr-types/advertisement";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link, useParams } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ScanIcon from "components/icons/ScanIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
// import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import AddSquareIcon from "components/icons/AddSquareIcon";
import {
  useGetJobApplicationsQuery,
  usePatchJobApplicationAcceptedMutation,
  usePatchJobApplicationPreferredMutation,
} from "services/hrApi/hr-job-applications";
import { useGetJobAdvertisementsQuery } from "services/hrApi/hr-job-advertisement";
import { Loading } from "components/shared/Loading";
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
import SearchBar from "atoms/SearchBar";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const ApplicationsTable = ({
  linkTitle,
  id: propId,
  status = "",
}: {
  href?: string;
  linkTitle?: string;
  id?: string;
  status?: "SHORTLISTED" | "PREFERRED" | "ACCEPTED" | "";
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
    useGetJobAdvertisementsQuery({
      search: debouncedAdvertSearch,
    });

  // Fetch applications using the ID directly
  const { data, isLoading } = useGetJobApplicationsQuery(
    {
      status: status,
      id: selectedAdvertId || "",
    },
    { skip: !selectedAdvertId }
  );

  // Determine if we need to show the advertisement selector
  const showAdvertSelector = !propId && !urlId;

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
              to={generatePath(
                HrRoutes.ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION,
                {
                  id: selectedAdvertId,
                }
              )}
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
          columns={columns}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;

const columns: ColumnDef<AdvertisementResults>[] = [
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
  },
  {
    header: "Position Applied",
    accessorKey: "position_applied",
    size: 200,
  },
  {
    header: "Employment type",
    accessorKey: "employment_type",
    size: 250,
  },
  {
    header: "Applicant Email",
    accessorKey: "applicant_email",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg capitalize",
            getValue().toLowerCase() === "shortlisted"
              ? "bg-green-50 text-green-500"
              : getValue().toLowerCase() === "applied"
              ? "bg-yellow-50 text-yellow-500"
              : getValue().toLowerCase() === "accepted"
              ? "bg-black text-white"
              : "bg-blue-50 text-blue-500"
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
    size: 100,
    cell: ({ row }) => <ActionList data={row.original} />,
  },
];

const ActionList = ({ data }: any) => {
  // const navigate = useNavigate();
  const [patchJobApplicationAccepted] =
    usePatchJobApplicationAcceptedMutation();
  const [patchJobApplicationPreferred] =
    usePatchJobApplicationPreferredMutation();
  const handleAccepted = async () => {
    try {
      await patchJobApplicationAccepted({
        id: data?.id as string,
        body: {
          status: "ACCEPTED",
        },
      }).unwrap();
      toast.success("Applicant accepted successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  const handlePreferred = async () => {
    try {
      await patchJobApplicationPreferred({
        id: data?.id as string,
        body: {
          status: "PREFERRED",
        },
      }).unwrap();
      toast.success("Applicant preferred successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

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
              <Link
                to={generatePath(HrRoutes.ADVERTISEMENT_DETAIL_SUB_APP, {
                  id: data?.advertisement,
                  appID: data?.id,
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

              {data?.status?.toLowerCase() === "shortlisted" && (
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => {
                    handlePreferred();
                  }}
                >
                  <CheckCheckIcon />
                  Mark as Preferred
                </Button>
              )}
              {data?.status?.toLowerCase() === "interviewed" && (
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => {
                    handleAccepted();
                  }}
                >
                  <CheckCheckIcon />
                  Accept
                </Button>
              )}
              {data?.status?.toLowerCase() === "preferred" && (
                <Link
                  to={generatePath(HrRoutes.ONBOARDING_START, {
                    id: data?.id,
                  })}
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
              {data?.status?.toLowerCase() === "shortlisted" && (
                <Link
                  to={generatePath(HrRoutes.ADVERTISEMENT_INTERVIEW_FORM, {
                    id: data?.advertisement,
                    appID: data?.id,
                  })}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <ScanIcon />
                    Interview
                  </Button>
                </Link>
              )}
              {/* {data?.status?.toLowerCase() === "applied" && (
                <Link
                  to={generatePath(HrRoutes.ADVERTISEMENT_INTERVIEW_FORM, {
                    id: data?.advertisement,
                    appID: data?.id,
                  })}
                >
                  <Button
                    className='w-full flex items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <CheckCheck />
                    Shortlist
                  </Button>
                </Link>
              )} */}

              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <DeleteIcon />
                delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};
