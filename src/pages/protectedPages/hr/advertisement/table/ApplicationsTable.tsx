import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { AdvertisementResults } from "definations/hr-types/advertisement";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { generatePath, Link } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import ScanIcon from "components/icons/ScanIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import AddSquareIcon from "components/icons/AddSquareIcon";
import JobApplicationAPI from "services/hrApi/hr-job-applications";
import { Loading } from "components/shared/Loading";

const ApplicationsTable = ({
  linkTitle,
  id,
  status = "",
}: {
  href?: string;
  linkTitle?: string;
  id?: string;
  status?: "shortlisted" | "";
}) => {
  const { data, isLoading } = JobApplicationAPI.useGetJobApplicationsQuery({
    status: status,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-start gap-2'>
        <span className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
          <SearchIcon />
          <input
            placeholder='Search'
            type='text'
            className='ml-2 h-6 w-full border-none bg-none focus:outline-none outline-none'
          />
        </span>
        <Button className='shadow-sm' variant='ghost'>
          <FilterIcon />
        </Button>
        {linkTitle && (
          <div className='ml-auto'>
            <Link
              to={generatePath(
                HrRoutes.ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION,
                {
                  id: id,
                }
              )}
            >
              {" "}
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                <p>{linkTitle}</p>
              </Button>
            </Link>
          </div>
        )}
      </div>
      <DataTable
        // @ts-ignore
        data={data?.data?.results}
        columns={columns}
        isLoading={false}
      />
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
            getValue() === "shortlisted"
              ? "bg-green-50 text-green-500"
              : getValue() === "applied"
              ? "bg-yellow-50 text-yellow-500"
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
                  id: data?.job,
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
              <Link
                to={generatePath(HrRoutes.ADVERTISEMENT_INTERVIEW_FORM, {
                  id: data?.job,
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
