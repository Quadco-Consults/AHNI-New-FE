import DataTable from "components/Table/DataTable";
import { useMemo, useState } from "react";
import { useGetAllActivitesQuery } from "services/auth/auditLog";
import { format } from "date-fns";

import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { openDialog } from "store/ui";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";
import { FilterForm } from "components/shared/FilterForm";

import { useGetAllUsersQuery } from "services/auth/user";
import { FilterField } from "src";

const AuditLog = () => {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const debounceSearchQuery = useDebounce(searchQuery, {
    wait: 500,
  });

  const { data: activities, isFetching } = useGetAllActivitesQuery(
    { page, size: 10, search: debounceSearchQuery, ...filters },
    { refetchOnMountOrArgChange: true }
  );

  const { data: user } = useGetAllUsersQuery(
    // @ts-ignore
    { page },
    { refetchOnMountOrArgChange: true }
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

  return (
    <div>
      {" "}
      <TableFilters
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        filterAction={() => setFilterDrawerOpen(true)}
      >
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
