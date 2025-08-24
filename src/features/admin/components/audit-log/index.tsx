import DataTable from "components/DataTable";
import { useMemo, useState } from "react";
import {
  useDownloadActivitiesMutation,
  useGetAllActivitesQuery,
} from "@/features/auth/controllers/auditLogController";
import { format } from "date-fns";

import IconButton from "components/IconButton";
import { Icon } from "@iconify/react";
import { openDialog } from "store/ui";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import TableFilters from "components/TableFilters";
import { useDebounce } from "ahooks";
import { FilterForm } from "components/FilterForm";

import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { FilterField } from "src";
import { Button } from "components/ui/button";

const AuditLog = () => {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const debounceSearchQuery = useDebounce(searchQuery, {
    wait: 500,
  });

  const { data: activities, isFetching } = useGetAllActivitesQuery({
    page,
    size: 10,
    search: debounceSearchQuery,
    ...filters,
  });

  const { downloadActivities, isLoading: downloading } =
    useDownloadActivitiesMutation();

  const { data: user } = useGetAllUsersQuery(
    // @ts-ignore
    { page }
  );

  const onViewAction = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AuditLog,
        dialogProps: {
          header: "View Log",
          data: item,
          type: "update",
        },
      })
    );
  };

  const Action = ({ data }: any) => {
    return (
      <div className=''>
        {" "}
        <IconButton
          className='bg-[#F9F9F9] hover:text-primary'
          onClick={() => onViewAction(data)}
        >
          <Icon icon='ph:eye-duotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

  const userOptions = useMemo(() => {
    if (!user?.data?.results) return [];

    return user.data.results.map(({ first_name, last_name, id }) => ({
      label: `${first_name} ${last_name}`.trim(),
      value: id,
    }));
  }, [user?.data?.results]);

  const auditLogFilters: FilterField[] = useMemo(
    () => [
      {
        name: "action_type",
        label: "Action Type",
        type: "enum",
        enumValues: [
          { label: "Create", value: "CREATE" },
          { label: "Update", value: "UPDATE" },
          { label: "Delete", value: "DELETE" },
          { label: "View", value: "VIEW" },
          { label: "Login", value: "LOGIN" },
          { label: "Logout", value: "LOGOUT" },
          { label: "Other", value: "OTHER" },
        ],
      },
      {
        name: "user",
        label: "User",
        type: "enum",
        enumValues: userOptions,
      },
    ],
    [userOptions]
  );

  const audit_colum = [
    {
      header: "User",
      id: "user",
      accessorKey: "user.full_name",
    },
    {
      header: "Action",
      id: "action_type_display",
      accessorKey: "action_type_display",
    },
    {
      header: "Module",
      id: "metadata.model",
      accessorKey: "metadata.model",
    },
    {
      header: "Details",
      id: "description",
      accessorKey: "description",
    },
    {
      header: "Date",
      accessorFn: ({ created_datetime }: { created_datetime: string }) =>
        format(created_datetime, "dd-MMM-yyyy"),
    },
    {
      header: "",
      id: "action",
      // @ts-ignore
      cell: ({ row }) => <Action data={row.original} />,
    },
  ];

  const handleDownload = async () => {
    try {
      const blob = await downloadActivities({
        search: debounceSearchQuery,
        ...filters,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "activities.csv"; // Or correct extension
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className='relative'>
      {" "}
      <TableFilters
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        filterAction={() => setFilterDrawerOpen(true)}
      >
        <div className='absolute right-0 top-0'>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? "Downloading..." : "Download Activities"}
          </Button>
        </div>
        <DataTable
          columns={audit_colum}
          data={activities?.data.results || []}
          isLoading={isFetching}
          pagination={{
            total: activities?.data.pagination.count ?? 0,
            pageSize: activities?.data.pagination.page_size ?? 0,
            onChange: (page: number) => setPage(page),
          }}
        />{" "}
        {isFilterDrawerOpen && (
          <FilterForm
            filters={auditLogFilters}
            values={filters}
            onChange={setFilters}
            onClose={() => setFilterDrawerOpen(false)}
          />
        )}
      </TableFilters>
    </div>
  );
};

export default AuditLog;
