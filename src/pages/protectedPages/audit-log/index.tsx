import DataTable from "components/Table/DataTable";
import { useState } from "react";
import { useGetAllActivitesQuery } from "services/auth/auditLog";
import { format } from "date-fns";

import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { openDialog } from "store/ui";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";

const AuditLog = () => {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);

  const { data: activities, isFetching } = useGetAllActivitesQuery(
    { page, size: 10 },
    { refetchOnMountOrArgChange: true }
  );

  //   console.log({ activities });

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
    console.log({ data });

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
  const audit_colum = [
    {
      header: "User",
      id: "user",
      accessorKey: "user",
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
    </div>
  );
};

export default AuditLog;
